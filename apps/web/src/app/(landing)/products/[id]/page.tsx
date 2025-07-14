import { ProductPrice } from "@/components/price";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { getProductThumbnail } from "@/lib/helpers";
import { getClient } from "@/lib/rpc/server";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import {
  CheckCircleIcon,
  ShareIcon,
  ShoppingCartIcon,
  TruckIcon
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "./product-actions";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage(props: Props) {
  const params = await props.params;

  const rpcClient = await getClient();

  // Fetch single product by slug or ID
  const response = await rpcClient.api.products[":id"].$get({
    param: { id: params.id }
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }

    const errorData = await response.json();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            {errorData.message || "Failed to load product"}
          </p>
          <Button variant="outline">Go Back Home</Button>
        </div>
      </div>
    );
  }

  const product = await response.json();

  // Get thumbnail or first image
  const thumbnailImage = getProductThumbnail(product);

  const hasDiscount = product.variants?.some(
    (variant: any) =>
      variant.comparePrice &&
      parseFloat(variant.comparePrice) > parseFloat(variant.price || "0")
  );

  return (
    <div className="min-h-screen bg-secondary/20 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-800 border border-neutral-700">
              {thumbnailImage ? (
                <Image
                  src={thumbnailImage}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg">No Image Available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-neutral-600 hover:border-amber-500 transition-colors cursor-pointer"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${image.altText}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {product.isFeatured && (
                  <Badge className="bg-amber-500 text-neutral-900 font-semibold">
                    Featured
                  </Badge>
                )}
                {product.isActive ? (
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}

                {hasDiscount && (
                  <Badge className="bg-red-500 text-white">Sale</Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-neutral-100 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              {/* <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4
                          ? "text-amber-400 fill-current"
                          : "text-neutral-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-neutral-400">(4.0) • 123 reviews</span>
              </div> */}

              {product.shortDescription && (
                <p className="text-neutral-300 text-lg leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <ProductPrice product={product} className="text-4xl" />

                {hasDiscount && (
                  <Badge className="bg-red-500 text-white text-sm">SALE</Badge>
                )}
              </div>
              {product.variants?.length > 0 && (
                <p className="text-neutral-400">
                  Price varies by variant selection
                </p>
              )}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <ProductActions product={product} />
            )}

            {/* Actions */}
            <div className="space-y-6">
              <div className="flex gap-4">
                {product.variants && product.variants.length > 0 ? (
                  <Button
                    size="lg"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-semibold shadow-lg hover:shadow-amber-500/25"
                    disabled={!product.isActive}
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Select Variant to Add
                  </Button>
                ) : (
                  <AddToCartButton
                    product={product}
                    size="lg"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-semibold shadow-lg hover:shadow-amber-500/25"
                  />
                )}

                <WishlistButton className="w-12 h-12" product={product} />

                <Button
                  variant="outline"
                  size="lg"
                  className="border-neutral-600 hover:border-amber-500"
                >
                  <ShareIcon className="w-5 h-5" />
                </Button>
              </div>

              {/* Stock Info */}
              <div className="space-y-2">
                {product.variants?.length > 0 ? (
                  <div className="flex items-center gap-2">
                    {product.variants.some((v: any) => v.stockQuantity > 0) ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">
                          Available in multiple variants
                        </span>
                      </>
                    ) : (
                      <span className="text-red-400">
                        All variants out of stock
                      </span>
                    )}
                  </div>
                ) : (
                  product?.stockQuantity &&
                  product?.stockQuantity > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">
                        {product.stockQuantity} items in stock
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Shipping Info */}
            {product.requiresShipping && (
              <Card className="bg-neutral-800 border-neutral-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <TruckIcon className="w-6 h-6 text-amber-500" />
                    <div>
                      <p className="font-semibold text-neutral-100">
                        Free Shipping
                      </p>
                      <p className="text-neutral-400">
                        Estimated delivery: 3-5 business days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Details */}
            <div className="space-y-4">
              <Separator className="bg-neutral-700" />
              <div>
                <h3 className="text-xl font-semibold mb-4 text-neutral-100">
                  Product Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">SKU:</span>
                    <span className="font-medium text-neutral-200 font-mono">
                      {product.sku}
                    </span>
                  </div>
                  {product?.weight && parseInt(product?.weight) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Weight:</span>
                      <span className="font-medium text-neutral-200">
                        {product.weight} kg
                      </span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Dimensions:</span>
                      <span className="font-medium text-neutral-200">
                        {product.dimensions}
                      </span>
                    </div>
                  )}
                  {product.tags && (
                    <div className="flex justify-between items-start">
                      <span className="text-neutral-400">Tags:</span>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {product.tags
                          .split(",")
                          .map((tag: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-neutral-600 text-neutral-300"
                            >
                              {tag.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="mt-16">
            <Separator className="mb-10 bg-neutral-700" />
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold mb-6 text-neutral-100">
                Description
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-neutral-300 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Variant Details Table */}
        {product.variants?.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-10 bg-neutral-700" />
            <h2 className="text-3xl font-bold mb-8 text-neutral-100">
              Available Variants
            </h2>

            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
              <table className="w-full">
                <thead className="bg-neutral-700/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-neutral-200">
                      Variant
                    </th>
                    <th className="text-left p-4 font-semibold text-neutral-200">
                      SKU
                    </th>
                    <th className="text-left p-4 font-semibold text-neutral-200">
                      Price
                    </th>
                    <th className="text-left p-4 font-semibold text-neutral-200">
                      Compare Price
                    </th>
                    <th className="text-left p-4 font-semibold text-neutral-200">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant: any, index: number) => (
                    <tr
                      key={variant.id}
                      className={
                        index % 2 === 0 ? "bg-neutral-800/50" : "bg-neutral-800"
                      }
                    >
                      <td className="p-4 font-medium text-neutral-200">
                        {variant.name}
                      </td>
                      <td className="p-4 text-neutral-400 font-mono text-sm">
                        {variant.sku}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-neutral-100">
                          ${parseFloat(variant.price || "0").toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        {variant.comparePrice &&
                        parseFloat(variant.comparePrice) > 0 ? (
                          <span className="text-neutral-400 line-through">
                            ${parseFloat(variant.comparePrice).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-neutral-600">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            variant.stockQuantity > 0
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {variant.stockQuantity > 0
                            ? `${variant.stockQuantity} in stock`
                            : "Out of stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
