import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductBySlug } from "@/lib/queries/products";
import { siteConfig } from "@/lib/site-config";
import { toClientProduct } from "@/lib/serialize";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description = product.description.slice(0, 155);
  const image = product.images[0]?.url;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/products/${product.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images.map((i) => i.url),
    category: product.category.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: Number(product.price).toFixed(2),
      availability:
        product.variants.length > 0
          ? product.variants.some((v) => v.stock > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock"
          : product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  };

  return (
    <div className="bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container className="py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/shop" className="focus-ring hover:text-ink">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/categories/${product.category.slug}`} className="focus-ring hover:text-ink">
                {product.category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.images.map((i) => ({ url: i.url, alt: i.alt }))}
            categorySlug={product.category.slug}
            productName={product.name}
          />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {product.category.name}
            </p>
            <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{product.name}</h1>

            <div className="mt-6">
              <PurchasePanel product={toClientProduct(product)} />
            </div>

            <div className="mt-8">
              <Accordion
                defaultOpenIndex={0}
                items={[
                  { title: "Description", content: <p>{product.description}</p> },
                  {
                    title: "Shipping",
                    content: (
                      <p>
                        Free standard shipping (5–7 business days) on all US orders. Express
                        shipping available at checkout. International rates calculated at
                        checkout.
                      </p>
                    ),
                  },
                  {
                    title: "Returns",
                    content: (
                      <p>
                        Unworn items in original condition can be returned within 30 days of
                        delivery for a full refund. Return shipping is free for US orders.
                      </p>
                    ),
                  },
                  {
                    title: "Details",
                    content: (
                      <ul className="space-y-1">
                        <li>SKU: {product.sku}</li>
                        <li>Category: {product.category.name}</li>
                      </ul>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <RelatedProducts categoryId={product.categoryId} excludeProductId={product.id} />
      </Container>
    </div>
  );
}
