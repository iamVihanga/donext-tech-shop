"use client";

import { useGetProducts } from "@/features/products/actions/use-get-products";
import { Product } from "@/features/products/schemas/products.zod";
import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<string, number>
  >({});
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});

  const addItem = useQuotationStore((state) => state.addItem);

  const { data: productsData, isLoading } = useGetProducts({
    search: searchTerm,
    limit: 20,
    page: 1
  });

  const handleAddToQuotation = (product: Product) => {
    const quantity = selectedQuantities[product.id] || 1;
    const variantId = selectedVariants[product.id];
    const variant = variantId
      ? product.variants.find((v) => v.id === variantId)
      : undefined;

    // Check stock availability
    const availableStock = variant
      ? (variant.stockQuantity ?? 0)
      : (product.stockQuantity ?? 0);

    if (availableStock <= 0) {
      toast.error("This product is currently out of stock");
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    addItem(product, variant, quantity);

    // Reset selections
    setSelectedQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    setSelectedVariants((prev) => ({ ...prev, [product.id]: "" }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search for computer parts..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="pl-10"
        />
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {productsData?.data?.map((product) => {
          const selectedVariantId = selectedVariants[product.id];
          const selectedVariant = selectedVariantId
            ? product.variants.find((v) => v.id === selectedVariantId)
            : undefined;

          // Check stock availability
          const isOutOfStock = selectedVariant
            ? (selectedVariant.stockQuantity ?? 0) <= 0
            : (product.stockQuantity ?? 0) <= 0;

          const availableStock = selectedVariant
            ? (selectedVariant.stockQuantity ?? 0)
            : (product.stockQuantity ?? 0);

          const selectedQuantity = selectedQuantities[product.id] || 1;
          const quantityExceedsStock = selectedQuantity > availableStock;

          return (
            <Card key={product.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        SKU: {product.sku}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ${parseFloat(product.price).toFixed(2)}
                      </Badge>
                      {product.variants.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {product.variants.length} variants
                        </Badge>
                      )}
                      <Badge
                        variant={
                          isOutOfStock
                            ? "destructive"
                            : availableStock < 10
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : `${availableStock} in stock`}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Add to Quotation Section */}
                <div className="flex flex-col gap-2 ml-4 min-w-[200px]">
                  {/* Variant Selection */}
                  {product.variants.length > 0 && (
                    <Select
                      value={selectedVariants[product.id] || ""}
                      onValueChange={(value: string) =>
                        setSelectedVariants((prev) => ({
                          ...prev,
                          [product.id]: value
                        }))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.name} - $
                            {parseFloat(variant.price || "0").toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Quantity and Add Button */}
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max={availableStock}
                      value={selectedQuantities[product.id] || 1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedQuantities((prev) => ({
                          ...prev,
                          [product.id]: parseInt(e.target.value) || 1
                        }))
                      }
                      className="w-16 h-8 text-xs"
                      title={`Available stock: ${availableStock}`}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddToQuotation(product)}
                      className="h-8"
                      disabled={isOutOfStock || quantityExceedsStock}
                      title={
                        isOutOfStock
                          ? "Product is out of stock"
                          : quantityExceedsStock
                            ? `Only ${availableStock} items available`
                            : undefined
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {isOutOfStock ? "Out of Stock" : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {productsData?.data?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? `No products found for "${searchTerm}"`
              : "Start typing to search for products"}
          </div>
        )}
      </div>
    </div>
  );
}
