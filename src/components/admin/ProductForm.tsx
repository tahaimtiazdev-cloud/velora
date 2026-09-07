"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createProductAction, updateProductAction } from "@/lib/actions/admin/products";
import type { ProductInput } from "@/lib/validations/admin/product";

interface CategoryOption {
  id: string;
  name: string;
}

interface ImageRow {
  url: string;
  alt: string;
}

interface VariantRow {
  id?: string;
  type: string;
  value: string;
  priceModifier: string;
  stock: string;
  sku: string;
}

interface InitialProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  categoryId: string;
  featured: boolean;
  isNewArrival: boolean;
  status: "ACTIVE" | "ARCHIVED";
  images: ImageRow[];
  variants: { id: string; type: string; value: string; priceModifier: number; stock: number; sku: string | null }[];
}

export function ProductForm({
  categories,
  initialProduct,
}: {
  categories: CategoryOption[];
  initialProduct?: InitialProduct;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [values, setValues] = useState({
    name: initialProduct?.name ?? "",
    slug: initialProduct?.slug ?? "",
    description: initialProduct?.description ?? "",
    price: initialProduct?.price?.toString() ?? "",
    compareAtPrice: initialProduct?.compareAtPrice?.toString() ?? "",
    sku: initialProduct?.sku ?? "",
    stock: initialProduct?.stock?.toString() ?? "0",
    categoryId: initialProduct?.categoryId ?? categories[0]?.id ?? "",
    featured: initialProduct?.featured ?? false,
    isNewArrival: initialProduct?.isNewArrival ?? false,
    status: initialProduct?.status ?? ("ACTIVE" as "ACTIVE" | "ARCHIVED"),
  });

  const [images, setImages] = useState<ImageRow[]>(
    initialProduct?.images.length ? initialProduct.images : [{ url: "", alt: "" }]
  );
  const [variants, setVariants] = useState<VariantRow[]>(
    (initialProduct?.variants ?? []).map((v) => ({
      id: v.id,
      type: v.type,
      value: v.value,
      priceModifier: v.priceModifier.toString(),
      stock: v.stock.toString(),
      sku: v.sku ?? "",
    }))
  );

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateImage(index: number, field: keyof ImageRow, value: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)));
  }

  function updateVariant(index: number, field: keyof VariantRow, value: string) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const input: ProductInput = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      price: Number(values.price),
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
      sku: values.sku,
      stock: Number(values.stock),
      categoryId: values.categoryId,
      featured: values.featured,
      isNewArrival: values.isNewArrival,
      status: values.status,
      images: images.filter((img) => img.url.trim() && img.alt.trim()),
      variants: variants
        .filter((v) => v.type.trim() && v.value.trim())
        .map((v) => ({
          id: v.id,
          type: v.type,
          value: v.value,
          priceModifier: Number(v.priceModifier || 0),
          stock: Number(v.stock || 0),
          sku: v.sku || undefined,
        })),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateProductAction(initialProduct!.id, input)
        : await createProductAction(input);
      if (result && !result.success) {
        setError(result.error ?? null);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      if (isEdit) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {error ? (
        <div role="alert" className="border border-sale/30 bg-sale-soft px-4 py-3 text-sm text-sale">
          {error}
        </div>
      ) : null}

      <section className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Basics</h2>

        <Field label="Name" htmlFor="name" error={fieldErrors.name}>
          <input
            id="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClasses(Boolean(fieldErrors.name))}
          />
        </Field>

        <Field label="Slug" htmlFor="slug" error={fieldErrors.slug} hint="Lowercase letters, numbers, hyphens only.">
          <input
            id="slug"
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            className={inputClasses(Boolean(fieldErrors.slug))}
          />
        </Field>

        <Field label="Description" htmlFor="description" error={fieldErrors.description}>
          <textarea
            id="description"
            rows={4}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className={inputClasses(Boolean(fieldErrors.description))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (USD)" htmlFor="price" error={fieldErrors.price}>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={values.price}
              onChange={(e) => update("price", e.target.value)}
              className={inputClasses(Boolean(fieldErrors.price))}
            />
          </Field>
          <Field label="Compare-at Price (optional)" htmlFor="compareAtPrice" error={fieldErrors.compareAtPrice}>
            <input
              id="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              value={values.compareAtPrice}
              onChange={(e) => update("compareAtPrice", e.target.value)}
              className={inputClasses(Boolean(fieldErrors.compareAtPrice))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="SKU" htmlFor="sku" error={fieldErrors.sku}>
            <input
              id="sku"
              value={values.sku}
              onChange={(e) => update("sku", e.target.value)}
              className={inputClasses(Boolean(fieldErrors.sku))}
            />
          </Field>
          <Field
            label="Base Stock"
            htmlFor="stock"
            error={fieldErrors.stock}
            hint="Only used if this product has no variants below."
          >
            <input
              id="stock"
              type="number"
              min="0"
              value={values.stock}
              onChange={(e) => update("stock", e.target.value)}
              className={inputClasses(Boolean(fieldErrors.stock))}
            />
          </Field>
        </div>

        <Field label="Category" htmlFor="categoryId" error={fieldErrors.categoryId}>
          <select
            id="categoryId"
            value={values.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className={inputClasses(Boolean(fieldErrors.categoryId))}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => update("featured", e.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={values.isNewArrival}
              onChange={(e) => update("isNewArrival", e.target.checked)}
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <span>Status</span>
            <select
              value={values.status}
              onChange={(e) => update("status", e.target.value as "ACTIVE" | "ARCHIVED")}
              className="focus-ring border border-line bg-paper px-2 py-1 text-sm text-ink"
            >
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Images</h2>
          <button
            type="button"
            onClick={() => setImages((prev) => [...prev, { url: "", alt: "" }])}
            className="focus-ring text-xs font-medium uppercase tracking-wide text-ink underline"
          >
            Add Image
          </button>
        </div>
        {fieldErrors.images ? <p className="text-xs text-sale">{fieldErrors.images}</p> : null}
        {images.map((img, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border border-line p-4 sm:grid-cols-[1fr_1fr_auto]">
            <div>
              <label className="block text-xs text-muted">Image URL</label>
              <input
                value={img.url}
                onChange={(e) => updateImage(i, "url", e.target.value)}
                className={inputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Alt Text</label>
              <input
                value={img.alt}
                onChange={(e) => updateImage(i, "alt", e.target.value)}
                className={inputClasses(false)}
              />
            </div>
            <button
              type="button"
              onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
              className="focus-ring self-end justify-self-end px-2 py-2 text-xs uppercase tracking-wide text-sale"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Variants</h2>
          <button
            type="button"
            onClick={() =>
              setVariants((prev) => [...prev, { type: "", value: "", priceModifier: "0", stock: "0", sku: "" }])
            }
            className="focus-ring text-xs font-medium uppercase tracking-wide text-ink underline"
          >
            Add Variant
          </button>
        </div>
        <p className="text-xs text-muted">
          If a product has variants (e.g. sizes), stock is tracked per variant and the base stock above is
          ignored.
        </p>
        {variants.map((variant, i) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-3 border border-line p-4 sm:grid-cols-5"
          >
            <div>
              <label className="block text-xs text-muted">Type</label>
              <input
                value={variant.type}
                onChange={(e) => updateVariant(i, "type", e.target.value)}
                placeholder="Size"
                className={inputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Value</label>
              <input
                value={variant.value}
                onChange={(e) => updateVariant(i, "value", e.target.value)}
                placeholder="M"
                className={inputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Price +/-</label>
              <input
                type="number"
                step="0.01"
                value={variant.priceModifier}
                onChange={(e) => updateVariant(i, "priceModifier", e.target.value)}
                className={inputClasses(false)}
              />
            </div>
            <div>
              <label className="block text-xs text-muted">Stock</label>
              <input
                type="number"
                min="0"
                value={variant.stock}
                onChange={(e) => updateVariant(i, "stock", e.target.value)}
                className={inputClasses(false)}
              />
            </div>
            <div className="flex items-end justify-between gap-2">
              <div className="flex-1">
                <label className="block text-xs text-muted">SKU</label>
                <input
                  value={variant.sku}
                  onChange={(e) => updateVariant(i, "sku", e.target.value)}
                  className={inputClasses(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                className="focus-ring px-2 py-2 text-xs uppercase tracking-wide text-sale"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </section>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}

function inputClasses(hasError: boolean) {
  return `focus-ring mt-1.5 w-full border bg-paper px-3.5 py-2.5 text-sm text-ink ${
    hasError ? "border-sale" : "border-line"
  }`;
}

function Field({
  label,
  htmlFor,
  children,
  error,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-sale">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
