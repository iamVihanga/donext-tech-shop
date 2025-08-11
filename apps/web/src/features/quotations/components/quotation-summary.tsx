"use client";

import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";

export function QuotationSummary() {
  const { items, totals, setDiscount } = useQuotationStore();

  const itemCount = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quotation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items:</span>
            <Badge variant="secondary">{itemCount}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Quantity:</span>
            <Badge variant="outline">{totalQuantity}</Badge>
          </div>
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="font-medium">${totals.taxAmount.toFixed(2)}</span>
          </div>

          {/* Discount Input */}
          <div className="space-y-2">
            <Label htmlFor="discount" className="text-sm text-gray-600">
              Discount:
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm">$</span>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={totals.discountAmount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="h-8 text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-base font-semibold">
            <span>Total Amount:</span>
            <span className="text-primary">
              ${totals.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Items Preview */}
        {items.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                Items in Quotation:
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs bg-gray-50 p-2 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {item.product.name}
                      </div>
                      {item.variant && (
                        <div className="text-gray-500 truncate">
                          {item.variant.name}
                        </div>
                      )}
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium ml-2">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
