"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type AttendanceRecord = {
  checkInTime?: string | Date | null;
  checkOutTime?: string | Date | null;
  workType?: "OFFICE" | "WFH" | null;
  location?: any;
};

async function getLocationSnapshot() {
  if (!("geolocation" in navigator)) {
    return {};
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000
    });
  });

  const latitude = Number(position.coords.latitude.toFixed(6));
  const longitude = Number(position.coords.longitude.toFixed(6));

  let address = "";
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );
    if (response.ok) {
      const payload = await response.json();
      address = payload.display_name ?? "";
    }
  } catch {
    address = "";
  }

  return { latitude, longitude, address };
}

function getTodayLocationLabel(todayRecord: AttendanceRecord | null) {
  const latestAddress = todayRecord?.location?.checkOut?.address ?? todayRecord?.location?.checkIn?.address;

  if (latestAddress === "WFH" || todayRecord?.workType === "WFH") {
    return "WFH";
  }

  return latestAddress ?? "Location will be captured when you mark attendance.";
}

export function AttendanceMarker({ todayRecord }: { todayRecord: AttendanceRecord | null }) {
  const router = useRouter();
  const [workType, setWorkType] = useState<"OFFICE" | "WFH">(todayRecord?.workType ?? "OFFICE");
  const [message, setMessage] = useState<string>("");
  const [pendingAction, setPendingAction] = useState<"check-in" | "check-out" | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const canCheckIn = useMemo(() => !todayRecord?.checkInTime, [todayRecord?.checkInTime]);
  const canCheckOut = useMemo(
    () => Boolean(todayRecord?.checkInTime) && !todayRecord?.checkOutTime,
    [todayRecord?.checkInTime, todayRecord?.checkOutTime]
  );

  async function handleAttendance(action: "check-in" | "check-out") {
    setPendingAction(action);
    setMessage(
      workType === "WFH"
        ? action === "check-in"
          ? "Recording your WFH check-in..."
          : "Recording your WFH check-out..."
        : action === "check-in"
          ? "Capturing your location and check-in..."
          : "Capturing your location and check-out..."
    );

    try {
      const location = workType === "WFH" ? { address: "WFH" } : await getLocationSnapshot();
      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          workType,
          ...location
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Attendance update failed.");
      }

      setMessage(action === "check-in" ? "Check-in recorded successfully." : "Check-out recorded successfully.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Attendance update failed.");
    } finally {
      setPendingAction(null);
    }
  }

  function formatAttendanceTime(value?: string | Date | null) {
    if (!value) return "Not marked";
    if (!isMounted) return "Loading...";
    return new Date(value).toLocaleString();
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Today&apos;s Attendance</p>
          <h3 className="mt-3 font-display text-3xl text-white">Check in fast, even on phone</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Use the buttons below to mark your working day quickly. Office attendance captures location automatically,
            while WFH records the location as WFH.
          </p>
        </div>
        <div className="w-full sm:max-w-[220px]">
          <label className="mb-2 block text-sm font-medium text-zinc-200">Work Type</label>
          <Select value={workType} onChange={(event) => setWorkType(event.target.value as "OFFICE" | "WFH")}>
            <option value="OFFICE">Office</option>
            <option value="WFH">WFH</option>
          </Select>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Check In</p>
            <p className="mt-2 text-sm text-white">{formatAttendanceTime(todayRecord?.checkInTime)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Check Out</p>
            <p className="mt-2 text-sm text-white">{formatAttendanceTime(todayRecord?.checkOutTime)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Last Location</p>
            <p className="mt-2 text-sm text-white">
              {getTodayLocationLabel(todayRecord)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          size="lg"
          className="w-full min-h-[56px]"
          disabled={!canCheckIn || pendingAction !== null}
          onClick={() => handleAttendance("check-in")}
        >
          {pendingAction === "check-in" ? "Checking In..." : "Mark Check-In"}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full min-h-[56px]"
          disabled={!canCheckOut || pendingAction !== null}
          onClick={() => handleAttendance("check-out")}
        >
          {pendingAction === "check-out" ? "Checking Out..." : "Mark Check-Out"}
        </Button>
      </div>

      {message ? <p className="mt-4 text-sm text-zinc-400">{message}</p> : null}
    </div>
  );
}
