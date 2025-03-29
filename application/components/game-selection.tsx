import {GameCard} from "@/components/game-card";


export function GameSelection () {


    return (
        <section className="text-center   place-items-center">

            <h1 className="text-[3rem]  tracking-wider font-bold font-source bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent">CHOOSE
                YOUR GAME</h1>
            <div className="grid md:grid-cols-2 place-items-center gap-20">
                <GameCard
                    imageSrc="/images/path-of-exile-card.png"
                    title="Path of Exile 1"
                    gameVersion="path-of-exile-1"
                />
                <GameCard
                    imageSrc="/images/path-of-exile2-card.png"
                    title="Path of Exile 2"
                    gameVersion="path-of-exile-2"
                />
            </div>
        </section>
    )
}