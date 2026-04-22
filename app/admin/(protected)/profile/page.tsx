import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Account</p>
        <h1 className="mt-3 font-display text-5xl text-white">Profile</h1>
        <p className="mt-4 text-sm text-zinc-400">Your logged-in dashboard identity and employee details.</p>
      </div>

      <Card className="max-w-3xl p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Employee Name</p>
            <p className="mt-2 text-lg text-white">{session.user.name ?? "No name added"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Employee ID</p>
            <p className="mt-2 font-mono text-lg uppercase tracking-[0.18em] text-primary">{session.user.employeeCode}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Role</p>
            <p className="mt-2 text-lg text-white">{session.user.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Email</p>
            <p className="mt-2 text-lg text-white">{session.user.email ?? "No email available"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
