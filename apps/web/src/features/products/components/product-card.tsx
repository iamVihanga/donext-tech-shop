import { ProductPrice } from "@/components/price";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { getProductPrice, getProductThumbnail } from "@/lib/helpers";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardFooter } from "@repo/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../schemas/products.zod";
import { StockStatus } from "./stock-status";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const thumbnail = getProductThumbnail(product);
  const productPrice = getProductPrice(product);

  return (
    <Card className="group p-0 rounded-lg transition-all duration-300 overflow-hidden bg-secondary/90 border border-card hover:border-amber-500/50 transform hover:scale-[1.02] flex flex-col gap-0">
      <div className="relative aspect-square overflow-hidden bg-neutral-900">
        {/* Image Area */}
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-gray-500 text-center">
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
          {product.isFeatured && (
            <span className="bg-amber-500 text-gray-900 text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
              Featured
            </span>
          )}
        </div>
      </div>

      <CardContent className="px-3 sm:px-4 py-2 sm:py-3 flex-1">
        <div className="space-y-1">
          {/* Product Name */}
          <Link
            href={`/products/${product.id}`}
            className="font-semibold text-sm sm:text-base text-card-foreground group-hover:text-amber-400 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          {product.shortDescription && (
            <p className="text-foreground/50 text-xs mt-1 sm:mt-2 mb-2 sm:mb-3 line-clamp-2 sm:truncate">
              {product.shortDescription}
            </p>
          )}

          <div className="flex flex-col items-start space-y-1">
            <ProductPrice product={product} />
            <StockStatus product={product} className="text-xs" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-3 sm:px-4 py-2 sm:py-3 w-full">
        <div className="flex items-center gap-2 w-full">
          <WishlistButton
            className="rounded h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
            product={product}
          />

          {product.variants && product.variants.length > 0 ? (
            <Button
              asChild
              variant={"accent"}
              className="flex-1 w-full rounded text-xs sm:text-sm h-8 sm:h-10"
            >
              <Link href={`/products/${product.id}`}>View Product</Link>
            </Button>
          ) : (
            <AddToCartButton
              product={product}
              className="flex-1 w-full rounded text-xs sm:text-sm h-8 sm:h-10"
              variant="accent"
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
