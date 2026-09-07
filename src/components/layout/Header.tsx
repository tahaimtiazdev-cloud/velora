"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { mainNav, siteConfig } from "@/lib/site-config";
import type { Category } from "@/generated/prisma/client";

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="focus-ring font-serif text-2xl tracking-tight text-ink"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {mainNav.map((item) => {
            const active = pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`focus-ring text-sm font-medium uppercase tracking-wide transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {categories.length > 0 ? (
            <div className="group relative">
              <button
                type="button"
                className="focus-ring flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-muted hover:text-ink"
              >
                Categories
              </button>
              <div className="invisible absolute left-0 top-full grid w-56 grid-cols-1 gap-0.5 border border-line bg-paper p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="focus-ring rounded-sm px-3 py-2 text-sm text-ink hover:bg-surface"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="focus-ring flex h-10 w-10 items-center justify-center text-ink"
          >
            <SearchIcon />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="focus-ring hidden h-10 w-10 items-center justify-center text-ink sm:flex"
          >
            <UserIcon />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="focus-ring flex h-10 w-10 items-center justify-center text-ink"
          >
            <BagIcon />
          </Link>
          <button
            type="button"
            className="focus-ring flex h-10 w-10 items-center justify-center text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      {searchOpen ? (
        <div className="border-t border-line bg-paper">
          <Container className="py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <SearchIcon />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="focus-ring w-full border-none bg-transparent text-base text-ink placeholder:text-muted outline-none"
              />
            </form>
          </Container>
        </div>
      ) : null}

      <div
        id="mobile-menu"
        className={`grid overflow-hidden border-t border-line bg-paper transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-medium uppercase tracking-wide text-muted">
              Categories
            </p>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-sm px-3 py-3 text-base text-ink hover:bg-surface"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="focus-ring mt-3 rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-surface"
            >
              Account
            </Link>
          </Container>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 8V6.5a5 5 0 0 1 10 0V8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="4" y="8" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
