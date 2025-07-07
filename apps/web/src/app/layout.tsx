import type { Metadata } from "next";
import { Toaster } from "sonner";

import "@repo/ui/globals.css";
import { fontHeading, fontSans } from "../lib/fonts";
import { Providers } from "../modules/layouts/providers";

export const metadata: Metadata = {
  title: "Game Zone Tech",
  description: "Your one-stop shop for all tech needs"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontHeading.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="bottom-left" />
        </Providers>
      </body>
    </html>
  );
}
