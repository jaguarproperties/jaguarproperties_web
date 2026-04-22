import Link from "next/link";

import { createUserAccount } from "@/app/actions";
import { UserForm } from "@/components/admin/user-form";
import { auth } from "@/lib/auth";
import { getManagerOptions } from "@/lib/data";

export default async function CreateUserPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const [managers, session] = await Promise.all([getManagerOptions(), auth()]);
  const allowSuperAdminRole = session?.user?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/users" className="text-sm text-primary hover:underline">
          ← Back to Users
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-primary">New Employee</p>
        <h1 className="mt-3 break-words font-display text-4xl text-white sm:text-5xl">Create Employee Account</h1>
        <p className="mt-4 text-sm text-zinc-400">
          Administration and Super Admin accounts can create employee profiles and assign the access each role should receive.
        </p>
      </div>

      {searchParams?.error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {searchParams.error === "duplicate-user"
            ? "A user with that username or email already exists."
            : "Please review the new employee details and try again."}
        </div>
      ) : null}

      <div className="scrollbar-thin max-h-[75vh] max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-8">
        <UserForm onSubmit={createUserAccount} managers={managers} allowSuperAdminRole={allowSuperAdminRole} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-white/5 p-4">
          <h3 className="font-semibold text-white">Super Admin</h3>
          <p className="mt-2 text-xs text-zinc-400">
            Full access to all modules, including attendance edits, leave changes, role permissions, and protected accounts
          </p>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <h3 className="font-semibold text-white">Administration</h3>
          <p className="mt-2 text-xs text-zinc-400">
            Can change attendance sheet details, manage leave workflows, and maintain employee access
          </p>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <h3 className="font-semibold text-white">Developer</h3>
          <p className="mt-2 text-xs text-zinc-400">Website changes, theme, content, projects</p>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <h3 className="font-semibold text-white">Digital</h3>
          <p className="mt-2 text-xs text-zinc-400">Images, blog posts, and news management</p>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <h3 className="font-semibold text-white">Manager</h3>
          <p className="mt-2 text-xs text-zinc-400">Team attendance, leave approvals, and employee reporting</p>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <h3 className="font-semibold text-white">Employee</h3>
          <p className="mt-2 text-xs text-zinc-400">Self-service attendance, leave requests, and personal history</p>
        </div>
        <div className="rounded-lg bg-white/5 p-4">
          <h3 className="font-semibold text-white">HR</h3>
          <p className="mt-2 text-xs text-zinc-400">Attendance oversight, leave balances, and workforce operations</p>
        </div>
      </div>
    </div>
  );
}
