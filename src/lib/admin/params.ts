export const ADMIN_PAGE_SIZE = 20;

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export interface AdminListParams {
  q?: string;
  page: number;
}

/** Parses page/search params for an admin list, never throwing on bad input. */
export function parseAdminListParams(searchParams: RawSearchParams): AdminListParams {
  const q = first(searchParams.q)?.trim().slice(0, 100) || undefined;
  const pageRaw = Number(first(searchParams.page));
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  return { q, page };
}

export function adminListSearchString(
  params: Record<string, string | number | undefined>,
  overrides: Record<string, string | number | undefined> = {}
): string {
  const usp = new URLSearchParams();
  const merged = { ...params, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    if (value == null || value === "") continue;
    if (key === "page" && Number(value) <= 1) continue;
    usp.set(key, String(value));
  }

  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}
