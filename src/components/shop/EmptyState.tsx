import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center border border-line bg-surface px-6 py-16 text-center">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {actionLabel && actionHref ? (
        <Button href={actionHref} variant="secondary" size="sm" className="mt-6">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
