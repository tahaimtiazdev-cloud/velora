"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown by the root layout itself (font loading, etc.) —
 * a case app/error.tsx can't handle since it renders inside that layout.
 * Must render its own <html>/<body>; kept dependency-free on purpose.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled root error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f7f5f2",
          color: "#1a1815",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
        <p style={{ color: "#6b6459", marginBottom: "1.5rem", maxWidth: 420 }}>
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            border: "1px solid #1a1815",
            background: "transparent",
            padding: "0.6rem 1.5rem",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
