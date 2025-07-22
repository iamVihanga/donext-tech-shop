import { SOCIALS } from "@/lib/constants";
import Link from "next/link";

type Props = {};

export function Footer({}: Props) {
  return (
    <div className="">
      <div className="mt-6 w-full py-8 bg-amber-500 text-muted content-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg uppercase font-heading font-black text-background">
            GameZoneTech
          </h2>
          <h3 className="text-lg font-bold text-background">About Us</h3>
          <p className="text-sm text-background">
            We are committed to providing the best products and services to our
            customers.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-background">Contact Us</h3>
          <p className="text-sm text-background">Email: info@gamezonetech.lk</p>
          <p className="text-sm text-background">Phone: +94 123 456 789</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-background">Follow Us</h3>
          <p className="text-sm text-background">
            Stay connected with us on social media.
          </p>

          <div className="mt-2 flex items-center gap-3">
            {SOCIALS.map((item, i) => (
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                className="space-x-2 text-background hover:underline transition-all duration-200"
              >
                <item.icon className="inline-block" />
                {item.social}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-background">Newsletter</h3>
          <p className="text-sm text-background">
            Subscribe to our newsletter for updates.
          </p>
        </div>
      </div>

      <div className="w-full text-center bg-amber-950/10 py-3">
        <p className="text-xs text-foreground">
          &copy; {new Date().getFullYear()} GameZoneTech. All rights reserved.
        </p>
      </div>
    </div>
  );
}
