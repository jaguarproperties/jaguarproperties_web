import {
  AttendanceStatus,
  LeaveDuration,
  AttendanceWorkType,
  LeaveStatus,
  LeaveType,
  Prisma,
  UserRole,
} from "@prisma/client";
import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth
} from "date-fns";

import { getHolidayDateKeySet, isScheduledWorkingDay } from "@/lib/holidays";
import { prisma } from "@/lib/prisma";

export type ViewerSession = {
  id: string;
  role: UserRole;
};

type LeaveBalanceFields = {
  casualLeaveBalance: number;
  sickLeaveBalance: number;
  paidLeaveBalance: number;
  unpaidLeaveBalance: number;
};

export type AttendanceFilters = {
  month?: string;
  from?: string;
  to?: string;
  employeeId?: string;
  department?: string;
  role?: string;
  search?: string;
};

export const LATE_MARK_HOUR = 9;
export const LATE_MARK_MINUTE = 45;
const AUTO_LEAVE_NOTE_PREFIX = "Auto-synced from leave request";

export function getAttendanceLocation(location: Prisma.JsonValue | null | undefined) {
  if (!location || typeof location !== "object" || Array.isArray(location)) return null;
  return location as {
    checkIn?: { latitude?: number; longitude?: number; address?: string };
    checkOut?: { latitude?: number; longitude?: number; address?: string };
  };
}

export function getTotalLeaveBalance(user: Partial<LeaveBalanceFields>) {
  return (
    (user.casualLeaveBalance ?? 0) +
    (user.sickLeaveBalance ?? 0) +
    (user.paidLeaveBalance ?? 0) +
    (user.unpaidLeaveBalance ?? 0)
  );
}

export function getLeaveBalanceField(leaveType: LeaveType) {
  switch (leaveType) {
    case "CASUAL":
      return "casualLeaveBalance";
    case "SICK":
      return "sickLeaveBalance";
    case "UNPAID":
      return "unpaidLeaveBalance";
    case "PAID":
    case "OTHER":
    default:
      return "paidLeaveBalance";
  }
}

export function getDayStart(value = new Date()) {
  return startOfDay(value);
}

export function getDayEnd(value = new Date()) {
  return endOfDay(value);
}

export function getMonthRange(month?: string) {
  const baseDate = month ? parseISO(`${month}-01`) : new Date();
  return {
    start: startOfMonth(baseDate),
    end: endOfMonth(baseDate)
  };
}

export function getDateRange(filters: AttendanceFilters) {
  if (filters.from || filters.to) {
    const from = filters.from ? startOfDay(parseISO(filters.from)) : startOfDay(new Date("2000-01-01"));
    const to = filters.to ? endOfDay(parseISO(filters.to)) : endOfDay(new Date());
    return { start: from, end: to };
  }

  return getMonthRange(filters.month);
}

export function calculateWorkingMinutes(checkInTime?: Date | null, checkOutTime?: Date | null) {
  if (!checkInTime || !checkOutTime) return 0;
  return Math.max(0, Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 60000));
}

export function formatWorkingHours(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function isLateCheckIn(date: Date) {
  return date.getHours() > LATE_MARK_HOUR || (date.getHours() === LATE_MARK_HOUR && date.getMinutes() > LATE_MARK_MINUTE);
}

function getAutoCheckoutThreshold(value = new Date()) {
  const threshold = new Date(value);
  threshold.setHours(23, 58, 0, 0);
  return threshold;
}

function getAutoCheckoutTime(value = new Date()) {
  const checkout = new Date(value);
  checkout.setHours(23, 58, 0, 0);
  return checkout;
}

export async function applyAutomaticAttendanceCheckout(value = new Date()) {
  if (value < getAutoCheckoutThreshold(value)) return;

  const date = getDayStart(value);
  const autoCheckoutTime = getAutoCheckoutTime(value);
  const openRecords = await prisma.attendance.findMany({
    where: {
      date,
      checkInTime: { not: null },
      checkOutTime: null
    }
  });

  if (openRecords.length === 0) return;

  await prisma.$transaction(
    openRecords.map((record) =>
      prisma.attendance.update({
        where: { id: record.id },
        data: {
          checkOutTime: autoCheckoutTime,
          workingMinutes: calculateWorkingMinutes(record.checkInTime, autoCheckoutTime),
          status: "PRESENT",
          editReason: "System auto check-out at 11:58 PM"
        }
      })
    )
  );
}

function getScopeMode(role: UserRole) {
  if (role === "HR" || role === "ADMIN" || role === "SUPER_ADMIN") return "organization";
  if (role === "MANAGER") return "team";
  return "self";
}

async function getTeamEmployeeIds(viewerId: string) {
  const teamMembers = await prisma.user.findMany({
    where: { reportingManagerId: viewerId },
    select: { id: true }
  });

  return teamMembers.map((member) => member.id);
}

export async function getScopedEmployeeIds(viewer: ViewerSession, requestedEmployeeId?: string) {
  const mode = getScopeMode(viewer.role);

  if (mode === "organization") {
    return requestedEmployeeId ? [requestedEmployeeId] : null;
  }

  if (mode === "team") {
    const teamIds = [viewer.id, ...(await getTeamEmployeeIds(viewer.id))];
    if (requestedEmployeeId) {
      return teamIds.includes(requestedEmployeeId) ? [requestedEmployeeId] : [];
    }
    return teamIds;
  }

  if (requestedEmployeeId && requestedEmployeeId !== viewer.id) {
    return [];
  }

  return [viewer.id];
}

export async function getScopedEmployeeWhere(viewer: ViewerSession, filters: AttendanceFilters = {}): Promise<Prisma.UserWhereInput> {
  const scopedIds = await getScopedEmployeeIds(viewer, filters.employeeId);
  const where: Prisma.UserWhereInput = {};

  if (scopedIds) {
    where.id = { in: scopedIds.length > 0 ? scopedIds : ["__no_results__"] };
  }

  if (filters.department) {
    where.department = filters.department;
  }

  if (filters.role) {
    where.role = filters.role as UserRole;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { email: { contains: filters.search } },
      { username: { contains: filters.search } }
    ];
  }

  return where;
}

export async function getScopedEmployees(viewer: ViewerSession, filters: AttendanceFilters = {}) {
  const where = await getScopedEmployeeWhere(viewer, filters);

  try {
    const employees = await prisma.user.findMany({
      where,
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        phone: true,
        username: true,
        role: true,
        department: true,
        defaultWorkType: true,
        casualLeaveBalance: true,
        sickLeaveBalance: true,
        paidLeaveBalance: true,
        unpaidLeaveBalance: true,
        reportingManagerId: true,
        reportingManager: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: [{ name: "asc" }, { email: "asc" }]
    });

    return employees.map((employee) => ({
      ...employee,
      leaveBalance: getTotalLeaveBalance(employee),
      reportingManagerName: employee.reportingManager?.name ?? employee.reportingManager?.email ?? null
    }));
  } catch (error) {
    console.warn("Falling back to a reduced employee query for attendance scope.", error);

    const employees = await prisma.user.findMany({
      where,
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        phone: true,
        username: true,
        role: true,
        department: true,
        reportingManagerId: true
      },
      orderBy: [{ name: "asc" }, { email: "asc" }]
    });

    return employees.map((employee) => ({
      ...employee,
      defaultWorkType: AttendanceWorkType.OFFICE,
      employeeCode: employee.employeeCode,
      phone: employee.phone,
      casualLeaveBalance: 0,
      sickLeaveBalance: 0,
      paidLeaveBalance: 0,
      unpaidLeaveBalance: 0,
      reportingManager: null,
      reportingManagerName: null,
      leaveBalance: 0
    }));
  }
}

export async function getAttendanceRecords(viewer: ViewerSession, filters: AttendanceFilters = {}) {
  await applyAutomaticAttendanceCheckout();
  const { start, end } = getDateRange(filters);
  const employees = await getScopedEmployees(viewer, filters);
  const employeeIds = employees.map((employee) => employee.id);

  if (employeeIds.length === 0) {
    return { employees, records: [], range: { start, end } };
  }

  const records = await prisma.attendance.findMany({
    where: {
      employeeId: { in: employeeIds },
      date: { gte: start, lte: end }
    },
    include: {
      employee: {
        select: {
          id: true,
          employeeCode: true,
          name: true,
          email: true,
          department: true,
          role: true
        }
      },
      editedBy: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: [{ date: "desc" }, { checkInTime: "desc" }]
  });

  return { employees, records, range: { start, end } };
}

export async function getLeaveRequests(viewer: ViewerSession, filters: AttendanceFilters = {}) {
  const { start, end } = getDateRange(filters);
  const employees = await getScopedEmployees(viewer, filters);
  const employeeIds = employees.map((employee) => employee.id);

  if (employeeIds.length === 0) {
    return { employees, leaves: [] };
  }

  const leaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId: { in: employeeIds },
      OR: [
        {
          startDate: { gte: start, lte: end }
        },
        {
          endDate: { gte: start, lte: end }
        },
        {
          AND: [{ startDate: { lte: start } }, { endDate: { gte: end } }]
        }
      ]
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
          casualLeaveBalance: true,
          sickLeaveBalance: true,
          paidLeaveBalance: true,
          unpaidLeaveBalance: true,
          role: true
        }
      },
      approvedBy: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: [{ createdAt: "desc" }]
  });

  return {
    employees,
    leaves: leaves.map((leave) => ({
      ...leave,
      employee: {
        ...leave.employee,
        leaveBalance: getTotalLeaveBalance(leave.employee)
      }
    }))
  };
}

export async function getTodayAttendanceForUser(userId: string) {
  await applyAutomaticAttendanceCheckout();
  return prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId: userId,
        date: getDayStart()
      }
    }
  });
}

function getLeaveDays(startDate: Date, endDate: Date) {
  return eachDayOfInterval({
    start: startOfDay(startDate),
    end: startOfDay(endDate)
  }).filter((day) => isScheduledWorkingDay(day));
}

function getLeaveUnits(duration: LeaveDuration) {
  return duration === "FULL_DAY" ? 1 : 0.5;
}

function consumesLeaveBalance(leaveType: LeaveType) {
  return leaveType !== "UNPAID";
}

export async function syncApprovedLeaveToAttendance(leaveId: string) {
  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId }
  });

  if (!leave || leave.status !== "APPROVED") return;

  const days = getLeaveDays(leave.startDate, leave.endDate);

  await prisma.$transaction(
    days.map((day) =>
      prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: leave.employeeId,
            date: day
          }
        },
        update: {
          status: leave.leaveDuration === "FULL_DAY" ? "LEAVE" : "HALF_DAY",
          editReason: `${AUTO_LEAVE_NOTE_PREFIX} ${leave.id}`
        },
        create: {
          employeeId: leave.employeeId,
          date: day,
          status: leave.leaveDuration === "FULL_DAY" ? "LEAVE" : "HALF_DAY",
          editReason: `${AUTO_LEAVE_NOTE_PREFIX} ${leave.id}`
        }
      })
    )
  );

  if (consumesLeaveBalance(leave.leaveType)) {
    const decrement = days.length * getLeaveUnits(leave.leaveDuration);
    const balanceField = getLeaveBalanceField(leave.leaveType);
    await prisma.user.update({
      where: { id: leave.employeeId },
      data: {
        [balanceField]: {
          decrement
        }
      }
    });
  }
}

export async function clearApprovedLeaveAttendance(leaveId: string) {
  await prisma.attendance.deleteMany({
    where: {
      editReason: `${AUTO_LEAVE_NOTE_PREFIX} ${leaveId}`,
      checkInTime: null,
      checkOutTime: null,
      status: {
        in: ["LEAVE", "HALF_DAY"]
      }
    }
  });
}

export async function logAttendanceEdit(input: {
  attendanceId?: string;
  editorId: string;
  reason: string;
  previousData?: Prisma.InputJsonValue;
  nextData?: Prisma.InputJsonValue;
}) {
  const data = input.attendanceId
    ? input
    : {
        editorId: input.editorId,
        reason: input.reason,
        previousData: input.previousData,
        nextData: input.nextData
      };

  return prisma.attendanceEditLog.create({
    data
  });
}

export async function updateLeaveBalance(input: {
  employeeId: string;
  editorId: string;
  leaveBalance: number;
  note?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { id: input.employeeId },
    select: {
      casualLeaveBalance: true,
      sickLeaveBalance: true,
      paidLeaveBalance: true,
      unpaidLeaveBalance: true
    }
  });

  if (!existing) {
    throw new Error("Employee not found");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: input.employeeId },
      data: { paidLeaveBalance: Math.round(input.leaveBalance), casualLeaveBalance: 0, sickLeaveBalance: 0, unpaidLeaveBalance: 0 }
    }),
    prisma.leaveBalanceLog.create({
      data: {
        employeeId: input.employeeId,
        editorId: input.editorId,
        previousBalance: getTotalLeaveBalance(existing),
        newBalance: input.leaveBalance,
        note: input.note
      }
    })
  ]);
}

export async function getAttendanceSummary(viewer: ViewerSession, filters: AttendanceFilters = {}) {
  await applyAutomaticAttendanceCheckout();
  const { start, end } = getDateRange(filters);
  const employees = await getScopedEmployees(viewer, filters);
  const employeeIds = employees.map((employee) => employee.id);

  if (employeeIds.length === 0) {
    return {
      employees,
      summary: [],
      range: { start, end },
      totals: { totalEmployees: 0, presentToday: 0, onLeaveToday: 0, absentToday: 0 }
    };
  }

  const [records, approvedLeaves, holidayKeySet] = await Promise.all([
    prisma.attendance.findMany({
      where: {
        employeeId: { in: employeeIds },
        date: { gte: start, lte: end }
      }
    }),
    prisma.leaveRequest.findMany({
      where: {
        employeeId: { in: employeeIds },
        status: "APPROVED",
        startDate: { lte: end },
        endDate: { gte: start }
      }
    }),
    getHolidayDateKeySet(start, end)
  ]);

  const recordMap = new Map<string, (typeof records)[number]>();
  for (const record of records) {
    recordMap.set(`${record.employeeId}:${format(record.date, "yyyy-MM-dd")}`, record);
  }

  const leaveMap = new Set<string>();
  for (const leave of approvedLeaves) {
    for (const day of getLeaveDays(leave.startDate, leave.endDate)) {
      leaveMap.add(`${leave.employeeId}:${format(day, "yyyy-MM-dd")}`);
    }
  }

  const intervalDays = eachDayOfInterval({ start, end }).filter(
    (day) => isScheduledWorkingDay(day) && !holidayKeySet.has(format(day, "yyyy-MM-dd"))
  );
  const today = getDayStart();
  const summary = employees.map((employee) => {
    let presentDays = 0;
    let absentDays = 0;
    let leaveDays = 0;
    let halfDays = 0;
    let lateMarks = 0;
    let totalWorkingMinutes = 0;

    for (const day of intervalDays) {
      const key = `${employee.id}:${format(day, "yyyy-MM-dd")}`;
      const record = recordMap.get(key);

      if (leaveMap.has(key) || record?.status === "LEAVE") {
        leaveDays += 1;
        continue;
      }

      if (!record) {
        if (day < today) {
          absentDays += 1;
        }
        continue;
      }

      totalWorkingMinutes += record.workingMinutes;
      if (record.isLate) lateMarks += 1;

      if (record.status === "HALF_DAY") {
        halfDays += 1;
      } else if (record.status === "PRESENT") {
        presentDays += 1;
      } else if (record.status === "ABSENT") {
        absentDays += 1;
      }
    }

    return {
      employee,
      workingDays: intervalDays.length,
      presentDays,
      absentDays,
      leaveDays,
      halfDays,
      lateMarks,
      totalWorkingMinutes
    };
  });

  const todayKey = format(today, "yyyy-MM-dd");
  const totals = {
    totalEmployees: employees.length,
    presentToday: 0,
    onLeaveToday: 0,
    absentToday: 0
  };

  const isTodayWorkingDay = isScheduledWorkingDay(today) && !holidayKeySet.has(todayKey);

  if (!isTodayWorkingDay) {
    return {
      employees,
      summary,
      range: { start, end },
      totals
    };
  }

  for (const employee of employees) {
    const key = `${employee.id}:${todayKey}`;
    const record = recordMap.get(key);

    if (leaveMap.has(key) || record?.status === "LEAVE") {
      totals.onLeaveToday += 1;
    } else if (record?.checkInTime || record?.status === "PRESENT" || record?.status === "HALF_DAY") {
      totals.presentToday += 1;
    } else {
      totals.absentToday += 1;
    }
  }

  return {
    employees,
    summary,
    range: { start, end },
    totals
  };
}
