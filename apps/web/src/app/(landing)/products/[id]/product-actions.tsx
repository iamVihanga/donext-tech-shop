// Create: product-actions.tsx
"use client";

import { formatPrice } from "@/components/price";
import { ProductVariant } from "@/features/products/schemas/products.zod";
import { AddToQuotationButton } from "@/features/quotations/components/add-to-quotation-button";
import { Button } from "@repo/ui/components/button";
import { useState } from "react";

interface ProductActionsProps {
  product: any;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  // Group variants by attribute type
  const variantGroups = product.variants?.reduce(
    (groups: any, variant: any) => {
      const attributes = JSON.parse(variant.attributes || "{}");
      const type = attributes.type || "Variant";

      if (!groups[type]) {
        groups[type] = [];
      }

      groups[type].push(variant);
      return groups;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {Object.entries(variantGroups || {}).map(
        ([type, variants]: [string, any]) => (
          <div key={type} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-200">{type}</h3>
            <div className="flex flex-wrap gap-3">
              {variants.map((variant: any) => (
                <Button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  variant={
                    selectedVariant?.id === variant.id ? "default" : "outline"
                  }
                  className={`border-gray-600 ${
                    selectedVariant?.id === variant.id
                      ? "bg-amber-500 text-gray-900 border-amber-500"
                      : "hover:border-amber-500 hover:text-amber-400"
                  }`}
                  disabled={variant.stockQuantity <= 0}
                >
                  {variant.name}
                  {variant.stockQuantity <= 0 && (
                    <span className="ml-2 text-xs">(Out of stock)</span>
                  )}
                </Button>
              ))}
            </div>

            {selectedVariant && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-200">
                      Selected: {selectedVariant.name}
                    </p>
                    <p className="text-gray-400 text-sm font-mono">
                      SKU: {selectedVariant.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-100">
                      {formatPrice(
                        parseFloat(selectedVariant.price || "0"),
                        "LKR"
                      )}
                    </p>
                    {selectedVariant.comparePrice &&
                      parseFloat(selectedVariant.comparePrice) > 0 && (
                        <p className="text-gray-400 line-through text-sm">
                          {formatPrice(
                            parseFloat(selectedVariant.comparePrice),
                            "LKR"
                          )}
                        </p>
                      )}
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`text-sm font-medium ${
                      (selectedVariant?.stockQuantity || 0) > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {(selectedVariant?.stockQuantity || 0) > 0
                      ? `${selectedVariant.stockQuantity} in stock`
                      : "Out of stock"}
                  </span>
                </div>
                <div className="mt-4">
                  <AddToQuotationButton
                    product={product}
                    variantId={selectedVariant.id}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-900 font-semibold"
                    disabled={
                      (selectedVariant?.stockQuantity || 0) < 1 ? true : false
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
