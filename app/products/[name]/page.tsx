import { getProductsWithParams, getLeagues } from "@/app/actions";
import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Filters from "./filters";

export const metadata: Metadata = {
  title: "Product Details | Path of Trade",
  description: "View Path of Exile product details.",
  openGraph: {
    title: "Product Details | Path of Trade",
    description: "View Path of Exile product details.",
    type: "website",
  },
};

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: {
    league?: string;
    difficulty?: string;
  };
}) {
  try {
    // Use the name param to find the specific product
    const products = await getProductsWithParams({
      search: params.name,
      league: searchParams.league,
      difficulty: searchParams.difficulty,
    });

    // If no product is found, show an error
    if (!products || products.length === 0) {
      return (
        <div className="container mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-8 text-muted-foreground">
              The product '{params.name}' could not be found. It may have been removed or doesn't exist.
            </p>
            <Link href="/products">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    // Use the first product from the results
    const product = products[0];

    // Fetch leagues from database based on product's game version
    const leaguesData = await getLeagues(product.gameVersion);
    const leagueOptions = leaguesData.map(league => league.name);
    
    // Difficulty options
    const difficultyOptions = ["softcore", "hardcore"];

    // Current selected values
    const currentLeague = searchParams.league || product.league;
    const currentDifficulty = searchParams.difficulty || product.difficulty;

    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="p-6 flex items-center justify-center bg-black/20">
              <div className="relative w-full aspect-square max-w-md">
                <Image
                  src={product.imgUrl || "/images/placeholder.jpg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Product Info */}
            <div className="p-6 md:p-8 flex flex-col">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded text-xs font-medium">
                  {product.gameVersion === 'path-of-exile-1' ? 'POE 1' : 'POE 2'}
                </span>
              </div>

              {/* League and Difficulty Filters */}
              <Filters 
                productName={params.name}
                leagueOptions={leagueOptions}
                difficultyOptions={difficultyOptions}
                currentLeague={currentLeague}
                currentDifficulty={currentDifficulty}
              />
              
              {product.description && (
                <p className="text-muted-foreground my-4">{product.description}</p>
              )}
              
              <div className="mt-auto">
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-muted-foreground">USD</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <Link href="/products" className="w-full">
                    <Button variant="outline" className="w-full">
                      Back to Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading product: {(error as Error).message}
      </div>
    );
  }
}
