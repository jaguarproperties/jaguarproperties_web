import { requireAdminPermission } from "@/lib/admin-access";

export default async function ContentLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPermission("canEditContent");
  return <>{children}</>;
}
