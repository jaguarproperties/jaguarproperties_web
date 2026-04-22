import { requireAdminPermission } from "@/lib/admin-access";

export default async function ApplicationsLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPermission("canViewApplications");
  return <>{children}</>;
}
