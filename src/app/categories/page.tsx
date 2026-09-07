import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";
import { getCategoriesWithCounts } from "@/lib/queries/categories";
import { getCategoryArt } from "@/lib/category-art";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse the VELORA collection by category — outerwear, knitwear, tops, bottoms, and accessories.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <Section tone="paper" className="py-10 sm:py-14">
      <Container>
        <SectionHeading eyebrow="Browse" title="Categories" />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="focus-ring group flex flex-col overflow-hidden border border-line"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-surface text-ink/70 transition-transform duration-300 group-hover:scale-[1.02]">
                <GarmentIllustration
                  variant={getCategoryArt(category.slug)}
                  className="h-1/2 w-1/2"
                  strokeWidth={1.4}
                />
              </div>
              <div className="p-5">
                <h2 className="font-serif text-xl text-ink">{category.name}</h2>
                {category.description ? (
                  <p className="mt-1.5 text-sm text-muted">{category.description}</p>
                ) : null}
                <p className="mt-3 text-xs uppercase tracking-wide text-muted">
                  {category._count.products} {category._count.products === 1 ? "piece" : "pieces"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
