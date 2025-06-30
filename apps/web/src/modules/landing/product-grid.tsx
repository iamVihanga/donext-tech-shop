import { Product } from "@/features/products/schemas/products.zod";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { getClient } from "@/lib/rpc/server";
import Image from "next/image";
import Link from "next/link";

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
        {products.map((product: any) => {
          // Get thumbnail or first image
          const thumbnailImage =
            product.images?.find((img: any) => img.isThumbnail) ||
            product.images?.[0];

          // Calculate discount percentage if compare price exists
          const hasDiscount = product.variants?.some(
            (variant: any) =>
              variant.comparePrice &&
              parseFloat(variant.comparePrice) >
                parseFloat(variant.price || "0")
          );

          const getPrice = () => {
            if (product.variants?.length > 0) {
              const prices = product.variants
                .map((v: any) => parseFloat(v.price || "0"))
                .filter((p: number) => p > 0);
              if (prices.length > 0) {
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                return minPrice === maxPrice
                  ? `$${minPrice.toFixed(2)}`
                  : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
              }
            }
            return `$${parseFloat(product.price || "0").toFixed(2)}`;
          };

          const getComparePrice = () => {
            if (product.variants?.length > 0) {
              const variant = product.variants.find(
                (v: any) =>
                  v.comparePrice &&
                  parseFloat(v.comparePrice) > parseFloat(v.price || "0")
              );
              return variant ? parseFloat(variant.comparePrice) : null;
            }
            return null;
          };

          const currentPrice = getPrice();
          const comparePrice = getComparePrice();

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block"
            >
              <div className="bg-secondary rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden border border-gray-700 hover:border-amber-500/50 transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-900">
                  {thumbnailImage ? (
                    <Image
                      src={thumbnailImage.imageUrl}
                      alt={thumbnailImage.altText || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <div className="text-gray-500 text-center">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">No Image</span>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isFeatured && (
                      <span className="bg-amber-500 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                        Featured
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                        Sale
                      </span>
                    )}
                    {!product.isActive && (
                      <span className="bg-gray-600 text-gray-200 text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
                        Unavailable
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-col gap-2">
                      <WishlistButton product={product as Product} />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-100 text-sm mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Short Description */}
                  {product.shortDescription && (
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* Rating (Dummy for now) */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < 4 ? "text-amber-400" : "text-gray-600"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-100 text-lg">
                        {currentPrice}
                      </span>
                      {comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mt-3">
                    {product.variants?.length > 0 ? (
                      <div className="flex items-center gap-1">
                        {product.variants.some(
                          (v: any) => v.stockQuantity > 0
                        ) ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-400 font-medium">
                              In Stock
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-xs text-red-400 font-medium">
                              Out of Stock
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {product.stockQuantity > 0 ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-400 font-medium">
                              {product.stockQuantity} in stock
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-xs text-red-400 font-medium">
                              Out of Stock
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="px-4 pb-4">
                  <button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/25"
                    disabled={
                      !product.isActive ||
                      (product.variants?.length > 0
                        ? !product.variants.some(
                            (v: any) => v.stockQuantity > 0
                          )
                        : product.stockQuantity <= 0)
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
