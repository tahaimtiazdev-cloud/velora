import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const CATEGORIES = [
  {
    name: "Outerwear",
    slug: "outerwear",
    description: "Coats, jackets, and layers built for the elements.",
  },
  {
    name: "Knitwear",
    slug: "knitwear",
    description: "Sweaters, cardigans, and knits in natural fibers.",
  },
  {
    name: "Tops",
    slug: "tops",
    description: "Shirts, blouses, and everyday tops.",
  },
  {
    name: "Bottoms",
    slug: "bottoms",
    description: "Trousers, denim, and tailored pants.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Bags, eyewear, and finishing details.",
  },
] as const;

const SIZE_VARIANTS = ["XS", "S", "M", "L", "XL"];

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  category: (typeof CATEGORIES)[number]["slug"];
  featured?: boolean;
  isNewArrival?: boolean;
  variantType: "Size" | "Color";
  variantValues: string[];
}

const PRODUCTS: ProductSeed[] = [
  // Outerwear
  {
    name: "The Wool Overcoat",
    slug: "the-wool-overcoat",
    description:
      "A camel wool-blend overcoat cut for a clean, structured silhouette. Fully lined, with horn-style buttons and a notch lapel. Built to be the one coat you reach for all winter.",
    price: 328,
    compareAtPrice: 398,
    sku: "VLR-OUT-001",
    category: "outerwear",
    featured: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Field Jacket",
    slug: "the-field-jacket",
    description:
      "Waxed cotton field jacket with a corduroy collar and four-pocket front. Water-resistant finish, brass hardware, and a relaxed fit that layers well over knitwear.",
    price: 248,
    sku: "VLR-OUT-002",
    category: "outerwear",
    isNewArrival: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Shearling Bomber",
    slug: "the-shearling-bomber",
    description:
      "A leather bomber with genuine shearling lining and collar. Ribbed cuffs and hem, interior chest pocket. Heavy, warm, and built to last decades.",
    price: 598,
    sku: "VLR-OUT-003",
    category: "outerwear",
    featured: true,
    variantType: "Size",
    variantValues: ["S", "M", "L", "XL"],
  },
  {
    name: "The Rain Trench",
    slug: "the-rain-trench",
    description:
      "A technical trench in a matte water-repellent fabric. Storm flap, adjustable waist belt, and a fully taped seam construction for genuine wet-weather use.",
    price: 268,
    sku: "VLR-OUT-004",
    category: "outerwear",
    isNewArrival: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },

  // Knitwear
  {
    name: "The Merino Crewneck",
    slug: "the-merino-crewneck",
    description:
      "A fine-gauge merino wool sweater in a classic crewneck. Breathable, temperature-regulating, and soft enough to wear directly against skin.",
    price: 148,
    sku: "VLR-KNT-001",
    category: "knitwear",
    featured: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Cable Knit Cardigan",
    slug: "the-cable-knit-cardigan",
    description:
      "A chunky cable-knit cardigan in a wool-alpaca blend. Horn buttons, patch pockets, and a slightly oversized fit for layering.",
    price: 178,
    compareAtPrice: 218,
    sku: "VLR-KNT-002",
    category: "knitwear",
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Cashmere Blend Turtleneck",
    slug: "the-cashmere-blend-turtleneck",
    description:
      "A cashmere-cotton blend turtleneck that holds its shape wash after wash. Fine ribbing at the neck, cuffs, and hem.",
    price: 228,
    sku: "VLR-KNT-003",
    category: "knitwear",
    featured: true,
    isNewArrival: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Ribbed Vest",
    slug: "the-ribbed-vest",
    description:
      "A sleeveless ribbed knit vest, designed to layer over shirts or under jackets. V-neck front, fitted through the body.",
    price: 98,
    sku: "VLR-KNT-004",
    category: "knitwear",
    variantType: "Size",
    variantValues: ["XS", "S", "M", "L"],
  },

  // Tops
  {
    name: "The Everyday Oxford Shirt",
    slug: "the-everyday-oxford-shirt",
    description:
      "A washed cotton oxford shirt with a soft, broken-in feel from the first wear. Button-down collar, single chest pocket, relaxed tailored fit.",
    price: 98,
    sku: "VLR-TOP-001",
    category: "tops",
    featured: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Silk Blend Blouse",
    slug: "the-silk-blend-blouse",
    description:
      "A fluid silk-cotton blend blouse with a fine hand feel and subtle sheen. Mother-of-pearl buttons and a relaxed drape.",
    price: 138,
    sku: "VLR-TOP-002",
    category: "tops",
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Organic Cotton Tee",
    slug: "the-organic-cotton-tee",
    description:
      "A heavyweight organic cotton t-shirt with a boxy, structured fit. Garment-dyed for a slightly worn-in tone that won't fade evenly.",
    price: 48,
    compareAtPrice: 58,
    sku: "VLR-TOP-003",
    category: "tops",
    isNewArrival: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Linen Popover",
    slug: "the-linen-popover",
    description:
      "A European linen popover shirt with a half-button placket and camp collar. Breathable and made to soften with every wash.",
    price: 108,
    sku: "VLR-TOP-004",
    category: "tops",
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },
  {
    name: "The Relaxed Flannel",
    slug: "the-relaxed-flannel",
    description:
      "A brushed cotton flannel shirt in a muted plaid. Double-layered for warmth, with a relaxed cut that works layered or on its own.",
    price: 118,
    sku: "VLR-TOP-005",
    category: "tops",
    isNewArrival: true,
    variantType: "Size",
    variantValues: SIZE_VARIANTS,
  },

  // Bottoms
  {
    name: "The Tailored Trouser",
    slug: "the-tailored-trouser",
    description:
      "A wool-blend tailored trouser with a clean taper and mid-rise fit. Works equally well with a blazer or a knit.",
    price: 168,
    sku: "VLR-BTM-001",
    category: "bottoms",
    featured: true,
    variantType: "Size",
    variantValues: ["28", "30", "32", "34", "36"],
  },
  {
    name: "The Straight-Leg Denim",
    slug: "the-straight-leg-denim",
    description:
      "Rigid selvedge denim in a straight-leg cut that will mold to you over time. Mid-rise, minimal branding, built to be lived in.",
    price: 128,
    compareAtPrice: 148,
    sku: "VLR-BTM-002",
    category: "bottoms",
    variantType: "Size",
    variantValues: ["28", "30", "32", "34", "36"],
  },
  {
    name: "The Wide-Leg Wool Pant",
    slug: "the-wide-leg-wool-pant",
    description:
      "A wide-leg trouser in a soft wool blend with a fluid drape. High-rise with a pressed center crease for a polished line.",
    price: 188,
    sku: "VLR-BTM-003",
    category: "bottoms",
    isNewArrival: true,
    variantType: "Size",
    variantValues: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "The Utility Chino",
    slug: "the-utility-chino",
    description:
      "A cotton twill chino with reinforced knees and a cargo pocket. Tapered leg, garment-washed for a lived-in softness.",
    price: 118,
    sku: "VLR-BTM-004",
    category: "bottoms",
    variantType: "Size",
    variantValues: ["28", "30", "32", "34", "36"],
  },

  // Accessories
  {
    name: "The Leather Tote",
    slug: "the-leather-tote",
    description:
      "A structured full-grain leather tote with an interior laptop sleeve and zip pocket. Develops a natural patina with use.",
    price: 248,
    sku: "VLR-ACC-001",
    category: "accessories",
    featured: true,
    variantType: "Color",
    variantValues: ["Black", "Cognac", "Sand"],
  },
  {
    name: "The Acetate Sunglasses",
    slug: "the-acetate-sunglasses",
    description:
      "Italian acetate sunglasses with polarized lenses and a classic silhouette that suits most face shapes.",
    price: 168,
    sku: "VLR-ACC-002",
    category: "accessories",
    isNewArrival: true,
    variantType: "Color",
    variantValues: ["Black", "Tortoise", "Olive"],
  },
  {
    name: "The Leather Belt",
    slug: "the-leather-belt",
    description:
      "A full-grain leather belt with a solid brass buckle. Cut slightly long so it can be trimmed to size.",
    price: 78,
    sku: "VLR-ACC-003",
    category: "accessories",
    variantType: "Color",
    variantValues: ["Black", "Cognac"],
  },
];

// Deterministic-but-varied stock levels so the catalog shows a realistic
// mix of well-stocked, low-stock, and out-of-stock variants.
function stockForIndex(i: number): number {
  const pattern = [24, 0, 3, 40, 12, 2, 0, 18, 8, 30];
  return pattern[i % pattern.length];
}

async function main() {
  console.log("Seeding VELORA...");

  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.cart.deleteMany();
  await db.productVariant.deleteMany();
  await db.productImage.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.newsletterSubscriber.deleteMany();
  await db.user.deleteMany();

  const categoryBySlug = new Map<string, string>();
  for (const category of CATEGORIES) {
    const created = await db.category.create({ data: category });
    categoryBySlug.set(category.slug, created.id);
  }

  let variantIndex = 0;

  for (const product of PRODUCTS) {
    const categoryId = categoryBySlug.get(product.category);
    if (!categoryId) throw new Error(`Unknown category: ${product.category}`);

    const created = await db.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        sku: product.sku,
        categoryId,
        stock: 0, // authoritative stock lives on variants for every seeded product
        featured: product.featured ?? false,
        isNewArrival: product.isNewArrival ?? false,
        images: {
          create: [
            {
              url: `/products/${product.category}-1.svg`,
              alt: `${product.name} — full view`,
              sortOrder: 0,
            },
            {
              url: `/products/${product.category}-2.svg`,
              alt: `${product.name} — detail view`,
              sortOrder: 1,
            },
          ],
        },
        variants: {
          create: product.variantValues.map((value) => {
            const stock = stockForIndex(variantIndex++);
            return {
              type: product.variantType,
              value,
              stock,
              sku: `${product.sku}-${value.toUpperCase()}`,
            };
          }),
        },
      },
    });

    console.log(`  created ${created.name}`);
  }

  const adminPasswordHash = await bcrypt.hash("VeloraAdmin123!", 10);
  const customerPasswordHash = await bcrypt.hash("VeloraCustomer123!", 10);

  await db.user.create({
    data: {
      name: "VELORA Admin",
      email: "admin@velora.example",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await db.user.create({
    data: {
      name: "Demo Customer",
      email: "customer@velora.example",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
  });

  console.log("Seed complete.");
  console.log("");
  console.log("Demo accounts (seed data only — not real credentials):");
  console.log("  Admin:    admin@velora.example / VeloraAdmin123!");
  console.log("  Customer: customer@velora.example / VeloraCustomer123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
