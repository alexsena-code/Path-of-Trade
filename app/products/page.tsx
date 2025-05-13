import { getProductsWithParams } from "@/app/actions";
import ProductsClient from "@/components/products-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Path of Trade",
  description:
    "Browse all Path of Exile products, currency, items and services. Filter by game version, league, and more.",
  openGraph: {
    title: "Path of Trade Products",
    description:
      "Browse all Path of Exile products, currency, items and services. Filter by game version, league, and more.",
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
        <div className="bg-indigo-700 inline-block min-w-[320px] md:min-w-[380px] rounded-tl-md rounded-tr-sm  py-2 shadow-lg">
          <h2 className="text-lg md:text-3xl text-center text-white font-bold antialiased capitalize tracking-wider">
            {searchParams.league} - {searchParams.difficulty}
          </h2>
        </div>
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
