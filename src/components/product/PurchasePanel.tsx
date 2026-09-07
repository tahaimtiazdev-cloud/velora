"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VariantSelector } from "@/components/product/VariantSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { formatPrice } from "@/lib/format";
import { addCartItem } from "@/lib/actions/cart";
import { notifyCartUpdated } from "@/lib/cart/events";
import type { ClientProduct } from "@/lib/serialize";

export function PurchasePanel({ product }: { product: ClientProduct }) {
  const router = useRouter();
  const hasVariants = product.variants.length > 0;

  const variantGroups = useMemo(() => {
    const groups = new Map<string, typeof product.variants>();
    for (const variant of product.variants) {
      const list = groups.get(variant.type) ?? [];
      list.push(variant);
      groups.set(variant.type, list);
    }
    return [...groups.entries()];
  }, [product]);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const allTypesSelected = variantGroups.every(([type]) => selections[type]);
  // Each variant row is an independently-stocked, single-axis option (see
  // schema comment on ProductVariant) — every seeded product has exactly
  // one variant type, so at most one selection is ever active at a time.
  const selectedVariantId = allTypesSelected ? Object.values(selections)[0] : undefined;
  const selectedVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId) ?? null
    : null;

  const stock = hasVariants ? selectedVariant?.stock ?? 0 : product.stock;
  const canSelect = hasVariants ? Boolean(selectedVariant) : true;
  const inStock = canSelect && stock > 0;
  const disabled = !inStock || (hasVariants && !allTypesSelected) || isPending;

  const unitPrice = Number(product.price) + Number(selectedVariant?.priceModifier ?? 0);

  function handleSelect(type: string, id: string) {
    setSelections((prev) => ({ ...prev, [type]: id }));
    setQuantity(1);
    setNotice(null);
  }

  function handleAction(action: "cart" | "buy") {
    if (disabled) return;
    setNotice(null);

    startTransition(async () => {
      const result = await addCartItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      });

      if (!result.success) {
        setNotice({ type: "error", text: result.error ?? "Something went wrong." });
        return;
      }

      notifyCartUpdated();

      if (action === "buy") {
        router.push("/cart");
        return;
      }

      setNotice({ type: "success", text: result.message ?? "Added to cart." });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl text-ink">{formatPrice(unitPrice)}</span>
          {product.compareAtPrice != null &&
          Number(product.compareAtPrice) > Number(product.price) ? (
            <span className="text-base text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>

      {variantGroups.map(([type, options]) => (
        <VariantSelector
          key={type}
          type={type}
          options={options.map((o) => ({ id: o.id, value: o.value, stock: o.stock }))}
          selectedId={selections[type] ?? null}
          onSelect={(id) => handleSelect(type, id)}
        />
      ))}

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink">Quantity</p>
        <div className="mt-2.5 flex items-center gap-4">
          <QuantitySelector
            quantity={quantity}
            max={Math.max(1, stock)}
            onChange={setQuantity}
            disabled={!inStock || isPending}
          />
          <StockLabel hasVariants={hasVariants} canSelect={canSelect} stock={stock} />
        </div>
      </div>

      <div className="space-y-2.5">
        <Button
          type="button"
          size="lg"
          disabled={disabled}
          onClick={() => handleAction("cart")}
          className="w-full"
        >
          {isPending
            ? "Adding…"
            : hasVariants && !allTypesSelected
              ? "Select Options"
              : inStock
                ? "Add to Cart"
                : "Out of Stock"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={disabled}
          onClick={() => handleAction("buy")}
          className="w-full"
        >
          Buy Now
        </Button>
        {notice ? (
          <p
            role="status"
            className={`pt-1 text-xs ${notice.type === "error" ? "text-sale" : "text-muted"}`}
          >
            {notice.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StockLabel({
  hasVariants,
  canSelect,
  stock,
}: {
  hasVariants: boolean;
  canSelect: boolean;
  stock: number;
}) {
  if (hasVariants && !canSelect) {
    return <span className="text-sm text-muted">Select an option to see availability</span>;
  }
  if (stock <= 0) {
    return <Badge tone="error">Out of stock</Badge>;
  }
  if (stock <= 5) {
    return <Badge tone="warning">Only {stock} left</Badge>;
  }
  return <Badge tone="success">In stock</Badge>;
}
