import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin-access";
import { canManageRoles } from "@/lib/permissions";

export default async function RolesLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!(await canManageRoles(session.user.role))) {
    redirect("/admin");
  }

  return <>{children}</>;
}
