"use client";

import { SignoutButton } from "@/features/auth/components/signout-button";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/components/sheet";
import {
  DollarSignIcon,
  MenuIcon,
  ShoppingBagIcon,
  UserIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {};

function SidebarItem({
  children,
  link,
  icon,
  onClick
}: {
  children: React.ReactNode;
  link: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Button
      asChild
      className="w-full text-left rounded-sm flex flex-row items-start justify-start gap-2"
      variant={pathname === link ? "secondary" : "ghost"}
      icon={icon}
      onClick={onClick}
    >
      <Link href={link}>{children}</Link>
    </Button>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="w-full h-fit p-1 flex flex-col gap-2 rounded-sm">
      <SidebarItem link="/account" icon={<UserIcon />} onClick={onItemClick}>
        Account Overview
      </SidebarItem>
      <SidebarItem
        link="/account/orders"
        icon={<DollarSignIcon />}
        onClick={onItemClick}
      >
        Orders
      </SidebarItem>
      <SidebarItem
        link="/cart"
        icon={<ShoppingBagIcon />}
        onClick={onItemClick}
      >
        Cart
      </SidebarItem>

      <div onClick={onItemClick}>
        <SignoutButton />
      </div>
    </div>
  );
}

export default function AccountSidebar({}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <MenuIcon className="h-4 w-4 mr-2" />
              Account Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Account Navigation</h2>
              <SidebarContent onItemClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-full">
        <Card>
          <SidebarContent />
        </Card>
      </aside>
    </>
  );
}
