import { FaqSection } from "@/components/faq-section";
import { Features } from "@/components/features";
import GameSelection from "@/components/game-selection";
import CarouselSpacing from "@/components/testemonials-section";





export default function Home() {
  return (
    <main className="container mx-auto px-4 py-4 min-h-screen">
      <GameSelection />
      <h1 className="text-4xl md:text-6xl tracking-tighter font-bold font-source-sans text-white text-center">
        WHY PATH OF TRADE
      </h1>
      <Features />
      
      <CarouselSpacing />
      <FaqSection />
    </main>
  );
}
