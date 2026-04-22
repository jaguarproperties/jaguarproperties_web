"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LeaveRequestActions({
  leaveId,
  mode
}: {
  leaveId: string;
  mode: "approve" | "cancel";
}) {
  const router = useRouter();
  const [remarks, setRemarks] = useState("");
  const [pending, setPending] = useState(false);

  async function handleAction(status: "APPROVED" | "REJECTED" | "cancel") {
    setPending(true);

    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(status === "cancel" ? { action: "cancel" } : { status, remarks })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Leave update failed.");
      }

      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Leave update failed.");
    } finally {
      setPending(false);
    }
  }

  if (mode === "cancel") {
    return (
      <Button variant="destructive" size="sm" disabled={pending} onClick={() => handleAction("cancel")}>
        Cancel
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Input value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Remarks" />
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={() => handleAction("APPROVED")}>
          Approve
        </Button>
        <Button variant="destructive" size="sm" disabled={pending} onClick={() => handleAction("REJECTED")}>
          Reject
        </Button>
      </div>
    </div>
  );
}
