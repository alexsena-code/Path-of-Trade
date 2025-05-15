import * as React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface Testimonial {
  name: string;
  title: string;
  description: string;
  rating: number;
}

export default function TestimonialCarousel() {
  const testimonials: Testimonial[] = [
    {
      name: "BunnyGirlSenpai",
      title: "Explore",
      description:
        "My power leveler was amazing, regardless of the server being in a different timezone, they still got me to 40 in a good time! Super happy with the result!",
      rating: 5,
    },
    {
      name: "BunnyGirlSenpai",
      title: "Explore",
      description:
        "My power leveler was amazing, regardless of the server being in a different timezone, they still got me to 40 in a good time! Super happy with the result!",
      rating: 5,
    },
    {
      name: "BunnyGirlSenpai",
      title: "Explore",
      description:
        "My power leveler was amazing, regardless of the server being in a different timezone, they still got me to 40 in a good time! Super happy with the result!",
      rating: 5,
    },
    {
      name: "BunnyGirlSenpai",
      title: "Explore",
      description:
        "My power leveler was amazing, regardless of the server being in a different timezone, they still got me to 40 in a good time! Super happy with the result!",
      rating: 5,
    },
    {
      name: "BunnyGirlSenpai",
      title: "Explore",
      description:
        "My power leveler was amazing, regardless of the server being in a different timezone, they still got me to 40 in a good time! Super happy with the result!",
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        fill={index < rating ? "currentColor" : "none"}
        className="w-6 h-6 text-yellow-400"
        strokeWidth={1.5}
      />
    ));
  };

  const t = useTranslations('Testemonials');
  return (
    <section className="w-full py-16 bg-background mb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-source font-black text-left mb-8 text-white">
            {t('title')}
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
              >
                <div className="p-1 h-full">
                  <Card className="h-full bg-background hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 group">
                    <CardContent className="flex flex-col items-start p-6 gap-4 h-full">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                        <div>
                          <h2 className="font-source text-xl font-bold text-white">
                            {testimonial.name}
                          </h2>
                          <div className="flex gap-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                      </div>

                      <CardTitle className="text-xl font-bold text-primary-font mb-2">
                        {testimonial.title}
                      </CardTitle>

                      <p className="text-gray-300 font-normal text-base line-clamp-5">
                        {testimonial.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Controls */}
          <div className="mt-8 flex justify-center gap-4">
            <CarouselPrevious
              className="static translate-x-0 translate-y-0 bg-gray-800 hover:bg-gray-700 text-white"
              aria-label="Previous testimonial"
            />
            <CarouselNext
              className="static translate-x-0 translate-y-0 bg-gray-800 hover:bg-gray-700 text-white"
              aria-label="Next testimonial"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
