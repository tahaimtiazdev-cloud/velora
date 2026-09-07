import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";
import { getCategories } from "@/lib/queries/categories";
import { getCategoryArt } from "@/lib/category-art";

export async function FeaturedCategories() {
  const categories = await getCategories();
  const featured = categories.slice(0, 3);

  const tiles = [
    { label: "New Arrivals", href: "/shop?filter=new", art: "dress" as const },
    ...featured.map((category) => ({
      label: category.name,
      href: `/categories/${category.slug}`,
      art: getCategoryArt(category.slug),
    })),
  ];

  return (
    <Section tone="paper" className="py-14 sm:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="focus-ring group relative aspect-[3/4] overflow-hidden border border-line bg-surface"
            >
              <div className="absolute inset-0 flex items-center justify-center text-ink/70 transition-transform duration-300 group-hover:scale-105">
                <GarmentIllustration variant={tile.art} className="h-1/2 w-1/2" strokeWidth={1.4} />
              </div>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 text-sm font-medium uppercase tracking-wide text-paper">
                {tile.label}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
