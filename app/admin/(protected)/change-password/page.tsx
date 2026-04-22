import { changeCurrentUserPassword } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ChangePasswordPage({
  searchParams
}: {
  searchParams?: { success?: string; error?: string };
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Account</p>
        <h1 className="mt-3 font-display text-5xl text-white">Change Password</h1>
        <p className="mt-4 text-sm text-zinc-400">Update your admin password securely from the dashboard.</p>
      </div>

      {searchParams?.success ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          Password changed successfully.
        </div>
      ) : null}

      {searchParams?.error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {searchParams.error === "invalid-current-password"
            ? "Your current password did not match."
            : "Please review the password details and try again."}
        </div>
      ) : null}

      <Card className="max-w-2xl p-8">
        <form action={changeCurrentUserPassword} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">Current Password</label>
            <Input name="currentPassword" type="password" required minLength={8} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">New Password</label>
            <Input name="newPassword" type="password" required minLength={8} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">Confirm New Password</label>
            <Input name="confirmPassword" type="password" required minLength={8} />
          </div>
          <Button type="submit">Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
