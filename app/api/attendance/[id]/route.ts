import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isLateCheckIn, logAttendanceEdit } from "@/lib/hr";
import { notifyAttendanceEdited } from "@/lib/notifications";
import { canManageAttendance } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { attendanceEditSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || !(await canManageAttendance(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.attendance.findUnique({
    where: { id: params.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
  }

  const payload = await request.json();
  const parsed = attendanceEditSchema.safeParse({
    ...payload,
    employeeId: payload.employeeId ?? existing.employeeId,
    date: payload.date ?? existing.date.toISOString()
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid attendance payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const checkInTime = parsed.data.checkInTime ? new Date(parsed.data.checkInTime) : null;
  const checkOutTime = parsed.data.checkOutTime ? new Date(parsed.data.checkOutTime) : null;
  const totalWorkingMins =
    checkInTime && checkOutTime ? Math.max(0, Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 60000)) : 0;

  const record = await prisma.attendance.update({
    where: { id: params.id },
    data: {
      employeeId: parsed.data.employeeId,
      date: new Date(parsed.data.date),
      checkInTime,
      checkOutTime,
      workType: parsed.data.workType,
      status: parsed.data.status,
      editReason: parsed.data.notes,
      isLate: checkInTime ? isLateCheckIn(checkInTime) : false,
      workingMinutes: totalWorkingMins,
      editedById: session.user.id,
    }
  });

  await logAttendanceEdit({
    attendanceId: params.id,
    editorId: session.user.id,
    reason: parsed.data.notes || "Attendance override",
    previousData: existing,
    nextData: record
  });

  const editor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true
    }
  });

  await notifyAttendanceEdited({
    employeeId: parsed.data.employeeId,
    editorId: session.user.id,
    editorName: editor?.name ?? editor?.email ?? "HR",
    attendanceId: params.id,
    reason: parsed.data.notes
  });

  return NextResponse.json({ record });
}
