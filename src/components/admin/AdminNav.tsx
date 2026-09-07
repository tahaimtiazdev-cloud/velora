"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`focus-ring px-3 py-2 text-sm font-medium ${
              isActive ? "bg-ink text-paper" : "text-ink hover:bg-surface"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link href="/" className="focus-ring mt-4 px-3 py-2 text-xs uppercase tracking-wide text-muted hover:text-ink">
        ← Back to Store
      </Link>
    </nav>
  );
}
