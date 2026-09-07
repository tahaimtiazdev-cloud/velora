import { Button } from "@/components/ui/Button";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this right now. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center border border-line bg-surface px-6 py-16 text-center">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {onRetry ? (
        <Button type="button" variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
