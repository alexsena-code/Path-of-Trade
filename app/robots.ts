import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/", "/checkout/"],
    },
    sitemap: "https://path-of-trade.vercel.app/sitemap.xml",
  };
} 