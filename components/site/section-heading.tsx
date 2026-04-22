export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[2.15rem] leading-tight text-foreground sm:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-700 dark:text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}
