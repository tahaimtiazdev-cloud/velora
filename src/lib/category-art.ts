import type { GarmentVariant } from "@/components/ui/GarmentIllustration";

export const categoryArt: Record<string, GarmentVariant> = {
  outerwear: "jacket",
  knitwear: "knit",
  tops: "top",
  bottoms: "trousers",
  accessories: "bag",
};

export function getCategoryArt(slug: string): GarmentVariant {
  return categoryArt[slug] ?? "top";
}
