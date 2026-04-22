import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin-access";
import { canManageUsers } from "@/lib/permissions";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!(await canManageUsers(session.user.role))) {
    redirect("/admin");
  }

  return <>{children}</>;
}
