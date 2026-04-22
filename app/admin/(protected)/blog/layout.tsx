import { requireAdminSession } from "@/lib/admin-access";
import { canManageNews } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!(await canManageNews(session.user.role))) {
    redirect("/admin");
  }

  return <>{children}</>;
}
