import { BrandsSection, Hero, ProductGrid } from "@/modules/landing";

export default async function Homepage() {
  return (
    <div>
      <Hero />

      {/* Brands Section */}
      <BrandsSection />

      {/* All Products Grid */}
      <div className="content-container mx-auto my-3">
        <ProductGrid />
      </div>
    </div>
  );
}
