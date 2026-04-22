import { requireAdminPermission } from "@/lib/admin-access";

export default async function PropertiesLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPermission("canEditProperties");
  return <>{children}</>;
}
