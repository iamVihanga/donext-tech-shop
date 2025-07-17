import { BrandsSection, Hero, ProductGrid } from "@/modules/landing";
import LandingSectionTitle from "@/modules/landing/landing-section-title";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";

export default async function Homepage() {
  return (
    <div>
      <Hero />

      {/* Brands Section */}
      <div className="mt-6 content-container">
        <LandingSectionTitle
          title={
            <span>
              Our Trusted <span className="text-amber-500">Brands</span>
            </span>
          }
          description="Explore our collection of trusted brands that offer quality and reliability."
          rightContent={
            <Button asChild variant={"link"}>
              <Link href="/brands">View All Brands</Link>
            </Button>
          }
        />

        <BrandsSection />
      </div>

      {/* All Products Grid */}
      <div className="content-container mx-auto mt-14">
        <LandingSectionTitle
          title={
            <span>
              <span className="text-amber-500">Featured</span> Products
            </span>
          }
          description="Discover our featured products that stand out for their quality and value."
          rightContent={
            <Button asChild variant={"link"}>
              <Link href="/shop">Explore Products</Link>
            </Button>
          }
          className="mb-4"
        />

        <ProductGrid />
      </div>
    </div>
  );
}
