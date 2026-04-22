import Link from "next/link";
import { format } from "date-fns";

import { deleteUserAccount } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { TableCard } from "@/components/admin/table-card";
import { auth } from "@/lib/auth";
import { getAdminUsers, getUserDepartments } from "@/lib/data";
import { systemRoleDetails } from "@/lib/permissions";

export default async function UsersPage({
  searchParams
}: {
  searchParams?: { created?: string; deleted?: string; updated?: string; error?: string; department?: string };
}) {
  const selectedDepartment = searchParams?.department?.trim() ?? "";
  const [users, session, departments] = await Promise.all([
    getAdminUsers({ department: selectedDepartment || undefined }),
    auth(),
    getUserDepartments()
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Access Control</p>
          <h1 className="mt-3 break-words font-display text-4xl text-white sm:text-5xl">User Administration</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create employee accounts, assign system roles, and manage workforce access including attendance and leave authorities.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/users/create">Create Employee Account</Link>
        </Button>
      </div>

      {searchParams?.created ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Employee account created successfully.
        </div>
      ) : null}

      {searchParams?.deleted ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Employee account removed successfully.
        </div>
      ) : null}

      {searchParams?.updated ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Employee account updated successfully.
        </div>
      ) : null}

      {searchParams?.error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {searchParams.error === "protected-user"
            ? "Only a Super Admin can remove another Super Admin."
            : searchParams.error === "invalid-delete"
              ? "You cannot remove your own active account from this screen."
              : "That user could not be removed."}
        </div>
      ) : null}

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <form className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="w-full max-w-sm">
            <label className="mb-2 block text-sm font-medium text-zinc-200">Filter By Department</label>
            <Select name="department" defaultValue={selectedDepartment}>
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </Select>
          </div>
          <button className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Apply Filter
          </button>
          {selectedDepartment ? (
            <Link
              href="/admin/users"
              className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
            >
              Clear
            </Link>
          ) : null}
        </form>
      </div>

      <TableCard
        title={selectedDepartment ? `${selectedDepartment} Workforce Records` : "All Workforce Records"}
        description="Use this section's own scrollbars to review new records while keeping every cell clear and organized."
        contentClassName="max-h-[72vh] rounded-2xl border border-white/10"
      >
        <table className="min-w-[1320px] w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[200px]" />
            <col className="w-[150px]" />
            <col className="w-[140px]" />
            <col className="w-[240px]" />
            <col className="w-[150px]" />
            <col className="w-[140px]" />
            <col className="w-[170px]" />
            <col className="w-[180px]" />
            <col className="w-[120px]" />
            <col className="w-[130px]" />
            <col className="w-[140px]" />
          </colgroup>
          <thead className="text-zinc-500">
            <tr>
              <th className="sticky left-0 top-0 z-20 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Name</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Employee ID</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">User ID</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Email</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Phone</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Role</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Department</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Manager</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Leave Balance</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Created</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="border-t border-white/10 text-zinc-300">
                <td colSpan={11} className="px-4 py-6 text-center text-zinc-500">
                  {selectedDepartment
                    ? `No employee accounts were found for the ${selectedDepartment} department.`
                    : "No employee accounts have been created yet."}
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t border-white/10 text-zinc-300 odd:bg-white/[0.02] even:bg-transparent"
                >
                  <td className="sticky left-0 z-[1] bg-[hsl(var(--card))] px-4 py-4 align-top">
                    <p className="font-medium text-white">{user.name ?? "No name added"}</p>
                    <p className="mt-1 text-xs text-zinc-500">#{index + 1} • Updated {format(user.updatedAt, "dd MMM yyyy")}</p>
                  </td>
                  <td className="px-4 py-4 align-top font-mono text-xs uppercase tracking-[0.2em] text-primary break-words">
                    {user.employeeCode}
                  </td>
                  <td className="px-4 py-4 align-top break-words text-zinc-200">{user.username}</td>
                  <td className="px-4 py-4 align-top break-words leading-6 text-zinc-200">{user.email}</td>
                  <td className="px-4 py-4 align-top break-words text-zinc-200">{user.phone ?? "—"}</td>
                  <td className="px-4 py-4 align-top break-words text-zinc-200">
                    {systemRoleDetails[user.role as keyof typeof systemRoleDetails]?.label ?? user.role}
                  </td>
                  <td className="px-4 py-4 align-top break-words text-zinc-200">{user.department ?? "—"}</td>
                  <td className="px-4 py-4 align-top break-words text-zinc-200">{user.reportingManagerName ?? "—"}</td>
                  <td className="px-4 py-4 align-top text-zinc-200">{user.leaveBalance}</td>
                  <td className="px-4 py-4 align-top text-zinc-200">{format(user.createdAt, "dd MMM yyyy")}</td>
                  <td className="px-4 py-4 align-top">
                    {user.id === session?.user?.id ? (
                      <span className="text-xs text-zinc-500">Current account</span>
                    ) : (
                      <div className="flex flex-col items-start gap-3 whitespace-nowrap sm:whitespace-normal">
                        <Link href={`/admin/users/${user.id}`} className="text-sm font-semibold text-primary hover:text-primary/80">
                          Edit
                        </Link>
                        <form action={deleteUserAccount}>
                          <input type="hidden" name="id" value={user.id} />
                          <button type="submit" className="text-sm font-semibold text-rose-400 hover:text-rose-300">
                            Remove
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold text-white">System Role Definitions</h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium text-white">Super Admin</p>
              <p className="mt-1 text-xs">Full access to every feature, including attendance changes, leave changes, and protected role management</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium text-white">Administration</p>
              <p className="mt-1 text-xs">Can edit attendance sheet details, manage leave workflows, and control employee accounts</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium text-white">Developer</p>
              <p className="mt-1 text-xs">Website theme, content, projects, and properties</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium text-white">Digital</p>
              <p className="mt-1 text-xs">Images, blog posts, and news management</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium text-white">Manager</p>
              <p className="mt-1 text-xs">Attendance oversight, leave approvals, and team-level reporting</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium text-white">Employee</p>
              <p className="mt-1 text-xs">Self-service attendance, leave requests, and personal reports</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="font-medium text-white">HR</p>
              <p className="mt-1 text-xs">Attendance corrections, leave balances, workforce reports, and hiring</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-white">Employee Account Workflow</h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <p>
              <strong>Step 1:</strong> Admin selects role for employee
            </p>
            <p>
              <strong>Step 2:</strong> Admin sets the username and initial password
            </p>
            <p>
              <strong>Step 3:</strong> Admin assigns department, reporting manager, and leave balance
            </p>
            <p>
              <strong>Step 4:</strong> Credentials shared with employee securely
            </p>
            <p>
              <strong>Step 5:</strong> Employee logs in to portal with assigned role
            </p>
            <p>
              <strong>Step 6:</strong> Access is limited automatically by role permissions
            </p>
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href="/admin/users/create">Create Employee Account</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
