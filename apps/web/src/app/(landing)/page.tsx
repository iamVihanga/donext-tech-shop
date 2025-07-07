import { Hero } from "@/modules/landing/hero";

import { ProductGrid } from "@/modules/landing/product-grid";
import { AuthChecker } from "./auth-checker";

export default async function Homepage() {
  return (
    <div>
      <Hero />

      {/* All Products Grid */}
      <div className="content-container mx-auto my-3">
        <ProductGrid />
      </div>

      <AuthChecker />
    </div>
  );
}
