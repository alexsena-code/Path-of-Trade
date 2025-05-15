import { FaqSection } from "@/components/faq-section";
import { Features } from "@/components/features";
import GameSelection from "@/components/game-selection";
import CarouselSpacing from "@/components/testemonials-section";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <main className="container mx-auto px-4 py-4 min-h-screen">
      <GameSelection />
      <h1 className="text-4xl md:text-6xl tracking-tighter font-bold font-source-sans text-white text-center tracking-wide">
        {t('why-path-of-trade')}
      </h1>
      <Features />
      
      <CarouselSpacing />
      <FaqSection />
    </main>
  );
}