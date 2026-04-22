import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { updateLeaveBalance } from "@/lib/hr";
import { canManageAttendance } from "@/lib/permissions";
import { leaveBalanceSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: { employeeId: string } }) {
  const session = await auth();
  if (!session?.user || !(await canManageAttendance(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = leaveBalanceSchema.safeParse({
    employeeId: params.employeeId,
    leaveBalance: payload.leaveBalance,
    note: payload.note
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid leave balance payload", details: parsed.error.flatten() }, { status: 400 });
  }

  await updateLeaveBalance({
    employeeId: params.employeeId,
    editorId: session.user.id,
    leaveBalance: parsed.data.leaveBalance,
    note: parsed.data.note
  });

  return NextResponse.json({ success: true });
}
