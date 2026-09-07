import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productImageSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required.").max(500),
  alt: z.string().trim().min(1, "Alt text is required.").max(200),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  type: z.string().trim().min(1, "Variant type is required.").max(50),
  value: z.string().trim().min(1, "Variant value is required.").max(50),
  priceModifier: z.number().finite(),
  stock: z.number().int().min(0, "Stock can't be negative."),
  sku: z.string().trim().max(100).optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters.")
    .max(200)
    .regex(slugPattern, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(5000),
  price: z.number().positive("Price must be greater than 0."),
  compareAtPrice: z.number().positive().optional(),
  sku: z.string().trim().min(1, "SKU is required.").max(100),
  stock: z.number().int().min(0, "Stock can't be negative."),
  categoryId: z.string().trim().min(1, "Category is required."),
  featured: z.boolean(),
  isNewArrival: z.boolean(),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
  images: z.array(productImageSchema).min(1, "At least one image is required."),
  variants: z.array(productVariantSchema),
});

export type ProductInput = z.infer<typeof productSchema>;
