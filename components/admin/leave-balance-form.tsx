"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeaveBalanceForm({
  employeeId,
  currentBalance
}: {
  employeeId: string;
  currentBalance: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(String(currentBalance));
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSave() {
    setPending(true);
    try {
      const response = await fetch(`/api/leaves/balance/${employeeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leaveBalance: Number(value),
          note
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Balance update failed.");
      }
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Balance update failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input type="number" min={0} step="0.5" value={value} onChange={(event) => setValue(event.target.value)} />
      <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional note" />
      <Button size="sm" variant="secondary" disabled={pending} onClick={handleSave}>
        Update Balance
      </Button>
    </div>
  );
}
