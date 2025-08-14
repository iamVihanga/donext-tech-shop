import { SOCIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RiCustomerService2Line } from "react-icons/ri";

type Props = {
  size?: string;
  className?: string;
  text?: boolean;
};

export default function Socials({ size, className, text = false }: Props) {
  return (
    <>
      <div
        className={cn(
          `text-[${size}] flex items-center gap-5 text-accent-foreground`,
          className
        )}
      >
        {SOCIALS.map((item, i) => (
          <Link
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
          >
            <item.icon className="inline-block" />
            {text && item.social}
          </Link>
        ))}

        <div className="flex items-center gap-2 text-sm font-semibold">
          {"|"}
          <RiCustomerService2Line />

          {/* <p>{process.env.NEXT_PUBLIC_CONTACT_NUMBER || "+94 755 1234"}</p> */}
          <div className="flex items-center gap-1">
            <Link
              href="tel:+94760230340"
              className="hover:text-amber-400 transition-colors duration-200"
            >
              +9476 023 0340
            </Link>
            <span> | </span>
            <Link
              href="tel:+94719308389"
              className="hover:text-amber-400 transition-colors duration-200"
            >
              +9471 930 8389
            </Link>
          </div>
          {/* <p>+94 755 1234</p> */}
        </div>
      </div>
    </>
  );
}
