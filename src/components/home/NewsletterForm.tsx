"use client";

import { useState, type FormEvent } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-4 text-sm text-paper" role="status">
        You&apos;re on the list. Thanks for joining.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex max-w-sm overflow-hidden border border-paper/25">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="focus-ring w-full bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/40 outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="focus-ring shrink-0 bg-paper px-5 text-xs font-medium uppercase tracking-wide text-ink transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {status === "loading" ? "Joining…" : "Join"}
        </button>
      </div>
      {error ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-xs text-sale">
          {error}
        </p>
      ) : null}
    </form>
  );
}
