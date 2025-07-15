"use client";

import { Logo } from "@/components/logo";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AccountNavbar() {
  const session = authClient.useSession();

  return (
    <nav className="w-full h-14 bg-muted shadow-lg">
      <div className="content-container mx-auto h-full flex items-center justify-between">
        {/* Back to Home */}
        <div className="flex-shrink-0">
          <Button
            asChild
            icon={<ArrowLeft />}
            variant={"ghost"}
            size="sm"
            className="md:size-default"
          >
            <Link href="/" className="hidden sm:flex">
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant={"ghost"} size="sm" className="sm:hidden">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        <div className="flex-shrink-0 text-right">
          {session.data && (
            <div className="hidden sm:block">
              <p className="text-foreground/60 text-xs">Hello,</p>
              <p className="text-sm text-foreground truncate max-w-32">
                {session.data.user.name || session.data.user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
