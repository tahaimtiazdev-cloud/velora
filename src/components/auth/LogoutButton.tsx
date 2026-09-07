"use client";

import { useTransition } from "react";
import { logoutAction } from "@/lib/actions/auth";

export function LogoutButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => logoutAction())}
      className={
        className ??
        "focus-ring text-xs font-medium uppercase tracking-wide text-muted underline hover:text-ink disabled:opacity-50"
      }
    >
      {isPending ? "Signing Out…" : "Sign Out"}
    </button>
  );
}
