import type { ReactNode } from "react";

type Tone = "paper" | "surface" | "ink";

const tones: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  surface: "bg-surface text-ink",
  ink: "bg-ink text-paper",
};

export function Section({
  children,
  className = "",
  tone = "paper",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}
