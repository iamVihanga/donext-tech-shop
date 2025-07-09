"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { useUpdateVariantStock } from "@/features/products/actions/use-update-variant-stock";
import {
  Product,
  ProductVariant
} from "@/features/products/schemas/products.zod";

interface VariantStockDialogProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

interface VariantAdjustment {
  variantId: string;
  currentStock: number;
  adjustment: number;
  adjustmentType: "increase" | "decrease";
}

export const VariantStockDialog: React.FC<VariantStockDialogProps> = ({
  product,
  open,
  onClose
}) => {
  const [adjustments, setAdjustments] = useState<VariantAdjustment[]>([]);
  const { mutate: updateVariantStock, isPending } = useUpdateVariantStock();

  const handleAdjustment = (
    variantId: string,
    currentStock: number,
    type: "increase" | "decrease",
    amount: number
  ) => {
    setAdjustments((prev) => {
      const existing = prev.findIndex((adj) => adj.variantId === variantId);
      const newAdjustment: VariantAdjustment = {
        variantId,
        currentStock,
        adjustment: amount,
        adjustmentType: type
      };

      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newAdjustment;
        return updated;
      } else {
        return [...prev, newAdjustment];
      }
    });
  };

  const getVariantAdjustment = (variantId: string) => {
    return adjustments.find((adj) => adj.variantId === variantId);
  };

  const getNewStock = (variant: ProductVariant) => {
    const adjustment = getVariantAdjustment(variant.id);
    if (!adjustment) return variant.stockQuantity || 0;

    const current = variant.stockQuantity || 0;
    return adjustment.adjustmentType === "increase"
      ? current + adjustment.adjustment
      : Math.max(0, current - adjustment.adjustment);
  };

  const handleApplyChanges = () => {
    if (adjustments.length === 0) return;

    adjustments.forEach((adjustment) => {
      if (adjustment.adjustment > 0) {
        updateVariantStock({
          variantId: adjustment.variantId,
          adjustmentType: adjustment.adjustmentType,
          quantity: adjustment.adjustment,
          reason: `${adjustment.adjustmentType === "increase" ? "Increased" : "Decreased"} variant stock by ${adjustment.adjustment}`
        });
      }
    });

    onClose();
    setAdjustments([]);
  };

  const handleClose = () => {
    onClose();
    setAdjustments([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Variant Stock - {product.name}</DialogTitle>
          <DialogDescription>
            Adjust stock quantities for individual product variants.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {product.variants?.map((variant) => {
              const currentStock = variant.stockQuantity || 0;
              const adjustment = getVariantAdjustment(variant.id);
              const newStock = getNewStock(variant);

              return (
                <div
                  key={variant.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{variant.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        SKU: {variant.sku || "N/A"}
                      </div>
                    </div>
                    <Badge
                      variant={
                        currentStock > 5
                          ? "default"
                          : currentStock > 0
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {currentStock} units
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleAdjustment(
                          variant.id,
                          currentStock,
                          "decrease",
                          1
                        )
                      }
                      disabled={currentStock <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Input
                      type="number"
                      min="0"
                      value={adjustment?.adjustment || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value > 0) {
                          handleAdjustment(
                            variant.id,
                            currentStock,
                            "increase",
                            value
                          );
                        }
                      }}
                      placeholder="0"
                      className="w-20 text-center"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleAdjustment(
                          variant.id,
                          currentStock,
                          "increase",
                          1
                        )
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleAdjustment(
                            variant.id,
                            currentStock,
                            "decrease",
                            adjustment?.adjustment || 1
                          )
                        }
                        disabled={!adjustment || adjustment.adjustment <= 0}
                      >
                        Remove {adjustment?.adjustment || 0}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          handleAdjustment(
                            variant.id,
                            currentStock,
                            "increase",
                            adjustment?.adjustment || 1
                          )
                        }
                        disabled={!adjustment || adjustment.adjustment <= 0}
                      >
                        Add {adjustment?.adjustment || 0}
                      </Button>
                    </div>
                  </div>

                  {adjustment && adjustment.adjustment > 0 && (
                    <div className="p-2 bg-muted rounded text-sm">
                      <div className="flex justify-between">
                        <span>Current:</span>
                        <span>{currentStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Change:</span>
                        <span
                          className={
                            adjustment.adjustmentType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {adjustment.adjustmentType === "increase" ? "+" : "-"}
                          {adjustment.adjustment}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>New:</span>
                        <span>{newStock}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {adjustments.length} variant{adjustments.length !== 1 ? "s" : ""} to
            update
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleApplyChanges}
              disabled={adjustments.length === 0 || isPending}
            >
              {isPending ? "Updating..." : "Apply Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
