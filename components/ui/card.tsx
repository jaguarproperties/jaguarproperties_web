import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-black/10 bg-black/[0.03] shadow-[0_18px_45px_-28px_rgba(0,0,0,0.28)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5",
        className
      )}
      {...props}
    />
  );
}
