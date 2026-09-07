"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminSearchInput({
  basePath,
  initialQuery,
  placeholder = "Search…",
}: {
  basePath: string;
  initialQuery: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateUrl(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim()) params.set("q", next.trim());
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  }

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateUrl(next), 400);
  }

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="focus-ring w-full max-w-sm border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted"
    />
  );
}
