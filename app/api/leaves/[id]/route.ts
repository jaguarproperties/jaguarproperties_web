import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { clearApprovedLeaveAttendance, getScopedEmployeeIds, syncApprovedLeaveToAttendance } from "@/lib/hr";
import { notifyLeaveStatus } from "@/lib/notifications";
import { canAccessLeave, canApproveLeave } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { leaveDecisionSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || !(await canAccessLeave(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leave = await prisma.leaveRequest.findUnique({
    where: { id: params.id },
    include: {
      employee: {
        select: {
          id: true,
          reportingManagerId: true
        }
      }
    }
  });

  if (!leave) {
    return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
  }

  const payload = await request.json();

  if (payload.action === "cancel") {
    if (leave.employeeId !== session.user.id || leave.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending self requests can be cancelled." }, { status: 403 });
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: leave.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date()
      }
    });

    return NextResponse.json({ leave: updatedLeave });
  }

  if (!(await canApproveLeave(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (leave.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending leave requests can be updated." }, { status: 400 });
  }

  const scopedEmployeeIds = await getScopedEmployeeIds({ id: session.user.id, role: session.user.role }, leave.employeeId);
  if (!scopedEmployeeIds || scopedEmployeeIds.length === 0) {
    return NextResponse.json({ error: "You cannot manage this leave request." }, { status: 403 });
  }

  const parsed = leaveDecisionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid leave decision payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const updatedLeave = await prisma.leaveRequest.update({
    where: { id: leave.id },
    data: {
      status: parsed.data.status,
      remarks: parsed.data.remarks,
      approvedById: session.user.id
    }
  });

  if (parsed.data.status === "APPROVED") {
    await syncApprovedLeaveToAttendance(leave.id);
  }

  if (parsed.data.status === "REJECTED") {
    await clearApprovedLeaveAttendance(leave.id);
  }

  await notifyLeaveStatus({
    employeeId: leave.employeeId,
    leaveId: leave.id,
    status: parsed.data.status,
    remarks: parsed.data.remarks
  });

  return NextResponse.json({ leave: updatedLeave });
}
