import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { applyAutomaticAttendanceCheckout, calculateWorkingMinutes, getDayStart, isLateCheckIn } from "@/lib/hr";
import { canAccessAttendance } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { attendanceMarkSchema } from "@/lib/validations";

function mergeLocation(
  existing: Prisma.JsonValue | null | undefined,
  phase: "checkIn" | "checkOut",
  payload: { latitude?: number; longitude?: number; address?: string }
) : Prisma.InputJsonValue {
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};

  return {
    ...base,
    [phase]: {
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address
    }
  } as Prisma.InputJsonValue;
}

function normalizeLocationPayload(
  workType: "OFFICE" | "WFH" | null | undefined,
  payload: { latitude?: number; longitude?: number; address?: string }
) {
  if (workType === "WFH") {
    return {
      address: "WFH"
    };
  }

  return payload;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canAccessAttendance(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = attendanceMarkSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid attendance payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const now = new Date();
  await applyAutomaticAttendanceCheckout(now);
  const date = getDayStart(now);
  const existing = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId: session.user.id,
        date
      }
    }
  });

  if (parsed.data.action === "check-in") {
    if (!parsed.data.workType) {
      return NextResponse.json({ error: "Work type is required for check-in." }, { status: 400 });
    }

    if (existing?.checkInTime) {
      return NextResponse.json({ error: "You have already checked in today." }, { status: 409 });
    }

    const record = existing
      ? await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkInTime: now,
          workType: parsed.data.workType,
          location: mergeLocation(existing.location, "checkIn", normalizeLocationPayload(parsed.data.workType, parsed.data)),
          status: "PRESENT",
          isLate: isLateCheckIn(now)
        }
      })
      : await prisma.attendance.create({
          data: {
            employeeId: session.user.id,
            date,
            checkInTime: now,
            workType: parsed.data.workType,
            location: mergeLocation(null, "checkIn", normalizeLocationPayload(parsed.data.workType, parsed.data)),
            status: "PRESENT",
            isLate: isLateCheckIn(now)
          }
        });

    return NextResponse.json({ record });
  }

  if (!existing?.checkInTime) {
    return NextResponse.json({ error: "Check-in is required before check-out." }, { status: 400 });
  }

  if (existing.checkOutTime) {
    return NextResponse.json({ error: "You have already checked out today." }, { status: 409 });
  }

  const record = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOutTime: now,
      location: mergeLocation(existing.location, "checkOut", normalizeLocationPayload(existing.workType, parsed.data)),
      workingMinutes: calculateWorkingMinutes(existing.checkInTime, now),
      status: existing.checkInTime ? "PRESENT" : existing.status
    }
  });

  return NextResponse.json({ record });
}
