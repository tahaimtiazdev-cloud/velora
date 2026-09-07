"use client";

import Image from "next/image";
import { useState } from "react";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";
import { getCategoryArt } from "@/lib/category-art";

interface GalleryImage {
  url: string;
  alt: string;
}

export function ProductGallery({
  images,
  categorySlug,
  productName,
}: {
  images: GalleryImage[];
  categorySlug: string;
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center border border-line bg-surface">
        <GarmentIllustration
          variant={getCategoryArt(categorySlug)}
          className="h-1/2 w-1/2 text-ink/60"
        />
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden border border-line bg-surface">
        <Image
          src={active.url}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2.5" role="tablist" aria-label={`${productName} images`}>
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View image ${index + 1} of ${images.length}`}
              onClick={() => setActiveIndex(index)}
              className={`focus-ring relative h-16 w-16 shrink-0 overflow-hidden border transition-colors ${
                index === activeIndex ? "border-ink" : "border-line hover:border-ink/40"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
