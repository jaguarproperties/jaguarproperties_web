import { requireAdminPermission } from "@/lib/admin-access";

export default async function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPermission("canEditContent");
  return <>{children}</>;
}
