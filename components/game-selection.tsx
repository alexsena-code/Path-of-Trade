// GameSelection.tsx
import { GameCard } from "@/components/game-card";

export default function GameSelection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-6xl tracking-tighter font-bold font-source-sans bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent mb-8 md:mb-12 text-center">
        CHOOSE YOUR GAME
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-5xl mx-auto">
        <GameCard
          imageSrc="/images/path-of-exile-card.png"
          title="Path of Exile"
          gameVersion="path-of-exile-1"
        />
        <GameCard
          imageSrc="/images/path-of-exile2-card.png"
          title="Path of Exile 2"
          gameVersion="path-of-exile-2"
        />
      </div>
    </section>
  );
}