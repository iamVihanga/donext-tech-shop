import { ProductCard } from "@/features/products/components/product-card";
import { getClient } from "@/lib/rpc/server";

type Props = {};

export async function ProductGrid({}: Props) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.products.$get({
    query: { limit: "20" }
  });

  if (!response.ok) {
    const errorData = await response.json();

    return (
      <div className="text-center py-8">
        <p className="text-red-400">
          {errorData.message || "An error occurred while fetching products."}
        </p>
      </div>
    );
  }

  const productsData = await response.json();
  const products = productsData.data;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">
          No products available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
