import { createRoleProfile, updateRolePermissions } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { TableCard } from "@/components/admin/table-card";
import {
  ensureSystemRoles,
  getManageableRoles,
  permissionDetails,
  permissionList,
  systemRoleDetails
} from "@/lib/permissions";

export default async function RolesPage({
  searchParams
}: {
  searchParams?: { updated?: string; created?: string; error?: string };
}) {
  await ensureSystemRoles();
  const roles = await getManageableRoles();

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Management</p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">Roles & Permissions</h1>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">
          Admins can now decide exactly which rights each built-in role receives. Every checkbox below is enforced by
          the real admin routes, server actions, exports, uploads, and HR workflows.
        </p>
        <p className="max-w-3xl text-sm leading-7 text-zinc-500">
          You can also create custom role profiles here. User assignment still uses the built-in system roles below
          until the employee role model is extended.
        </p>
      </div>

      <TableCard
        title="Create Role"
        description="Create a custom role profile and choose which permissions it should allow."
      >
        <form action={createRoleProfile} className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="space-y-5">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-primary">Role Details</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Keep the role name short and the description clear so the access setup stays easy to understand.
                </p>
              </div>

              <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Role Name</label>
              <input
                name="roleName"
                placeholder="Sales Coordinator"
                className="flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              </div>

              <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Display Label</label>
              <input
                name="label"
                placeholder="Sales Coordinator"
                className="flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-200">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Handles lead follow-up and selected admin workflows."
                  className="flex w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-primary">Permission Access</p>
                  <p className="mt-1 text-sm text-zinc-400">Choose only the actions this role profile should allow.</p>
                </div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{permissionList.length} permissions</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {permissionList.map((permission) => (
                  <label
                    key={permission}
                    className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200"
                  >
                    <input
                      type="checkbox"
                      name={permission}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-primary"
                    />
                    <span>
                      <span className="block font-medium text-white">{permissionDetails[permission].label}</span>
                      <span className="mt-1 block text-xs leading-6 text-zinc-400">
                        {permissionDetails[permission].description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Create Role Profile
          </button>
        </form>
      </TableCard>

      {searchParams?.updated ? (
        <Card className="border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Role permissions were updated successfully.
        </Card>
      ) : null}

      {searchParams?.created ? (
        <Card className="border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {searchParams.created} role profile created successfully.
        </Card>
      ) : null}

      {searchParams?.error ? (
        <Card className="border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100">
          {searchParams.error === "protected-role"
            ? "Only a Super Admin can change the Super Admin role."
            : searchParams.error === "duplicate-role"
              ? "That role already exists. Choose a different role name."
            : "The selected role could not be updated."}
        </Card>
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Available Roles</p>
            <h2 className="font-display text-3xl text-white">Permission Setup</h2>
          </div>
          <p className="text-sm text-zinc-500">{roles.length} role cards</p>
        </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {roles.map((role) => {
          const assignedPermissions = new Set(role.permissions);
          const isSystemRole = role.name in systemRoleDetails;

          return (
            <TableCard
              key={role.name}
              title={role.label}
              description={isSystemRole ? "System role" : "Custom role profile"}
            >
              <form action={updateRolePermissions} className="space-y-6">
                <input type="hidden" name="role" value={role.name} />
                <input type="hidden" name="description" value={role.description} />

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm leading-7 text-zinc-400">{role.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">{role.name}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {permissionList.map((permission) => (
                    <label
                      key={permission}
                      className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200"
                    >
                      <input
                        type="checkbox"
                        name={permission}
                        defaultChecked={assignedPermissions.has(permission)}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-primary"
                      />
                      <span>
                        <span className="block font-medium text-white">{permissionDetails[permission].label}</span>
                        <span className="mt-1 block text-xs leading-6 text-zinc-400">
                          {permissionDetails[permission].description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Save {role.label}
                </button>
              </form>
            </TableCard>
          );
        })}
      </div>
      </div>
    </div>
  );
}
