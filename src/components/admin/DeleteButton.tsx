"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface AdminActionResult {
  success: boolean;
  error?: string;
}

export function DeleteButton({
  action,
  confirmLabel = "Delete",
  onDeleted,
}: {
  action: () => Promise<AdminActionResult>;
  confirmLabel?: string;
  onDeleted?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        setConfirming(false);
        return;
      }
      setConfirming(false);
      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
    });
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-xs text-sale">Are you sure?</span>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending}
          className="focus-ring border border-sale bg-sale-soft px-2 py-1 text-xs font-medium uppercase tracking-wide text-sale hover:bg-sale hover:text-paper"
        >
          {isPending ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="focus-ring px-2 py-1 text-xs text-muted hover:text-ink"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="focus-ring text-xs font-medium uppercase tracking-wide text-sale hover:underline"
      >
        {confirmLabel}
      </button>
      {error ? <span className="text-xs text-sale">{error}</span> : null}
    </span>
  );
}
