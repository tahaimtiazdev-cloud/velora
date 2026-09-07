import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";
import { getCategoryArt } from "@/lib/category-art";
import { formatPrice } from "@/lib/format";
import { getTotalStock, isLowStock, isOutOfStock } from "@/lib/inventory";
import type { ProductCardData } from "@/types/product";

export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = isOutOfStock(product);
  const lowStock = isLowStock(product);
  const onSale =
    product.compareAtPrice != null && Number(product.compareAtPrice) > Number(product.price);
  const primaryImage = product.images[0];
  const variantCount = product.variants.length;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="focus-ring group flex flex-col"
      aria-label={`${product.name}, ${formatPrice(product.price)}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden border border-line bg-surface">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition-opacity duration-300 ${
              outOfStock ? "opacity-50" : "group-hover:opacity-90"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/60">
            <GarmentIllustration
              variant={getCategoryArt(product.category.slug)}
              className="h-1/2 w-1/2"
            />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival ? <Badge tone="neutral">New</Badge> : null}
          {onSale ? <Badge tone="sale">Sale</Badge> : null}
        </div>

        {outOfStock ? (
          <div className="absolute inset-x-0 bottom-0 bg-ink/85 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-paper">
            Out of Stock
          </div>
        ) : lowStock ? (
          <div className="absolute inset-x-0 bottom-0 bg-warning-soft py-2 text-center text-[11px] font-medium uppercase tracking-wide text-warning">
            Only {getTotalStock(product)} left
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-muted">{product.category.name}</p>
        <h3 className="mt-1 text-sm font-medium text-ink">{product.name}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm text-ink">{formatPrice(product.price)}</span>
          {onSale ? (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          ) : null}
        </div>
        {variantCount > 1 ? (
          <p className="mt-1 text-xs text-muted">{variantCount} options</p>
        ) : null}
      </div>
    </Link>
  );
}
