import { NextResponse } from "next/server";
import { differenceInCalendarDays, startOfDay } from "date-fns";

import { auth } from "@/lib/auth";
import { getLeaveRequests } from "@/lib/hr";
import { notifyLeaveApplied } from "@/lib/notifications";
import { canAccessLeave } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { leaveApplicationSchema } from "@/lib/validations";

function getLeaveDurationLabel(duration: "FULL_DAY" | "FIRST_HALF" | "SECOND_HALF") {
  if (duration === "FIRST_HALF") return "First half";
  if (duration === "SECOND_HALF") return "Second half";
  return "Full day";
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canAccessLeave(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const filters = {
    month: searchParams.get("month") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    employeeId: searchParams.get("employeeId") ?? undefined,
    department: searchParams.get("department") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    search: searchParams.get("search") ?? undefined
  };

  const result = await getLeaveRequests({ id: session.user.id, role: session.user.role }, filters);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canAccessLeave(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = leaveApplicationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid leave payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const startDate = startOfDay(new Date(parsed.data.startDate));
  const endDate = startOfDay(new Date(parsed.data.endDate));
  const overlappingLeave = await prisma.leaveRequest.findFirst({
    where: {
      employeeId: session.user.id,
      status: { in: ["PENDING", "APPROVED"] },
      startDate: { lte: endDate },
      endDate: { gte: startDate }
    }
  });

  if (overlappingLeave) {
    return NextResponse.json({ error: "You already have a leave request covering these dates." }, { status: 409 });
  }

  const leave = await prisma.leaveRequest.create({
    data: {
      employeeId: session.user.id,
      leaveType: parsed.data.leaveType,
      leaveDuration: parsed.data.leaveDuration,
      startDate,
      endDate,
      reason: parsed.data.reason,
      remarks: `Requested for ${
        parsed.data.leaveDuration === "FULL_DAY" ? differenceInCalendarDays(endDate, startDate) + 1 : 0.5
      } day(s) - ${getLeaveDurationLabel(parsed.data.leaveDuration)}.`
    }
  });

  const employee = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      reportingManagerId: true
    }
  });

  if (employee) {
    await notifyLeaveApplied({
      employeeId: employee.id,
      employeeName: employee.name ?? employee.email,
      managerId: employee.reportingManagerId,
      leaveId: leave.id,
      leaveType: `${leave.leaveType} (${getLeaveDurationLabel(leave.leaveDuration)})`,
      startDate: leave.startDate,
      endDate: leave.endDate
    });
  }

  return NextResponse.json({ leave });
}
