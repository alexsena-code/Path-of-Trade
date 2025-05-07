
import Products from "@/components/products";

export default async function Page({
  params,
}: {
  params: {
    gameVersion: string;
    league: string;
    difficulty: "softcore" | "hardcore";
  };
}) {
  const decodedLeague = decodeURIComponent(params.league);

  return (
    <main className="container min-h-screen mx-auto pt-10">
      <div className="bg-indigo-700 inline-block min-w-[366px] md:min-w-[360px] rounded-tl-md rounded-tr-sm px-4 py-2">
        <h1 className="text-lg md:text-3xl text-white tfont-bold antialiased capitalize ">
          {decodedLeague} - {params.difficulty}
        </h1>
      </div>

      <Products params={{ ...params, league: decodedLeague }} />
    </main>
  );
}
