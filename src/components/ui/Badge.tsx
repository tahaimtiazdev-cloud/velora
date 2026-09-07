import type { ReactNode } from "react";

type Tone = "neutral" | "sale" | "warning" | "error" | "success";

const tones: Record<Tone, string> = {
  neutral: "bg-surface text-ink border-line",
  sale: "bg-sale-soft text-sale border-sale/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  error: "bg-error-soft text-error border-error/20",
  success: "bg-success-soft text-accent-dark border-accent/20",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
