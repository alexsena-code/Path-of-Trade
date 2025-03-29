import {LeagueSelectionPage} from "@/components/league-selection";


export default function Page({params,}: {params: {gameVersion: "path-of-exile-1" | "path-of-exile-2" }}) {
    const { gameVersion } = params
    return (
        <LeagueSelectionPage gameVersion={gameVersion} />
    )
}