import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { canAccessAdmin, hasPermission } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireAdminPermission(permission: Permission, redirectTo = "/admin") {
  const session = await requireAdminSession();
  const requestedPermission: Permission = permission;

  if (!(await hasPermission(session.user.role, requestedPermission))) {
    redirect(redirectTo);
  }

  return session;
}
