import { SITE_NAME } from "@/lib/constants";
import Image from "next/image";

type Props = {};

export function Hero({}: Props) {
  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src="/assets/bg-dark.jpg"
        alt="Hero Image"
        width={1920}
        height={1080}
        className="absolute top-0 left-0 w-full h-full object-cover object-top opacity-30"
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <h1 className="text-5xl font-black text-amber-500 text-center font-heading">
          {SITE_NAME}
        </h1>
      </div>
    </div>
  );
}
