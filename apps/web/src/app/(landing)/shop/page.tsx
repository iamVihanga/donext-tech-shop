import ShopProducts from "@/features/shop/components/shop-products";

export const metadata = {
  title: "Shop - Game Zone Tech",
  description:
    "Browse our latest products and find the perfect tech for your gaming needs."
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>
        <ShopProducts />
      </div>
    </div>
  );
}
