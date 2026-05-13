import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/properties", "/news", "/contact", "/careers"],
        disallow: ["/admin/", "/api/"]
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.baseUrl
  };
}
