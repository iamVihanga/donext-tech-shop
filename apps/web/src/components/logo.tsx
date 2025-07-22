import Image from "next/image";

type Props = {};

export function Logo({}: Props) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={"/assets/gamezonetech.png"}
        alt="gamezonetech"
        width={60}
        height={60}
        className="size-8 object-cover"
      />

      <div className="flex flex-col gap-0">
        <span className="text-sm font-bold text-amber-500 font-heading uppercase">
          Game Zone Tech
        </span>
      </div>
    </div>
  );
}
