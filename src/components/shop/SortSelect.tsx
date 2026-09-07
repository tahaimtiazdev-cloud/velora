"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, type SortOption } from "@/lib/shop-params";

const LABELS: Record<SortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A to Z",
};

export function SortSelect({ basePath, current }: { basePath: string; current: SortOption }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs font-medium uppercase tracking-wide text-muted">
        Sort
      </label>
      <select
        id="sort"
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="focus-ring border border-line bg-paper px-3 py-2 text-sm text-ink"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {LABELS[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
