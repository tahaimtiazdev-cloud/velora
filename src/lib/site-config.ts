export const siteConfig = {
  name: "VELORA",
  tagline: "Designed for the way you live.",
  description:
    "VELORA is a modern fashion and lifestyle store — considered pieces, honest pricing, and an easy shopping experience from browse to checkout.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "support@velora.example",
  social: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    tiktok: "https://tiktok.com",
  },
};

export const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "About", href: "/about" },
];

export const footerNav = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Categories", href: "/categories" },
  ],
  help: [
    { label: "Contact", href: "/about#contact" },
    { label: "Shipping & Returns", href: "/about#shipping" },
    { label: "Account", href: "/account" },
    { label: "Order History", href: "/account/orders" },
  ],
  company: [
    { label: "About VELORA", href: "/about" },
  ],
};
