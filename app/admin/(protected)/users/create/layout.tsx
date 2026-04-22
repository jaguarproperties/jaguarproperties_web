import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";

export default async function CreateUserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || !(await canManageUsers(session.user.role))) {
    redirect("/admin");
  }

  return <>{children}</>;
}
