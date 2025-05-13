import { getProductsWithParams } from "@/app/actions";
import ProductsClient from "@/components/products-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Path of Trade",
  description: "Browse all Path of Exile products, currency, items and services. Filter by game version, league, and more.",
  openGraph: {
    title: "Path of Trade Products",
    description: "Browse all Path of Exile products, currency, items and services. Filter by game version, league, and more.",
    type: "website",
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    gameVersion?: string;
    league?: string;
    difficulty?: string;
    category?: string;
    search?: string;
  };
}) {
  try {
    const products = await getProductsWithParams(searchParams);
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Products</h1>
        <ProductsClient products={products} />
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading products: {(error as Error).message}
      </div>
    );
  }
} 