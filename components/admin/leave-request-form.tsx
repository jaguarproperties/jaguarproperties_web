"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const dateInputClassName =
  "[color-scheme:dark] text-white placeholder:text-zinc-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert";

export function LeaveRequestForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [leaveDuration, setLeaveDuration] = useState<"FULL_DAY" | "FIRST_HALF" | "SECOND_HALF">("FULL_DAY");
  const [selectedDate, setSelectedDate] = useState("");

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage("Submitting leave request...");

    try {
      const requestPayload = Object.fromEntries(formData.entries());

      if (leaveDuration !== "FULL_DAY") {
        requestPayload.endDate = requestPayload.startDate;
      }

      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Leave request failed.");
      }

      setMessage("Leave request submitted.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Leave request failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Apply Leave</p>
        <h3 className="mt-3 font-display text-3xl text-white">New Leave Request</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          Choose whether the request is for a full day, first half, or second half. Half-day leave can be applied only for one date.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-100">Leave Type</label>
          <Select name="leaveType" defaultValue="CASUAL">
            <option value="CASUAL">Casual</option>
            <option value="SICK">Sick</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-100">Leave Duration</label>
          <Select
            name="leaveDuration"
            value={leaveDuration}
            onChange={(event) => setLeaveDuration(event.target.value as "FULL_DAY" | "FIRST_HALF" | "SECOND_HALF")}
            className="text-white"
          >
            <option value="FULL_DAY">Full Day</option>
            <option value="FIRST_HALF">First Half</option>
            <option value="SECOND_HALF">Second Half</option>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-100">
            {leaveDuration === "FULL_DAY" ? "Start Date" : "Leave Date"}
          </label>
          <Input
            name="startDate"
            type="date"
            required
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className={dateInputClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {leaveDuration === "FULL_DAY" ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-100">End Date</label>
            <Input name="endDate" type="date" required className={dateInputClassName} />
          </div>
        ) : (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm leading-6 text-zinc-100">
            {leaveDuration === "FIRST_HALF"
              ? "First half leave uses only one date. The request will cover the first half of that day."
              : "Second half leave uses only one date. The request will cover the second half of that day."}
          </div>
        )}
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-300">
          Full day leave supports a start date and end date. First half and second half show only one date.
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-100">Reason</label>
        <Textarea name="reason" required placeholder="Share the reason for your leave request." />
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Submitting..." : "Apply Leave"}
      </Button>
      {message ? <p className="text-sm text-zinc-200">{message}</p> : null}
    </form>
  );
}
