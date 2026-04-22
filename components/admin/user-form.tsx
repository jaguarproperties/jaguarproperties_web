import { UserRole } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { systemRoleDetails } from "@/lib/permissions";

type UserFormProps = {
  onSubmit: (formData: FormData) => void | Promise<void>;
  managers?: Array<{ id: string; name: string | null; email: string }>;
  isLoading?: boolean;
  submitLabel?: string;
  mode?: "create" | "edit";
  allowSuperAdminRole?: boolean;
  initialValues?: {
    id?: string;
    username?: string;
    email?: string;
    phone?: string | null;
    name?: string | null;
    role?: UserRole;
    department?: string | null;
    reportingManagerId?: string | null;
    leaveBalance?: number;
  };
};

export function UserForm({
  onSubmit,
  managers = [],
  isLoading = false,
  submitLabel,
  mode = "create",
  allowSuperAdminRole = false,
  initialValues
}: UserFormProps) {
  return (
    <form action={onSubmit} className="space-y-4">
      {initialValues?.id ? <input type="hidden" name="id" value={initialValues.id} /> : null}

      <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary-foreground">
        {mode === "create"
          ? "Employee ID is generated automatically in the format `JP + Year + Alphabet + 4 digits` when the account is created."
          : "Update employee details here. Leave the password field blank if you do not want to reset it."}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Username</label>
        <Input name="username" type="text" defaultValue={initialValues?.username ?? ""} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Email</label>
        <Input name="email" type="email" defaultValue={initialValues?.email ?? ""} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Phone Number</label>
        <Input name="phone" type="tel" defaultValue={initialValues?.phone ?? ""} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Name</label>
        <Input name="name" type="text" defaultValue={initialValues?.name ?? ""} />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">
          {mode === "create" ? "Password" : "New Password"}
        </label>
        <Input name="password" type="password" minLength={8} required={mode === "create"} />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Role</label>
        <Select name="role" defaultValue={initialValues?.role ?? "EMPLOYEE"}>
          {(Object.entries(systemRoleDetails) as [UserRole, (typeof systemRoleDetails)[UserRole]][])
            .filter(([role]) => allowSuperAdminRole || role !== "SUPER_ADMIN")
            .map(([role, details]) => (
              <option key={role} value={role}>
                {details.label} - {details.description}
              </option>
            ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Department</label>
        <Input
          name="department"
          type="text"
          required
          placeholder="Human Resources"
          defaultValue={initialValues?.department ?? ""}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Reporting Manager</label>
        <Select name="reportingManagerId" defaultValue={initialValues?.reportingManagerId ?? ""}>
          <option value="">No manager assigned</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name ?? manager.email}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Leave Balance</label>
        <Input
          name="leaveBalance"
          type="number"
          min={0}
          step="0.5"
          defaultValue={initialValues?.leaveBalance ?? 12}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : submitLabel ?? (mode === "create" ? "Create User" : "Save Changes")}
      </Button>
    </form>
  );
}
