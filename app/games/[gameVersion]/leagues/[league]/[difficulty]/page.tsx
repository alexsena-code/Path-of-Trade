import { PageProps } from "@/lib/interface";
import Products from "@/components/products";

export default async function Page(props: {params : Promise<PageProps>}) {
  const {gameVersion, league, difficulty} = await props.params;
  const decodedLeague = decodeURIComponent(league);

  return (
    <main className="container min-h-screen mx-auto pt-10">
      <div className="bg-indigo-700 inline-block min-w-[320px] md:min-w-[320px] rounded-tl-md rounded-tr-sm px-4 py-2 shadow-lg">
        <h1 className="text-lg md:text-3xl text-center text-white font-bold antialiased capitalize tracking-wide">
          {decodedLeague} - {difficulty}
        </h1>
      </div>

      <Products params={{ gameVersion, league: decodedLeague, difficulty }} />
    </main>
  );
}
