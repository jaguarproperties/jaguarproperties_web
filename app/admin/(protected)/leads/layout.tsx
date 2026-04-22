import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin-access";
import { canAccessLeads } from "@/lib/permissions";

export default async function LeadsLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!(await canAccessLeads(session.user.role))) {
    redirect("/admin");
  }

  return <>{children}</>;
}
