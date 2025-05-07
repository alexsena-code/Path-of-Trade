import { getProductsByVersionAndLeague } from "@/app/actions";
import ProductsClient from "./products-client";

export default async function Products({
  params,
}: {
  params: { gameVersion: string; league: string, difficulty: string };
}) {
  try {
    console.log(params.league)
    const products = await getProductsByVersionAndLeague(
      params.gameVersion,
      params.league,
      params.difficulty
    );
    return <ProductsClient products={products} />;
  } catch (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading products: {(error as Error).message}
      </div>
    );
  }
}