import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/checkout", "/api", "/cart"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
