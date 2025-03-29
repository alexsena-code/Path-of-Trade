"use client"
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {useRouter} from "next/navigation";

interface GameCardProps {
    imageSrc: string;
    title: string;
    gameVersion: 'path-of-exile-1' | 'path-of-exile-2'
}

export function GameCard({imageSrc, title, gameVersion }: GameCardProps) {
    const router = useRouter();

    const handleGameSelection = () => {
        router.push(`/games/${gameVersion}/`);
    };

    return (
        <Card className="w-[500px] h-[600px] hover:scale-105 transition duration-700 ease-in-out p-0 shadow-black-500/100 my-14 rounded-sm cursor-pointer"
        onClick={handleGameSelection}
        >
            <CardContent className="p-0 ">
                <Image
                    src={imageSrc}
                    alt={title}
                    width={500}
                    height={600}
                    className="w-full h-full object-cover"
                />
            </CardContent>
        </Card>
    )
}