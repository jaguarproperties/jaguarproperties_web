import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-white/5 dark:text-white",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
