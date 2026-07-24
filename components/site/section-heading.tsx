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
      <p className="text-xs uppercase tracking-[0.22em] text-primary sm:tracking-[0.35em]">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-700 dark:text-zinc-400 sm:text-base sm:leading-8">{description}</p>
      ) : null}
    </div>
  );
}
