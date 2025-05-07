'use client'
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LeagueCardProps {
  imageSrc: string;
  title: string;
  league: string;
  gameVersion: 'path-of-exile-1' | 'path-of-exile-2';
}

const LeagueCard = ({ imageSrc, title, league, gameVersion }: LeagueCardProps) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLeagueSelection = (difficulty: 'hardcore' | 'softcore') => {
    router.push(
      `/games/${gameVersion}/leagues/${encodeURIComponent(league)}/${difficulty}`
    );
  };

  return (
    <div
      className={`
        w-[380px] 
        h-[360px]
        transition-all 
        duration-300 
        ease-in-out 
        ${isExpanded ? 'scale-105' : 'hover:scale-102'}
        ${isExpanded ? 'cursor-default' : 'cursor-pointer'}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Card className="p-0 shadow-xl rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
        <CardContent className="p-0">
          <CardHeader className="">
            <div>
              <h2 className="text-center font-roboto font-black text-primary tracki ng-wide text-3xl">
                {league}
              </h2>
            </div>
          </CardHeader>
          <div className="relative h-[300px] w-full">
            <Image
              src={imageSrc}
              alt={title}
              width={200}
              height={200}
              className="object-cover  w-full"
              priority
            />
          </div>
        </CardContent>

        {isExpanded && (
          <CardFooter className="flex justify-center gap-2 py-2 mb-4 bg-gradient-to-t from-card via-card/90 to-transparent">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLeagueSelection('softcore');
              }}
              className="w-32 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white/90 font-bold px-4 py-2.5 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 text-md tracking-wide shadow-sm hover:shadow-md"
            >
              Softcore
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLeagueSelection('hardcore');
              }}
              className="w-32 bg-gradient-to-b from-rose-600 to-rose-700 text-white/90 font-bold px-4 py-2.5 rounded-lg hover:from-rose-500 hover:to-rose-600 transition-all duration-200 text-md tracking-wide shadow-sm hover:shadow-md"
            >
              Hardcore
            </button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

interface LeagueSelectionProps {
  gameVersion: 'path-of-exile-1' | 'path-of-exile-2';
}

const leaguesByVersion = {
  'path-of-exile-1': [
    {
      id: 'Settlers of Kalguur',
      title: 'Settlers of Kalguur (POE 1)',
      imageSrc: '/images/poe-logo-settlers.png',
    },
    {
      id: 'Standard',
      title: 'Phrecia League (POE 1)',
      imageSrc: '/images/poe-logo.png',
    },
  ],
  'path-of-exile-2': [
    {
      id: 'Standard',
      title: 'Standard League (POE 2)',
      imageSrc: '/images/poe2-standard-logo.png',
    },
    {
      id: 'Settlers of Kalguur',
      title: 'Dawn of The Hunt (POE 2)',
      imageSrc: '/images/poe2-standard-logo.png',
    }
  ]
} satisfies Record<string, Array<{ id: string; title: string; imageSrc: string }>>;

export function LeagueSelectionPage({ gameVersion }: LeagueSelectionProps) {
  const leagues = leaguesByVersion[gameVersion];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background pt-12 px-4">
      <div className="max-w-7xl w-full flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl text-center font-black font-source-sans bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent tracking-wider">
          SELECT YOUR LEAGUE
        </h1>
        <p className="text-sm text-center text-muted-foreground/80 mb-12 max-w-2xl tracking-wide">
          Select your Path of Exile league below to view available currency prices and offers.
        </p>
        <div className="flex flex-wrap justify-center gap-10">
          {leagues.map((league) => (
            <LeagueCard
              key={league.id}
              imageSrc={league.imageSrc}
              title={league.title}
              league={league.id}
              gameVersion={gameVersion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}