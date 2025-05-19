import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/**", "/checkout/**"],
    },
    sitemap: "https://www.pathoftrade.net/sitemap.xml",
  };
} 