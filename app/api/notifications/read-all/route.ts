import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { markAllNotificationsRead } from "@/lib/notifications";
import { canAccessAdmin } from "@/lib/permissions";

export async function POST() {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await markAllNotificationsRead(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn("Notifications read-all fallback: database is unavailable.", error);
    return NextResponse.json(
      { success: false, error: "Notifications are temporarily unavailable." },
      { status: 503 }
    );
  }
}
