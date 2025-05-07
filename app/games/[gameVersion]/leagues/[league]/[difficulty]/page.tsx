import Products from "@/components/products";

type Props = {
  params: Promise<{
    gameVersion: string;
    league: string;
    difficulty: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const decodedLeague = decodeURIComponent(resolvedParams.league);

  return (
    <main className="container min-h-screen mx-auto pt-10">
      <div className="bg-indigo-700 inline-block min-w-[366px] md:min-w-[360px] rounded-tl-md rounded-tr-sm px-4 py-2">
        <h1 className="text-lg md:text-3xl text-white tfont-bold antialiased capitalize ">
          {decodedLeague} - {resolvedParams.difficulty}
        </h1>
      </div>

      <Products params={{ ...resolvedParams, league: decodedLeague }} />
    </main>
  );
}
