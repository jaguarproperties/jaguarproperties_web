import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { markAllNotificationsRead } from "@/lib/notifications";
import { canAccessAdmin } from "@/lib/permissions";

export async function POST() {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await markAllNotificationsRead(session.user.id);
  return NextResponse.json({ success: true });
}
