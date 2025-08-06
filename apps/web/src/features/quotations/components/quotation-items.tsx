"use client";

import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Trash2 } from "lucide-react";

export function QuotationItems() {
  const { items, removeItem, updateItemQuantity, updateItemNotes } =
    useQuotationStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No products added to quotation yet.</p>
        <p className="text-sm mt-1">Use the search above to add products.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {/* Product Image */}
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.product.images[0] ? (
                  <img
                    src={item.product.images[0].imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{item.product.name}</h3>

                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    SKU: {item.product.sku}
                  </Badge>
                  {item.variant && (
                    <Badge variant="outline" className="text-xs">
                      {item.variant.name}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  {/* Quantity */}
                  <div>
                    <label className="text-xs font-medium text-gray-700">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItemQuantity(
                          item.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="h-8 mt-1"
                    />
                  </div>

                  {/* Unit Price */}
                  <div>
                    <label className="text-xs font-medium text-gray-700">
                      Unit Price
                    </label>
                    <div className="h-8 mt-1 px-3 py-1 bg-gray-50 rounded text-sm flex items-center">
                      ${item.unitPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Total Price */}
                  <div>
                    <label className="text-xs font-medium text-gray-700">
                      Total
                    </label>
                    <div className="h-8 mt-1 px-3 py-1 bg-gray-50 rounded text-sm flex items-center font-semibold">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-3">
                  <label className="text-xs font-medium text-gray-700">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add notes for this item..."
                    value={item.notes || ""}
                    onChange={(e) => updateItemNotes(item.id, e.target.value)}
                    className="mt-1 text-sm min-h-[60px]"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
