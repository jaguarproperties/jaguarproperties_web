import { requireAdminPermission } from "@/lib/admin-access";

export default async function CorrectionsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdminPermission("canManageCorrections");

  return <>{children}</>;
}
