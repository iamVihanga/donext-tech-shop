"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import {
  CheckCircleIcon,
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCreateProductStore } from "../../store/create-product-store";

export function SummaryView() {
  const state = useCreateProductStore((state) => state);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { basicInformation, media, inventory, pricing, additional } = state;

  // Get current price based on selected variant or base price
  const getCurrentPrice = () => {
    if (
      inventory.hasVariants &&
      selectedVariant &&
      inventory.variantTypes.length > 0
    ) {
      const variant = inventory?.variantTypes[0]?.values.find(
        (v) => v.name === selectedVariant
      );
      return variant?.price || 0;
    }
    return pricing.basePrice;
  };

  const getComparePrice = () => {
    if (
      inventory.hasVariants &&
      selectedVariant &&
      inventory.variantTypes.length > 0
    ) {
      const variant = inventory?.variantTypes[0]?.values.find(
        (v) => v.name === selectedVariant
      );
      return variant?.comparePrice! > 0 ? variant?.comparePrice : null;
    }

    return null;
  };

  const thumbnailImage =
    media.images.find((img) => img.isThumbnail) || media.images[0];
  const currentPrice = getCurrentPrice();
  const comparePrice = getComparePrice();
  const hasDiscount = comparePrice && comparePrice > currentPrice;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            {media.images.length > 0 ? (
              <Image
                src={
                  media.images[selectedImageIndex]?.url ||
                  thumbnailImage?.url ||
                  ""
                }
                alt={basicInformation.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {media.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {media.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${basicInformation.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {basicInformation.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
              {basicInformation.isActive ? (
                <Badge
                  variant="default"
                  className="bg-green-800/20 text-green-800"
                >
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-primary font-heading">
              {basicInformation.name}
            </h1>

            {/* Rating (dummy) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground/50">
                (4.0) 123 reviews
              </span>
            </div>

            <p className="text-muted-foreground/70 text-lg">
              {basicInformation.shortDescription}
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                LKR {currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-foreground/50 line-through">
                    LKR {comparePrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive">
                    {Math.round(
                      ((comparePrice - currentPrice) / comparePrice) * 100
                    )}
                    % OFF
                  </Badge>
                </>
              )}
            </div>
            {inventory.hasVariants && !selectedVariant && (
              <p className="text-sm text-foreground/50">
                Price varies by variant selection
              </p>
            )}
          </div>

          {/* Variants */}
          {inventory.hasVariants &&
            inventory.variantTypes &&
            inventory.variantTypes.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {inventory?.variantTypes[0]?.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {inventory?.variantTypes[0]?.values.map((variant) => (
                      <Button
                        key={variant.name}
                        onClick={() => setSelectedVariant(variant.name)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors`}
                        variant={
                          selectedVariant === variant.name
                            ? "default"
                            : "outline"
                        }
                      >
                        {variant.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                disabled={!basicInformation.isActive}
              >
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <HeartIcon className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <ShareIcon className="w-5 h-5" />
              </Button>
            </div>

            {inventory.quantity > 0 && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                {inventory.quantity} items in stock
              </p>
            )}
          </div>

          {/* Shipping Info */}
          {additional.requiresShipping && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-600">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Details */}
          <div className="space-y-4">
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{inventory.mainSku}</span>
                </div>
                {additional.weight > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{additional.weight} kg</span>
                  </div>
                )}
                {additional.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">{additional.dimensions}</span>
                  </div>
                )}
                {additional.tags && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {additional.tags.split(",").map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
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
      <div className="mt-12">
        <Separator className="mb-8" />
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-foreground/80 leading-relaxed">
              {basicInformation.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      {/* Variant Details Table */}
      {inventory.hasVariants && inventory.variantTypes.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <h2 className="text-2xl font-bold mb-6">Available Variants</h2>

          {inventory.variantTypes.map((variantType) => (
            <div key={variantType.name} className="space-y-3">
              <h4 className="font-medium text-sm">
                {variantType.name} Variants
              </h4>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Variant</th>
                      <th className="text-left p-3 font-medium">SKU</th>
                      <th className="text-left p-3 font-medium">Price ($)</th>
                      <th className="text-left p-3 font-medium">
                        Compare Price ($)
                      </th>
                      <th className="text-left p-3 font-medium">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantType.values.map((variant, index) => (
                      <tr
                        key={variant.name}
                        className={index % 2 === 0 ? "bg-muted/25" : ""}
                      >
                        <td className="p-3 font-medium">{variant.name}</td>
                        <td className="p-3 text-sm text-muted-foreground font-mono">
                          {variant.sku}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold">
                            ${variant.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3">
                          {variant.comparePrice > 0 ? (
                            <span className="text-muted-foreground">
                              ${variant.comparePrice.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              variant.quantity > 0
                                ? "bg-green-800/10 text-green-800"
                                : "bg-red-800/10 text-red-800"
                            }`}
                          >
                            {variant.quantity > 0
                              ? `${variant.quantity} in stock`
                              : "Out of stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
