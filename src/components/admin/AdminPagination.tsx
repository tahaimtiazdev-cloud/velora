import Link from "next/link";
import { adminListSearchString } from "@/lib/admin/params";

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

export function AdminPagination({
  basePath,
  currentParams,
  page,
  totalPages,
}: {
  basePath: string;
  currentParams: Record<string, string | number | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);
  const hrefForPage = (p: number) => `${basePath}${adminListSearchString(currentParams, { page: p })}`;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} className="focus-ring flex h-9 items-center px-3 text-sm text-ink hover:bg-surface">
          Prev
        </Link>
      ) : (
        <span className="flex h-9 items-center px-3 text-sm text-muted">Prev</span>
      )}

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-sm text-muted" aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <Link
            key={p}
            href={hrefForPage(p)}
            aria-current={p === page ? "page" : undefined}
            className={`focus-ring flex h-9 min-w-9 items-center justify-center px-2 text-sm ${
              p === page ? "bg-ink text-paper" : "text-ink hover:bg-surface"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} className="focus-ring flex h-9 items-center px-3 text-sm text-ink hover:bg-surface">
          Next
        </Link>
      ) : (
        <span className="flex h-9 items-center px-3 text-sm text-muted">Next</span>
      )}
    </nav>
  );
}
