import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ensureAttendanceAlerts, getNotificationSummary } from "@/lib/notifications";
import { canAccessAdmin } from "@/lib/permissions";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureAttendanceAlerts({ id: session.user.id, role: session.user.role });

  const limit = Number(new URL(request.url).searchParams.get("limit") ?? "8");
  const summary = await getNotificationSummary(session.user.id, Number.isFinite(limit) ? limit : 8);

  return NextResponse.json(summary);
}
