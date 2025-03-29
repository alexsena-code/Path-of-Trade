'use client'
import Image from "next/image";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {useState} from "react";

interface LeagueCardProps {
    imageSrc: string;
    title: string;
    leagueName: string;
    gameVersion: 'path-of-exile-1' | 'path-of-exile-2'
}

function LeagueCard({imageSrc, title, leagueName, gameVersion}: LeagueCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleLeagueSelection = (difficulty: 'hardcore' | 'softcore') => {
        router.push(`/games/${gameVersion}/leagues/${leagueName.toLowerCase()}/${difficulty}`)


    }

    return (
        <div
            className={`
        w-[360px] 
        transition-all 
        duration-300 
        ease-in-out 
        ${isExpanded ? 'scale-110' : 'hover:scale-105'}
        ${isExpanded ? 'cursor-default' : 'cursor-pointer'}
    `}
            onClick={() => setIsExpanded(!isExpanded)}
        >


            <Card className={` p-0 shadow-lg rounded-lg overflow-hidden `}>

                <CardContent className="p-0">
                    <CardHeader>
                        <div>
                            <h2 className="text-center font-roboto font-black text-primary tracking-wide text-3xl pt-4"> {leagueName}
                            </h2>
                        </div>
                    </CardHeader>
                    <Image
                        src={imageSrc}
                        alt={title}
                        width={400}
                        height={400}
                        className="w-full h-auto object-cover"
                    />
                </CardContent>

                {isExpanded && (
                    <CardFooter className=" flex justify-center gap-4 pb-8">
                        <button
                            onClick={() => handleLeagueSelection('softcore')}
                            className="w-30 bg-(--color-green-700) text-white  font-bold px-6 py-2 rounded-lg hover:bg-(--color-green-500)"
                        >
                            Softcore
                        </button>

                        <button
                            onClick={() => handleLeagueSelection('hardcore')}
                            className="w-30 bg-(--color-red-700) text-white  font-bold px-6 py-2 rounded-lg hover:bg-(--color-red-500)"
                        >
                            HardCore
                        </button>


                    </CardFooter>
                )}
            </Card>

        </div>
    )

}

interface LeagueSelectionProps {
    gameVersion: 'path-of-exile-1' | 'path-of-exile-2';

}

export function LeagueSelectionPage({
                                        gameVersion
                                    }: LeagueSelectionProps) {
    const leaguesByVersion = {
        'path-of-exile-1': [
            {
                id: 'Settlers League',
                title: 'Standard League (POE 1)',
                imageSrc: '/images/poe-logo-settlers.png',
            },
            {
                id: 'Standard League',
                title: 'Phrecia League (POE 1)',
                imageSrc: '/images/poe-logo.png',
            },

        ],
        'path-of-exile-2': [
            {
                id: 'standard-poe2',
                title: 'Standard League (POE 2)',
                imageSrc: '/images/poe2-standard-league.jpg',
            },
            {
                id: 'hardcore-poe2',
                title: 'Hardcore League (POE 2)',
                imageSrc: '/images/poe2-hardcore-league.jpg',
            },
            {
                id: 'challenge-poe2',
                title: 'Challenge League (POE 2)',
                imageSrc: '/images/poe2-challenge-league.jpg',
            },
            {
                id: 'solo-self-found-poe2',
                title: 'Solo Self-Found (POE 2)',
                imageSrc: '/images/poe2-solo-self-found-league.jpg',
            }
        ]
    };

    const leagues = leaguesByVersion[gameVersion];

    return (
        <div className="flex flex-col place-items-center min-h-screen bg-(--background) ">
            <h1 className="text-5xl font-black font-inter bg-gradient-to-r from-[#DEDCFF] to-[#6f58ff] bg-clip-text text-transparent tracking-widest mt-10">
                SELECT YOUR LEAGUE
            </h1>
            <span className="text-xs mb-24 tracking-widest font-inter text-primary-font/70 ">Select your Path of Exile league below to view available currency prices and offers.</span>
            <div className="flex flex-wrap justify-center gap-10  ">
                {leagues.map((league) => (
                    <LeagueCard
                        key={league.id}
                        imageSrc={league.imageSrc}
                        title={league.title}
                        leagueName={league.id}
                        gameVersion={gameVersion}
                    ></LeagueCard>

                ))}
            </div>

        </div>
    );
}