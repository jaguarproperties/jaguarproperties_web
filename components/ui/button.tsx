import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary px-6 py-3 text-primary-foreground hover:opacity-90",
        secondary:
          "border-black/10 bg-black/[0.04] px-6 py-3 text-foreground hover:border-primary hover:bg-primary/10 dark:border-white/20 dark:bg-white/5 dark:text-white",
        destructive:
          "border-rose-500/30 bg-rose-500/10 px-6 py-3 text-rose-200 hover:border-rose-400/40 hover:bg-rose-500/20",
        ghost:
          "border-transparent bg-transparent px-3 py-2 text-foreground hover:bg-black/[0.04] dark:text-zinc-200 dark:hover:bg-white/5"
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-xs",
        lg: "px-7 py-3.5 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
