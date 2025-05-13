import { getProducts, getLeagues } from "./actions";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URLs
  const baseUrl = "https://www.pathoftrade.net";
  const baseRoutes = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },
    { url: `${baseUrl}/games/path-of-exile-1/leagues`, lastModified: new Date() },
    { url: `${baseUrl}/games/path-of-exile-2/`, lastModified: new Date() },
    { url: `${baseUrl}/cart`, lastModified: new Date() },
  ];

  // Get all products to include in sitemap
  const products = await getProducts();
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products?search=${encodeURIComponent(product.name)}`,
    lastModified: new Date(),
  }));

  // Get all leagues to include in sitemap
  const poe1Leagues = await getLeagues("path-of-exile-1");
  const poe2Leagues = await getLeagues("path-of-exile-2");
  
  const leagueUrls = [
    ...poe1Leagues.flatMap((league) => [
      {
        url: `${baseUrl}/games/path-of-exile-1/leagues/${encodeURIComponent(league.name)}/softcore`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/games/path-of-exile-1/leagues/${encodeURIComponent(league.name)}/hardcore`,
        lastModified: new Date(),
      },
    ]),
    ...poe2Leagues.flatMap((league) => [
      {
        url: `${baseUrl}/games/path-of-exile-2/leagues/${encodeURIComponent(league.name)}/softcore`,
        lastModified: new Date(),
      },
      {
        url: `${baseUrl}/games/path-of-exile-2/leagues/${encodeURIComponent(league.name)}/hardcore`,
        lastModified: new Date(),
      },
    ]),
  ];

  // Category pages
  const categories = ["Currency", "Services", "Items"];
  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
  }));

  return [...baseRoutes, ...productUrls, ...leagueUrls, ...categoryUrls];
} 