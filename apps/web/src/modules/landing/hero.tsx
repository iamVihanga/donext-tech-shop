"use client";
import { SITE_NAME } from "@/lib/constants";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/carousel";
import Image from "next/image";

type Props = {};

export function Hero({}: Props) {
  const carouselImages = [
    "/assets/bg-dark.jpg",
    "/assets/macbook.png", // Replace with your image paths
  ];

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      {/* Carousel with Images */}
      <Carousel className="w-full h-full">
        <CarouselContent>
          {carouselImages.map((src, index) => (
            <CarouselItem key={index} className="basis-full">
              <Card className="h-full overflow-hidden">
                <CardContent className="flex items-center justify-center p-0 h-full relative">
                  <Image
                    src={src}
                    alt={`Hero Slide ${index + 1}`}
                    width={1920}
                    height={1080}
                    // optimize: remove absolute positioning here since parent CardContent is flex and items-center, justify-center
                    // and object-cover and object-top should be enough for image fitting
                    className="w-full h-full object-cover object-top"
                    priority={index === 0}
                  />
                  {/* Overlay for background opacity effect */}
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel Navigation Buttons */}
        {/* optimize: adjust button positioning if needed, current positioning works fine relative to Carousel container */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20" />
      </Carousel>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <h1 className="text-5xl font-black text-amber-500 text-center font-heading">
          {SITE_NAME}
        </h1>
      </div>
    </div>
  );
}
