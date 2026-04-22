import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getAttendanceRecords, getAttendanceSummary, getDayStart, isLateCheckIn, logAttendanceEdit } from "@/lib/hr";
import { notifyAttendanceEdited } from "@/lib/notifications";
import { canAccessAttendance, canManageAttendance } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { attendanceEditSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canAccessAttendance(session.user.role))) {
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

  const [attendance, summary] = await Promise.all([
    getAttendanceRecords({ id: session.user.id, role: session.user.role }, filters),
    getAttendanceSummary({ id: session.user.id, role: session.user.role }, filters)
  ]);

  return NextResponse.json({
    records: attendance.records,
    employees: attendance.employees,
    summary: summary.summary,
    totals: summary.totals,
    range: attendance.range
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canManageAttendance(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = attendanceEditSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid attendance payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const date = getDayStart(new Date(parsed.data.date));
  const existing = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId: parsed.data.employeeId,
        date
      }
    }
  });

  const checkInTime = parsed.data.checkInTime ? new Date(parsed.data.checkInTime) : null;
  const checkOutTime = parsed.data.checkOutTime ? new Date(parsed.data.checkOutTime) : null;
  const totalWorkingMins =
    checkInTime && checkOutTime ? Math.max(0, Math.round((checkOutTime.getTime() - checkInTime.getTime()) / 60000)) : 0;

  const nextData = {
    employeeId: parsed.data.employeeId,
    date,
    checkInTime,
    checkOutTime,
    workType: parsed.data.workType,
    status: parsed.data.status,
    editReason: parsed.data.notes,
    isLate: checkInTime ? isLateCheckIn(checkInTime) : false,
    workingMinutes: totalWorkingMins,
    editedById: session.user.id
  };

  const record = existing
    ? await prisma.attendance.update({
        where: { id: existing.id },
        data: nextData
      })
    : await prisma.attendance.create({
        data: nextData
      });

  await logAttendanceEdit({
    attendanceId: record.id,
    editorId: session.user.id,
    reason: parsed.data.notes || (existing ? "Manual attendance update" : "Manual attendance create"),
    previousData: existing ?? undefined,
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
    attendanceId: record.id,
    reason: parsed.data.notes
  });

  return NextResponse.json({ record });
}
