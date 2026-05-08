import { requireAdminPermission } from "@/lib/admin-access";

export default async function ProjectsLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPermission("canEditProjects");
  return <>{children}</>;
}
