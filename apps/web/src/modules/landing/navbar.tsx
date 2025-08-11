import { Logo } from "@/components/logo";
import { Wishlist } from "@/features/wishlist/components/wishlist";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/components/sheet";
import { MenuIcon, SearchIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { SearchBar } from "../layouts/search-bar";
import { CategoryDropdown } from "./category-dropdown-button";
import { MobileCategoryMenu } from "./mobile-category-menu";
import { NavbarQuotationSection } from "./navbar-quotation-section";

export async function Navbar() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  return (
    <nav className="w-full h-14 bg-muted shadow-lg">
      <div className="content-container mx-auto h-full flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                {/* Mobile Search */}
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Search products..." />
                </div>

                <Separator />

                {/* Mobile Categories */}
                <MobileCategoryMenu />

                <Separator />

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-2">
                  {/* <Wishlist /> */}
                  <NavbarQuotationSection />
                  {session.data ? (
                    <>
                      <Button asChild variant="default" className="w-full">
                        <Link href="/account">My Account</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/signin">Sign In</Link>
                      </Button>
                      <Button asChild variant="default" className="w-full">
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Desktop Navigation - Categories + Search */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-4">
          <CategoryDropdown />

          <div className="flex-1">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          {/* <Wishlist /> */}
          <NavbarQuotationSection />

          {session.data ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="accent" className="w-32">
                <Link href="/account">Account</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant={"accent-outline"}>
                <Link href="/signin">Login</Link>
              </Button>
              <Button asChild variant={"accent"}>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Actions - Only show quotation/wishlist on mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Wishlist />
          <NavbarQuotationSection />
        </div>
      </div>
    </nav>
  );
}
