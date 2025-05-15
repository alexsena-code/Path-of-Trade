import { getProductsWithParams } from "@/app/actions";
import ProductsClient from "@/components/products-client";
import { Metadata } from "next";

type SearchParams = {
  gameVersion?: string;
  league?: string;
  difficulty?: string;
  category?: string;
  search?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const league = searchParams.league || "All Leagues";
  const category = searchParams.category || "All Items";
  const gameVersion = searchParams.gameVersion || "Current";
  
  return {
    title: `Buy ${category} PoE ${league} | Fast & Safe Currency | PathofTrade.net`,
    description: `Buy cheap ${category} for Path of Exile ${league} (PoE ${gameVersion}). Get your PoE currency from PathofTrade.net. Best prices ${league} orbs.`,
    openGraph: {
      title: `Best Price: ${category} - PoE ${league} Currency | PathofTrade.net`,
      description: `Find the best deals on Path of Exile ${category} for ${league} at PathofTrade.net. We offer cheap PoE currency, instant delivery, and 100% secure transactions for your ${gameVersion} gameplay.`,
      type: "website",
    },
  };
}

export default async function ProductsPage(
  props: {
    searchParams: Promise<SearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  try {
    const products = await getProductsWithParams(searchParams);
    const league = searchParams.league || "All Leagues";
    const difficulty = searchParams.difficulty || "All Difficulties";
    const category = searchParams.category || "All Items";
    
    return (
      <div className="container mx-auto py-8">
        <div className="bg-indigo-700 inline-block min-w-[320px] md:min-w-[380px] rounded-tl-md rounded-tr-sm py-2 shadow-lg">
          <h2 className="text-lg md:text-3xl text-center text-white font-bold antialiased capitalize tracking-wider">
            {league} - {difficulty}
          </h2>
        </div>
      
        <ProductsClient products={products} />
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
        <h3 className="font-bold mb-2">Error Loading Products</h3>
        <p>{(error as Error).message}</p>
        <p className="mt-4 text-sm">Please try refreshing the page or adjusting your search parameters.</p>
      </div>
    );
  }
}
