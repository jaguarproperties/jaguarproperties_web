import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-foreground outline-none placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:text-white",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
