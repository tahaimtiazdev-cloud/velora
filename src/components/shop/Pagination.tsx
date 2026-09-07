import Link from "next/link";
import type { ReactNode } from "react";
import { shopParamsToSearchString, type ShopParams } from "@/lib/shop-params";

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({
  basePath,
  params,
  totalPages,
}: {
  basePath: string;
  params: ShopParams;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(params.page, totalPages);

  function hrefForPage(page: number) {
    return `${basePath}${shopParamsToSearchString(params, { page: page > 1 ? page : undefined })}`;
  }

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      <PageLink
        href={hrefForPage(params.page - 1)}
        disabled={params.page <= 1}
        label="Previous page"
      >
        Prev
      </PageLink>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted" aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <Link
            key={p}
            href={hrefForPage(p)}
            aria-current={p === params.page ? "page" : undefined}
            className={`focus-ring flex h-9 min-w-9 items-center justify-center px-2 text-sm ${
              p === params.page
                ? "bg-ink text-paper"
                : "text-ink hover:bg-surface"
            }`}
          >
            {p}
          </Link>
        )
      )}

      <PageLink
        href={hrefForPage(params.page + 1)}
        disabled={params.page >= totalPages}
        label="Next page"
      >
        Next
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className="flex h-9 items-center justify-center px-3 text-sm text-muted"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="focus-ring flex h-9 items-center justify-center px-3 text-sm text-ink hover:bg-surface"
    >
      {children}
    </Link>
  );
}
