import Image from "next/image";

type Props = {};

export function Hero({}: Props) {
  return (
    <div className="">
      <Image
        src="/assets/bg-dark.jpg"
        alt="Hero Image"
        width={1920}
        height={1080}
        className="w-full h-[60vh] object-cover object-top opacity-30"
      />
    </div>
  );
}
