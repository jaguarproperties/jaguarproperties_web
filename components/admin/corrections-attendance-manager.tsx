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
  employeeCode?: string | null;
};

type AttendanceRecord = {
  id: string;
  employeeId: string;
  employeeCode?: string | null;
  employeeName: string;
  employeeEmail: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workType: string | null;
  status: string;
  notes: string | null;
};

type FormState = {
  id?: string;
  employeeId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  workType: string;
  status: string;
  notes: string;
};

function toDateInput(value: string) {
  return value.slice(0, 10);
}

function toDateTimeLocalInput(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function createEmptyForm(): FormState {
  return {
    employeeId: "",
    date: "",
    checkInTime: "",
    checkOutTime: "",
    workType: "OFFICE",
    status: "PRESENT",
    notes: ""
  };
}

function createEditForm(record: AttendanceRecord): FormState {
  return {
    id: record.id,
    employeeId: record.employeeId,
    date: toDateInput(record.date),
    checkInTime: toDateTimeLocalInput(record.checkInTime),
    checkOutTime: toDateTimeLocalInput(record.checkOutTime),
    workType: record.workType ?? "OFFICE",
    status: record.status,
    notes: record.notes ?? ""
  };
}

function formatDisplayDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatDisplayDateTime(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function CorrectionsAttendanceManager({
  employees,
  records
}: {
  employees: EmployeeOption[];
  records: AttendanceRecord[];
}) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage(formState?.id ? "Replacing existing attendance data..." : "Adding attendance record...");

    const payload = Object.fromEntries(formData.entries());
    const endpoint = formState?.id ? `/api/attendance/${formState.id}` : "/api/attendance";
    const method = formState?.id ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Attendance update failed.");
      }

      setMessage(
        formState?.id
          ? "Attendance data replaced successfully."
          : "Attendance record added successfully."
      );
      setFormState(null);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Attendance update failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-300">
            Existing records can be edited directly. Only use add when there is no attendance record present yet.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => setFormState(createEmptyForm())}>
          Add Attendance
        </Button>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/10">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Check In</th>
              <th className="px-4 py-3">Check Out</th>
              <th className="px-4 py-3">Work Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr className="border-t border-white/10 text-zinc-300">
                <td colSpan={7} className="px-4 py-6 text-center text-zinc-500">
                  No attendance data found. Use Add Attendance to create the first record.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-t border-white/10 text-zinc-300">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{record.employeeName}</p>
                    <p className="mt-1 text-xs text-zinc-500">{record.employeeEmail}</p>
                    <p className="mt-1 font-mono text-[11px] text-primary">
                      {record.employeeCode ? `${record.employeeCode} · ` : ""}
                      {record.employeeId}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-zinc-200">{formatDisplayDate(record.date)}</td>
                  <td className="px-4 py-4 text-zinc-200">{formatDisplayDateTime(record.checkInTime)}</td>
                  <td className="px-4 py-4 text-zinc-200">{formatDisplayDateTime(record.checkOutTime)}</td>
                  <td className="px-4 py-4 text-zinc-200">{record.workType ?? "—"}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{record.status}</p>
                    <p className="mt-1 text-xs text-zinc-500">{record.notes ?? "No edit note"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Button type="button" variant="ghost" onClick={() => setFormState(createEditForm(record))}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formState ? (
        <form action={handleSubmit} className="space-y-4 rounded-[28px] border border-primary/20 bg-white/5 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Direct Correction</p>
              <h3 className="mt-2 font-display text-3xl text-white">
                {formState.id ? "Edit Attendance Record" : "Add Attendance Record"}
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                {formState.id
                  ? "Update only the fields you need. Saving will replace the current attendance data for this employee and date."
                  : "Fill the relevant details to create a new attendance record when no data is present."}
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={() => setFormState(null)}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Employee</label>
              <Select
                name="employeeId"
                required
                value={formState.employeeId}
                onChange={(event) => setFormState((current) => (current ? { ...current, employeeId: event.target.value } : current))}
              >
                <option value="" disabled>
                  Select employee
                </option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {(employee.name ?? employee.email)} {employee.employeeCode ? `· ${employee.employeeCode}` : ""} · {employee.id}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Date</label>
              <Input
                name="date"
                type="date"
                required
                value={formState.date}
                onChange={(event) => setFormState((current) => (current ? { ...current, date: event.target.value } : current))}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Check In</label>
              <Input
                name="checkInTime"
                type="datetime-local"
                value={formState.checkInTime}
                onChange={(event) =>
                  setFormState((current) => (current ? { ...current, checkInTime: event.target.value } : current))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Check Out</label>
              <Input
                name="checkOutTime"
                type="datetime-local"
                value={formState.checkOutTime}
                onChange={(event) =>
                  setFormState((current) => (current ? { ...current, checkOutTime: event.target.value } : current))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Work Type</label>
              <Select
                name="workType"
                value={formState.workType}
                onChange={(event) => setFormState((current) => (current ? { ...current, workType: event.target.value } : current))}
              >
                <option value="OFFICE">Office</option>
                <option value="WFH">WFH</option>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">Status</label>
              <Select
                name="status"
                value={formState.status}
                onChange={(event) => setFormState((current) => (current ? { ...current, status: event.target.value } : current))}
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LEAVE">Leave</option>
                <option value="HALF_DAY">Half Day</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">Notes</label>
            <Textarea
              name="notes"
              placeholder="Reason for correction"
              value={formState.notes}
              onChange={(event) => setFormState((current) => (current ? { ...current, notes: event.target.value } : current))}
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : formState.id ? "Save Changes" : "Add Record"}
          </Button>

          {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
