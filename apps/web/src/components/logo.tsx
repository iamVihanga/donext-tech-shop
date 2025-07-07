import { SiTechcrunch } from "react-icons/si";

type Props = {};

export function Logo({}: Props) {
  return (
    <div className="flex items-center gap-4">
      <SiTechcrunch className="size-12 text-amber-400" />

      <div className="flex flex-col gap-0">
        <span className="text-xs font-bold text-amber-500 font-heading uppercase">
          Game Zone Tech
        </span>
      </div>
    </div>
  );
}
