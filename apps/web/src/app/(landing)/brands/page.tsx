import { BrandsGrid } from "@/modules/landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands | Donext Tech Shop",
  description: "Explore all our trusted technology brands and partners"
};

export default function BrandsPage() {
  return (
    <div className="content-container mx-auto py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Our Trusted Brands</h1>
          <p className="text-muted-foreground">
            We partner with leading technology brands to bring you the highest
            quality products
          </p>
        </div>

        <BrandsGrid />
      </div>
    </div>
  );
}
