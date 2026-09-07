export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "ink" | "paper";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const descriptionColor = tone === "paper" ? "text-paper/70" : "text-muted";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed ${descriptionColor}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
