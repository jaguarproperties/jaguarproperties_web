"use client";

import { useState, useTransition } from "react";
import { UserRole } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ManagerOption = {
  id: string;
  name: string | null;
  email: string;
};

export function AnnouncementForm({
  departments,
  users
}: {
  departments: string[];
  users: ManagerOption[];
}) {
  const [sendToAll, setSendToAll] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string>("");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
          setResult("");

          const response = await fetch("/api/notifications/broadcast", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: formData.get("title"),
              message: formData.get("message"),
              redirectUrl: formData.get("redirectUrl"),
              sendToAll: formData.get("sendToAll") === "on",
              departments: formData.getAll("departments"),
              roles: formData.getAll("roles"),
              userIds: formData.getAll("userIds")
            })
          });

          const payload = await response.json();

          if (!response.ok) {
            setResult(payload.error || "Announcement could not be sent.");
            return;
          }

          form.reset();
          setSendToAll(true);
          setMessage("");
          setResult("Announcement sent successfully.");
        });
      }}
    >
      <div>
        <label className="block text-sm font-medium text-zinc-200">Title</label>
        <Input name="title" type="text" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200">Message</label>
        <Textarea
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-1 min-h-[140px] bg-white/5"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-200">Audience Mode</label>
          <label className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
            <Checkbox
              name="sendToAll"
              checked={sendToAll}
              onChange={(event) => setSendToAll(event.target.checked)}
            />
            Send to all employees
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-200">Redirect URL</label>
          <Input name="redirectUrl" type="text" placeholder="/admin" defaultValue="/admin" />
        </div>
      </div>

      {!sendToAll ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <label className="block text-sm font-medium text-zinc-200">Departments</label>
            <div className="mt-3 max-h-56 space-y-3 overflow-y-auto pr-2">
              {departments.map((department) => (
                <label key={department} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Checkbox name="departments" value={department} />
                  <span>{department}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <label className="block text-sm font-medium text-zinc-200">Roles</label>
            <div className="mt-3 max-h-56 space-y-3 overflow-y-auto pr-2">
              {(Object.values(UserRole) as UserRole[]).map((role) => (
                <label key={role} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Checkbox name="roles" value={role} />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <label className="block text-sm font-medium text-zinc-200">Users</label>
            <div className="mt-3 max-h-56 space-y-3 overflow-y-auto pr-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Checkbox name="userIds" value={user.id} />
                  <span>{user.name ?? user.email}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-zinc-400">
        Send to one person, many selected users, multiple departments, multiple roles, or everybody at once. Repeated
        recipients are automatically de-duplicated.
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Send Announcement"}
      </Button>

      {result ? <p className="text-sm text-zinc-400">{result}</p> : null}
    </form>
  );
}
