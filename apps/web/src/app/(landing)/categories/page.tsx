import { CategoryGrid } from "@/modules/landing/category-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Donext Tech Shop",
  description: "Browse all product categories in our store"
};

export default function CategoriesPage() {
  return (
    <div className="content-container mx-auto py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Shop by Category</h1>
          <p className="text-muted-foreground">
            Explore our wide range of products organized by categories
          </p>
        </div>

        <CategoryGrid />
      </div>
    </div>
  );
}
