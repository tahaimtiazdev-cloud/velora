"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MobileFilterDrawer({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring flex items-center gap-2 border border-line px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-ink lg:hidden"
        aria-haspopup="dialog"
      >
        <FilterIcon />
        Filters
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="focus-ring flex h-9 w-9 items-center justify-center text-ink"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring w-full bg-ink py-3 text-xs font-medium uppercase tracking-wide text-paper"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
