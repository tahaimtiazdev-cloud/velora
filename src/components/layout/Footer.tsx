import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav, siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink text-paper">
      <Container className="py-14 sm:py-16">
        <div className="pb-12">
          <p className="font-serif text-2xl">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
            {siteConfig.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-paper/10 pt-12 sm:grid-cols-3">
          <FooterColumn title="Shop" items={footerNav.shop} />
          <FooterColumn title="Help" items={footerNav.help} />
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-paper/50">
              Follow
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring text-sm text-paper/70 hover:text-paper"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.pinterest}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring text-sm text-paper/70 hover:text-paper"
                >
                  Pinterest
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.tiktok}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="focus-ring text-sm text-paper/70 hover:text-paper"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper/10 pt-8 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
          <p>A portfolio demonstration store. All products are seed/demo data.</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-paper/50">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              prefetch={false}
              className="focus-ring text-sm text-paper/70 hover:text-paper"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
