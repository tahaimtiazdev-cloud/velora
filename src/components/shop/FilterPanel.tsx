"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shopParamsToSearchString, type Availability, type ShopParams } from "@/lib/shop-params";

interface CategoryOption {
  name: string;
  slug: string;
  count: number;
}

const AVAILABILITY_LABELS: Record<Availability, string> = {
  all: "All",
  "in-stock": "In Stock",
  "out-of-stock": "Out of Stock",
};

export function FilterPanel({
  basePath,
  params,
  categories,
  hideCategoryFilter = false,
}: {
  basePath: string;
  params: ShopParams;
  categories: CategoryOption[];
  hideCategoryFilter?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(params.minPrice != null ? String(params.minPrice) : "");
  const [maxPrice, setMaxPrice] = useState(params.maxPrice != null ? String(params.maxPrice) : "");

  function hrefFor(overrides: Record<string, string | number | undefined>) {
    return `${basePath}${shopParamsToSearchString(params, overrides)}`;
  }

  function handlePriceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params2 = new URLSearchParams(searchParams.toString());
    if (minPrice.trim()) params2.set("minPrice", minPrice.trim());
    else params2.delete("minPrice");
    if (maxPrice.trim()) params2.set("maxPrice", maxPrice.trim());
    else params2.delete("maxPrice");
    params2.delete("page");
    const qs = params2.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  }

  const hasActiveFilters =
    Boolean(params.category && !hideCategoryFilter) ||
    params.minPrice != null ||
    params.maxPrice != null ||
    params.availability !== "all" ||
    Boolean(params.q) ||
    Boolean(params.isNewArrival);

  return (
    <div className="space-y-8">
      {hasActiveFilters ? (
        <Link
          href={basePath}
          className="focus-ring inline-block text-xs font-medium uppercase tracking-wide text-muted underline hover:text-ink"
        >
          Clear all filters
        </Link>
      ) : null}

      {!hideCategoryFilter ? (
        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-wide text-ink">Category</legend>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href={hrefFor({ category: undefined })}
                aria-current={!params.category ? "true" : undefined}
                className={`focus-ring text-sm ${
                  !params.category ? "font-medium text-ink" : "text-muted hover:text-ink"
                }`}
              >
                All Categories
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={hrefFor({ category: category.slug })}
                  aria-current={params.category === category.slug ? "true" : undefined}
                  className={`focus-ring flex items-center justify-between text-sm ${
                    params.category === category.slug
                      ? "font-medium text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-muted">{category.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-wide text-ink">Price</legend>
        <form onSubmit={handlePriceSubmit} className="mt-3 flex items-center gap-2">
          <label htmlFor="minPrice" className="sr-only">
            Minimum price
          </label>
          <input
            id="minPrice"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="focus-ring w-full border border-line bg-paper px-2.5 py-2 text-sm text-ink"
          />
          <span className="text-muted" aria-hidden="true">
            &ndash;
          </span>
          <label htmlFor="maxPrice" className="sr-only">
            Maximum price
          </label>
          <input
            id="maxPrice"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="focus-ring w-full border border-line bg-paper px-2.5 py-2 text-sm text-ink"
          />
          <button
            type="submit"
            className="focus-ring shrink-0 border border-ink px-3 py-2 text-xs font-medium uppercase tracking-wide text-ink hover:bg-ink hover:text-paper"
          >
            Go
          </button>
        </form>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-wide text-ink">Availability</legend>
        <ul className="mt-3 space-y-2">
          {(Object.keys(AVAILABILITY_LABELS) as Availability[]).map((option) => (
            <li key={option}>
              <Link
                href={hrefFor({ availability: option === "all" ? undefined : option })}
                aria-current={params.availability === option ? "true" : undefined}
                className={`focus-ring text-sm ${
                  params.availability === option ? "font-medium text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {AVAILABILITY_LABELS[option]}
              </Link>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
