import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card className="p-6 md:p-7">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">{label}</p>
      <p className="mt-4 font-display text-4xl leading-none text-white md:text-5xl">{value}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{detail}</p>
    </Card>
  );
}
