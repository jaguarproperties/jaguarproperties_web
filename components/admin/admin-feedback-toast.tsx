"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/components/ui/sonner";

function getToastConfig(params: URLSearchParams) {
  if (params.get("saved")) {
    return { type: "success" as const, message: "Saved successfully." };
  }

  if (params.get("created")) {
    return { type: "success" as const, message: "Created successfully." };
  }

  if (params.get("updated")) {
    return { type: "success" as const, message: "Updated successfully." };
  }

  if (params.get("deleted")) {
    return { type: "success" as const, message: "Deleted successfully." };
  }

  if (params.get("holidayUploaded")) {
    return { type: "success" as const, message: "Holiday calendar uploaded successfully." };
  }

  if (params.get("error")) {
    return { type: "error" as const, message: "Please review the form and try again." };
  }

  if (params.get("holidayError")) {
    return { type: "error" as const, message: "Holiday upload could not be completed." };
  }

  return null;
}

export function AdminFeedbackToast() {
  const params = useSearchParams();
  const lastToastKey = useRef<string | null>(null);
  const key = params.toString();

  useEffect(() => {
    if (!key || lastToastKey.current === key) return;

    const config = getToastConfig(params);
    if (!config) return;

    lastToastKey.current = key;

    if (config.type === "success") {
      toast.success(config.message);
      return;
    }

    toast.error(config.message);
  }, [key, params]);

  return null;
}
