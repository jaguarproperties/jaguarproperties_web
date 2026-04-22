import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/admin-access";
import { canManageJobPostings } from "@/lib/permissions";

export default async function JobsLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!session?.user || !(await canManageJobPostings(session.user.role))) {
    redirect("/admin");
  }

  return <>{children}</>;
}
