"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type EmployeeOption = {
  id: string;
  name: string | null;
  email: string;
};

export function ManualAttendanceForm({ employees }: { employees: EmployeeOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage("Saving attendance update...");

    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Attendance update failed.");
      }

      setMessage("Attendance record saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Attendance update failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">HR Override</p>
        <h3 className="mt-3 font-display text-3xl text-white">Manual Attendance</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-200">Employee</label>
          <Select name="employeeId" required defaultValue="">
            <option value="" disabled>
              Select employee
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name ?? employee.email}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-200">Date</label>
          <Input name="date" type="date" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-200">Check In</label>
          <Input name="checkInTime" type="datetime-local" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-200">Check Out</label>
          <Input name="checkOutTime" type="datetime-local" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-200">Work Type</label>
          <Select name="workType" defaultValue="OFFICE">
            <option value="OFFICE">Office</option>
            <option value="WFH">WFH</option>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-200">Status</label>
          <Select name="status" defaultValue="PRESENT">
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">Leave</option>
            <option value="HALF_DAY">Half Day</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-200">Notes</label>
        <Textarea name="notes" placeholder="Reason for manual correction or override" />
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Attendance"}
      </Button>
      {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
    </form>
  );
}
