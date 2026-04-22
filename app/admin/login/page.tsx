import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { auth } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main className="dark flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(184,144,74,0.22),transparent_26%),linear-gradient(180deg,#070b11,#090909)] p-6">
      <LoginForm />
    </main>
  );
}
