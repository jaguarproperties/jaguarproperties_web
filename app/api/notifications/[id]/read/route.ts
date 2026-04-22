import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { markNotificationRead } from "@/lib/notifications";
import { canAccessAdmin } from "@/lib/permissions";

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notification = await markNotificationRead(session.user.id, params.id);

  if (!notification) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, notification });
}
