import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { canSendAnnouncements, sendAnnouncement } from "@/lib/notifications";
import { canAccessAdmin } from "@/lib/permissions";

const broadcastSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    message: z.string().trim().min(5).max(1000),
    redirectUrl: z.string().trim().optional(),
    sendToAll: z.boolean().optional(),
    departments: z.array(z.string().trim()).optional().default([]),
    roles: z
      .array(z.enum(["SUPER_ADMIN", "ADMIN", "HR", "MANAGER", "EMPLOYEE", "DEVELOPER", "DIGITAL"]))
      .optional()
      .default([]),
    userIds: z.array(z.string().trim()).optional().default([])
  })
  .superRefine((value, ctx) => {
    const hasAudience =
      value.sendToAll ||
      value.departments.length > 0 ||
      value.roles.length > 0 ||
      value.userIds.length > 0;

    if (!hasAudience) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select all employees or choose at least one department, role, or user.",
        path: ["sendToAll"]
      });
    }
  });

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role) || !canSendAnnouncements(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = broadcastSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid broadcast payload", details: parsed.error.flatten() }, { status: 400 });
  }

  await sendAnnouncement({
    senderId: session.user.id,
    title: parsed.data.title,
    message: parsed.data.message,
    redirectUrl: parsed.data.redirectUrl || "/admin",
    sendToAll: parsed.data.sendToAll,
    departments: parsed.data.departments,
    roles: parsed.data.roles as UserRole[],
    userIds: parsed.data.userIds
  });

  return NextResponse.json({ success: true });
}
