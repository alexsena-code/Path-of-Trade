import * as React from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {Star} from "lucide-react";


export function CarouselSpacing() {
    const carouselItems = [
        {
            name: "BunnyGirlSenpai",
            title: "Explore",
            description: "My power leveler was amazing, regardless of the server being in a different timezone, they still got me to 40 in a good time! Super happy with the result!",
            color: "bg-(--background)",
        },
        {
            name: "ZeroTwo",
            title: "Innovate",
            description: "totally awesome ! i loved the gameplay and the skills i've learned, Best players that can carry you even if you play like a sheep! Totally recommend this website and the players that are here!No stress , QUICK , big Damage",
            color: "bg-(--background)",
        },
        {
            name: "ZeroTwoo",
            title: "Create",
            description: "A little bumpy start but not OG's fault really, their support team were amazing and sorted everything straight away! Thanks for the great care and attention you guys give and support offered...you can trust them and my team were amazing! Thx folks!",
            color: "bg-(--background)",
        },
        {
            name: "ZeroOne",
            title: "Accelerate",
            description: "totally awesome ! i loved the gameplay and the skills i've learned, Best players that can carry you even if you play like a sheep! Totally recommend this website and the players that are here!No stress , QUICK , big Damage.",
            color: "bg-(--background)",
        },
        {
            name: "BunnyGirl",
            title: "Grow",
            description: "Nurture potential and embrace continuous learning.",
            color: "bg-(--background)",
        }
    ];

    return (
        <section className="w-full py-16 bg-background mb-16">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-source font-black text-left mb-8 text-white">
                    What Our Clients Say
                </h2>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {carouselItems.map((item, index) => (
                            <CarouselItem
                                key={index}
                                className="pl-4 md:basis-1/2 lg:basis-1/4"
                            >
                                <div className="p-1">
                                    <Card
                                        className={` min-h-92 max-h-120 ${item.color} hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2`}>
                                        <CardContent
                                            className="flex flex-col  place-content-start h-full text-start  space-y-2">

                                            <h2 className="font-source text-2xl font-bold ">{item.name}</h2>

                                            <div className="flex flex-row">
                                                <Star fill="white" strokeWidth={1} color="black" size={30}/>
                                                <Star fill="white" strokeWidth={1} color="black" size={30}/>
                                                <Star fill="white" strokeWidth={1} color="black" size={30}/>
                                                <Star fill="white" strokeWidth={1} color="black" size={30}/>
                                                <Star fill="white" strokeWidth={1} color="black" size={30}/>
                                            </div>
                                            <CardTitle className="text-2xl font-bold text-primary-font mb-2 text-start">
                                                {item.title}
                                            </CardTitle>
                                            <p className="text-primary font-normal  text-base">
                                                {item.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
                        <CarouselPrevious className="bg-gray-200 hover:bg-gray-300"/>
                        <CarouselNext className="bg-gray-200 hover:bg-gray-300"/>
                    </div>
                </Carousel>
            </div>
        </section>
    )
}

export default CarouselSpacing;