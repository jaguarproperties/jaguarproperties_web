import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TableCard({
  title,
  description,
  action,
  children,
  contentClassName
}: {
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <Card className="p-6 md:p-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-[2rem] leading-tight text-white">{title}</h2>
          {description ? <p className="mt-2 admin-soft-copy">{description}</p> : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary/40 hover:bg-white/10"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      <div className={cn("scrollbar-thin mt-6 overflow-auto rounded-[22px] border border-white/10 bg-black/10", contentClassName)}>
        {children}
      </div>
    </Card>
  );
}
