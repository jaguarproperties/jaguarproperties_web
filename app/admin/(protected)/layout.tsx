import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-access";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
