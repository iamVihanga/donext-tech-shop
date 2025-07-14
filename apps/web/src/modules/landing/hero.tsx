import { SITE_NAME } from "@/lib/constants";
import Image from "next/image";

type Props = {};

export function Hero({}: Props) {
  return (
    <div className="p-4 rounded-lg overflow-hidden">
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/assets/bg-dark.jpg"
          alt="Hero Image"
          width={1920}
          height={1080}
          className="absolute top-0 left-0 w-full h-full object-cover object-top opacity-30 rounded-xl"
          priority
        />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-amber-500 font-heading">
              {SITE_NAME}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-md mx-auto">
              Discover amazing products at unbeatable prices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
