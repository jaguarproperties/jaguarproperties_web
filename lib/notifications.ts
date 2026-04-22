import { UserRole } from "@prisma/client";
import { subDays } from "date-fns";

import { LATE_MARK_HOUR, LATE_MARK_MINUTE, getDayEnd, getDayStart, getScopedEmployees } from "@/lib/hr";
import { prisma } from "@/lib/prisma";

type NotificationPayload = {
  userId: string;
  senderId?: string;
  title: string;
  message: string;
  type: "LEAVE_APPLIED" | "LEAVE_STATUS" | "ATTENDANCE_EDITED" | "ATTENDANCE_ALERT" | "ANNOUNCEMENT";
  redirectUrl?: string;
  eventKey?: string;
};

type Viewer = {
  id: string;
  role: UserRole;
};

const NOTIFICATION_RETENTION_DAYS = 14;

export function canSendAnnouncements(role: UserRole) {
  return role === "HR" || role === "MANAGER" || role === "ADMIN" || role === "SUPER_ADMIN";
}

async function createNotification(payload: NotificationPayload) {
  if (payload.eventKey) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: payload.userId,
        eventKey: payload.eventKey
      },
      select: { id: true }
    });

    if (existing) return existing;
  }

  return prisma.notification.create({
    data: {
      userId: payload.userId,
      senderId: payload.senderId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      redirectUrl: payload.redirectUrl,
      eventKey: payload.eventKey
    }
  });
}

export async function createNotifications(payloads: NotificationPayload[]) {
  for (const payload of payloads) {
    await createNotification(payload);
  }
}

export async function getNotificationSummary(userId: string, limit = 8) {
  await prisma.notification.deleteMany({
    where: {
      createdAt: {
        lt: subDays(new Date(), NOTIFICATION_RETENTION_DAYS)
      }
    }
  });

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit
    }),
    prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    })
  ]);

  return { notifications, unreadCount };
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId
    },
    select: { id: true }
  });

  if (!notification) return null;

  return prisma.notification.update({
    where: { id: notification.id },
    data: { isRead: true }
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: { isRead: true }
  });
}

export async function notifyLeaveApplied(args: {
  employeeId: string;
  employeeName: string;
  managerId?: string | null;
  leaveId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
}) {
  const hrUsers = await prisma.user.findMany({
    where: {
      role: { in: ["HR", "ADMIN", "SUPER_ADMIN"] }
    },
    select: { id: true }
  });

  const recipientIds = Array.from(
    new Set([args.managerId, ...hrUsers.map((user) => user.id)].filter((value): value is string => Boolean(value)))
  );

  await createNotifications(
    recipientIds.map((userId) => ({
      userId,
      title: "New Leave Application",
      message: `${args.employeeName} applied for ${args.leaveType} leave from ${args.startDate.toLocaleDateString()} to ${args.endDate.toLocaleDateString()}.`,
      type: "LEAVE_APPLIED",
      redirectUrl: "/admin/leave-requests",
      eventKey: `leave-applied:${args.leaveId}:${userId}`
    }))
  );
}

export async function notifyLeaveStatus(args: {
  employeeId: string;
  leaveId: string;
  status: "APPROVED" | "REJECTED";
  remarks?: string | null;
}) {
  await createNotifications([
    {
      userId: args.employeeId,
      title: args.status === "APPROVED" ? "Leave Approved" : "Leave Rejected",
      message:
        args.remarks && args.remarks.trim().length > 0
          ? `Your leave request was ${args.status.toLowerCase()}. Remark: ${args.remarks}`
          : `Your leave request was ${args.status.toLowerCase()}.`,
      type: "LEAVE_STATUS",
      redirectUrl: "/admin/leave-requests",
      eventKey: `leave-status:${args.leaveId}:${args.status}`
    }
  ]);
}

export async function notifyAttendanceEdited(args: {
  employeeId: string;
  editorId: string;
  editorName: string;
  attendanceId: string;
  reason?: string;
}) {
  if (args.employeeId === args.editorId) return;

  await createNotifications([
    {
      userId: args.employeeId,
      senderId: args.editorId,
      title: "Attendance Updated",
      message: args.reason
        ? `${args.editorName} updated your attendance. Reason: ${args.reason}`
        : `${args.editorName} updated your attendance record.`,
      type: "ATTENDANCE_EDITED",
      redirectUrl: "/admin/attendance",
      eventKey: `attendance-edited:${args.attendanceId}:${args.employeeId}`
    }
  ]);
}

export async function ensureAttendanceAlerts(viewer: Viewer) {
  if (!(viewer.role === "HR" || viewer.role === "MANAGER" || viewer.role === "ADMIN" || viewer.role === "SUPER_ADMIN")) {
    return;
  }

  const now = new Date();
  if (
    now.getHours() < LATE_MARK_HOUR ||
    (now.getHours() === LATE_MARK_HOUR && now.getMinutes() <= LATE_MARK_MINUTE)
  ) {
    return;
  }

  const dayStart = getDayStart(now);
  const dayEnd = getDayEnd(now);
  const employees = (await getScopedEmployees(viewer)).filter((employee) => employee.id !== viewer.id);
  const employeeIds = employees.map((employee) => employee.id);

  if (employeeIds.length === 0) return;

  const [attendanceRecords, approvedLeaves] = await Promise.all([
    prisma.attendance.findMany({
      where: {
        employeeId: { in: employeeIds },
        date: {
          gte: dayStart,
          lte: dayEnd
        }
      },
      select: {
        id: true,
        employeeId: true,
        isLate: true,
        checkInTime: true
      }
    }),
    prisma.leaveRequest.findMany({
      where: {
        employeeId: { in: employeeIds },
        status: "APPROVED",
        startDate: { lte: dayEnd },
        endDate: { gte: dayStart }
      },
      select: {
        employeeId: true
      }
    })
  ]);

  const recordsByEmployeeId = new Map(attendanceRecords.map((record) => [record.employeeId, record]));
  const leaveEmployeeIds = new Set(approvedLeaves.map((leave) => leave.employeeId));
  const alertPayloads: NotificationPayload[] = [];

  for (const employee of employees) {
    if (leaveEmployeeIds.has(employee.id)) continue;

    const record = recordsByEmployeeId.get(employee.id);

    if (!record) {
      alertPayloads.push({
        userId: viewer.id,
        title: "No Check-In Recorded",
        message: `${employee.name ?? employee.email} has not checked in today.`,
        type: "ATTENDANCE_ALERT",
        redirectUrl: `/admin/attendance?employeeId=${employee.id}`,
        eventKey: `attendance-alert:no-check-in:${formatAlertDate(dayStart)}:${employee.id}:${viewer.id}`
      });
      continue;
    }

    if (record.isLate) {
      alertPayloads.push({
        userId: viewer.id,
        title: "Late Check-In Alert",
        message: `${employee.name ?? employee.email} checked in late today.`,
        type: "ATTENDANCE_ALERT",
        redirectUrl: `/admin/attendance?employeeId=${employee.id}`,
        eventKey: `attendance-alert:late:${formatAlertDate(dayStart)}:${employee.id}:${viewer.id}`
      });
    }
  }

  await createNotifications(alertPayloads);
}

function formatAlertDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function sendAnnouncement(args: {
  senderId: string;
  title: string;
  message: string;
  redirectUrl?: string;
  sendToAll?: boolean;
  departments?: string[];
  roles?: UserRole[];
  userIds?: string[];
}) {
  const recipients = args.sendToAll
    ? await prisma.user.findMany({
        select: { id: true }
      })
    : await prisma.user.findMany({
        where: {
          OR: [
            ...(args.departments && args.departments.length > 0
              ? [{ department: { in: args.departments } }]
              : []),
            ...(args.roles && args.roles.length > 0 ? [{ role: { in: args.roles } }] : []),
            ...(args.userIds && args.userIds.length > 0 ? [{ id: { in: args.userIds } }] : [])
          ]
        },
        select: { id: true }
      });

  await createNotifications(
    Array.from(new Set(recipients.map((recipient) => recipient.id))).map((recipientId) => ({
      userId: recipientId,
      senderId: args.senderId,
      title: args.title,
      message: args.message,
      type: "ANNOUNCEMENT",
      redirectUrl: args.redirectUrl || "/admin"
    }))
  );
}
