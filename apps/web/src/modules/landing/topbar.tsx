import Socials from "@/components/socials";
import Link from "next/link";

export function Topbar() {
  return (
    <div className="hidden sm:flex bg-accent h-9">
      <div className="content-container flex items-center justify-between">
        <Socials />

        <div className="text-xs text-accent-foreground font-semibold tracking-widest">
          <span>ISLANDWIDE DELIVERY IS AVAILABLE</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-accent-foreground">
          <Link
            className="hover:underline transition-all duration-200  underline-offset-8 hover:underline-offset-2"
            href="/about"
          >
            About Us
          </Link>
          <Link
            className="hover:underline transition-all duration-200 underline-offset-8 hover:underline-offset-2"
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className="hover:underline transition-all duration-200 underline-offset-8 hover:underline-offset-2"
            href="/faq"
          >
            FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
