import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { updateUserAccount } from "@/app/actions";
import { UserForm } from "@/components/admin/user-form";
import { auth } from "@/lib/auth";
import { getAdminUserById, getManagerOptions } from "@/lib/data";

export default async function EditUserPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  const [user, managers, session] = await Promise.all([getAdminUserById(params.id), getManagerOptions(), auth()]);

  if (!user) {
    redirect("/admin/users?error=user-not-found");
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/users" className="text-sm text-primary hover:underline">
          ← Back to Users
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-primary">Employee Profile</p>
        <h1 className="mt-3 break-words font-display text-4xl text-white sm:text-5xl">Edit Employee Account</h1>
        <p className="mt-4 text-sm text-zinc-400">
          Update employee name, user ID, password, department, role, manager, leave balance, and access level from one place.
        </p>
      </div>

      {searchParams?.error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {searchParams.error === "duplicate-user"
            ? "That username or email is already used by another employee."
            : searchParams.error === "protected-user"
              ? "Only a Super Admin can edit a Super Admin account."
              : "Please review the employee details and try again."}
        </div>
      ) : null}

      <div className="scrollbar-thin max-h-[75vh] max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-8">
        <UserForm
          onSubmit={updateUserAccount}
          managers={managers.filter((manager) => manager.id !== user.id)}
          mode="edit"
          submitLabel="Save Employee Changes"
          allowSuperAdminRole={session?.user?.role === "SUPER_ADMIN"}
          initialValues={{
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            name: user.name,
            role: user.role as UserRole,
            department: user.department,
            reportingManagerId: user.reportingManagerId,
            leaveBalance: user.leaveBalance
          }}
        />
      </div>
    </div>
  );
}
