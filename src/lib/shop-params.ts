export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const AVAILABILITY_OPTIONS = ["all", "in-stock", "out-of-stock"] as const;
export type Availability = (typeof AVAILABILITY_OPTIONS)[number];

export interface ShopParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  availability: Availability;
  isNewArrival?: boolean;
  sort: SortOption;
  page: number;
}

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return undefined;
  return num;
}

/**
 * Parses and clamps raw URL search params into a safe, well-typed shape.
 * Never throws — invalid/malformed input silently falls back to defaults
 * rather than crashing the page.
 */
export function parseShopParams(searchParams: RawSearchParams): ShopParams {
  const q = first(searchParams.q)?.trim().slice(0, 100) || undefined;
  const category = first(searchParams.category)?.trim().toLowerCase().slice(0, 100) || undefined;

  let minPrice = parsePrice(first(searchParams.minPrice));
  let maxPrice = parsePrice(first(searchParams.maxPrice));
  if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const availabilityRaw = first(searchParams.availability);
  const availability: Availability = (AVAILABILITY_OPTIONS as readonly string[]).includes(
    availabilityRaw ?? ""
  )
    ? (availabilityRaw as Availability)
    : "all";

  const isNewArrival = first(searchParams.filter) === "new" ? true : undefined;

  const sortRaw = first(searchParams.sort);
  const sort: SortOption = (SORT_OPTIONS as readonly string[]).includes(sortRaw ?? "")
    ? (sortRaw as SortOption)
    : "featured";

  const pageRaw = Number(first(searchParams.page));
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return { q, category, minPrice, maxPrice, availability, isNewArrival, sort, page };
}

/** Builds a query string from ShopParams, omitting default/empty values. */
export function shopParamsToSearchString(
  params: Partial<ShopParams>,
  overrides: Record<string, string | number | undefined> = {}
): string {
  const usp = new URLSearchParams();

  const merged = { ...params, ...overrides };

  if (merged.q) usp.set("q", String(merged.q));
  if (merged.category) usp.set("category", String(merged.category));
  if (merged.minPrice != null) usp.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice != null) usp.set("maxPrice", String(merged.maxPrice));
  if (merged.availability && merged.availability !== "all")
    usp.set("availability", String(merged.availability));
  if (merged.sort && merged.sort !== "featured") usp.set("sort", String(merged.sort));
  if (merged.page && Number(merged.page) > 1) usp.set("page", String(merged.page));
  if (overrides.filter) usp.set("filter", String(overrides.filter));
  else if ((params as { isNewArrival?: boolean }).isNewArrival)
    usp.set("filter", "new");

  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}
