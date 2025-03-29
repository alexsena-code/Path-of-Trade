import {Features} from "@/components/features";
import {CarouselSpacing} from "@/components/testemonials-section";
import {FaqSection} from "@/components/faq-section";
import {GameSelection} from "@/components/game-selection";




export default function Home() {
    return (
        <main className="container mx-auto px-4 py-4">
                <GameSelection/>
            <h2 className="text-[3rem] text-center tracking-wider font-bold  font-source text-(--primary-font)">WHY PATH OF TRADE? </h2>
                <Features/>

            <CarouselSpacing/>
            <FaqSection/>




        </main>


)
}