import { Logo } from "@/components/logo";
import { Wishlist } from "@/features/wishlist/components/wishlist";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { SearchIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { NavbarCartSection } from "./navbar-cart-section";

export async function Navbar() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  return (
    <nav className="w-full h-14 bg-muted shadow-lg">
      <div className="content-container mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Search */}
        <div className="relative h-11 w-96">
          {/* Search Icon */}
          <div className="absolute h-full flex items-center left-2">
            <SearchIcon className="size-5 text-muted-foreground" />
          </div>

          <Input
            className="h-full pl-10"
            placeholder="iPhone 14 Pro Max, Gaming Laptop..."
          />
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-3">
          <Wishlist />

          {session.data ? (
            <div className="flex items-center gap-2">
              <NavbarCartSection />
              <Button variant="accent" className="w-32">
                Account
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant={"accent-outline"}>Login</Button>
              <Button variant={"accent"}>Register</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
