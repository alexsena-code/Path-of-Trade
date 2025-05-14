import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/", "/checkout/", "/sign-in", "/sign-up"],
    },
    sitemap: "https://www.pathoftrade.net/sitemap.xml",
  };
} 