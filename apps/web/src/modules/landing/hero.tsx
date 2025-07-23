"use client";
import Image from "next/image";

import { SITE_NAME } from "@/lib/constants";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@repo/ui/components/carousel";
import Link from "next/link";

type Props = {};

export function Hero({}: Props) {
  const carouselImages = [
    "/assets/bg-dark.jpg",
    "/assets/macbook.png" // Replace with your image paths
  ];

  return (
    <div className="relative w-full h-fit overflow-hidden p-4">
      {/* Content Overlay */}
      <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/80 to-black/10 w-full flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src="/assets/gamezonetech.png"
            alt={SITE_NAME}
            width={120}
            height={120}
            className="object-contain"
          />
          <h1 className="text-5xl font-black text-amber-500 text-center font-heading">
            {SITE_NAME}
          </h1>
          <p className="text-amber-200">
            Contact Us:{" "}
            <span className="font-semibold">+94 76 023 0340</span>{" "}
          </p>

          <div className="mt-3 flex items-center gap-3 z-40 pointer-events-auto">
            <Button asChild variant={"accent"}>
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild variant={"accent-outline"}>
              <Link href="#">Featured</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel with Images */}
      <Carousel className="w-full h-full">
        <CarouselContent>
          {carouselImages.map((src, index) => (
            <CarouselItem key={index} className="basis-full">
              <Card className="h-fit p-0 overflow-hidden">
                <CardContent className="flex items-center justify-center p-0 h-full relative">
                  <Image
                    src={src}
                    alt={`Hero Slide ${index + 1}`}
                    width={1920}
                    height={640}
                    // optimize: remove absolute positioning here since parent CardContent is flex and items-center, justify-center
                    // and object-cover and object-top should be enough for image fitting
                    className="w-full h-[60vh] object-cover object-center"
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
    </div>
  );
}
