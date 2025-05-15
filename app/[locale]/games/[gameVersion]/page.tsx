import { LeagueSelectionPage } from "../../../../components/league-selection";



  export default async function Page({ params }: { params: { gameVersion:'path-of-exile-1' | 'path-of-exile-2' } }) {
    const { gameVersion } =  await params;
    return (
    <main className="container mx-auto  min-h-screen">
    <LeagueSelectionPage gameVersion={gameVersion} />
    </main>
    )

  }