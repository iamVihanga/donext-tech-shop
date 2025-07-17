import { CartInitializer } from "@/features/cart/components/cart-initializer";
import { Footer } from "@/modules/landing/footer";
import { Navbar } from "@/modules/landing/navbar";
import { Topbar } from "@/modules/landing/topbar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function HomepageLayout({ children }: Props) {
  return (
    <div>
      <CartInitializer />
      <Topbar />

      <Navbar />

      {children}

      <Footer />
    </div>
  );
}
