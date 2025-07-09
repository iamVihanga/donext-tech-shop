"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { useUpdateProductStock } from "@/features/products/actions/use-update-product-stock";
import { Product } from "@/features/products/schemas/products.zod";

interface StockAdjustmentDialogProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  product,
  open,
  onClose
}) => {
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">(
    "increase"
  );
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const { mutate: updateStock, isPending } = useUpdateProductStock();

  const currentStock = product.stockQuantity || 0;
  const newStock =
    adjustmentType === "increase"
      ? currentStock + (parseInt(quantity) || 0)
      : Math.max(0, currentStock - (parseInt(quantity) || 0));

  const handleSubmit = () => {
    if (!quantity || parseInt(quantity) <= 0) return;

    updateStock(
      {
        productId: product.id,
        adjustmentType,
        quantity: parseInt(quantity),
        reason:
          reason ||
          `${adjustmentType === "increase" ? "Increased" : "Decreased"} stock by ${quantity}`
      },
      {
        onSuccess: () => {
          onClose();
          setQuantity("");
          setReason("");
          setAdjustmentType("increase");
        }
      }
    );
  };

  const handleClose = () => {
    onClose();
    setQuantity("");
    setReason("");
    setAdjustmentType("increase");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {product.name}</DialogTitle>
          <DialogDescription>
            Modify the stock quantity for this product. Current stock:{" "}
            <Badge variant="outline">{currentStock} units</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adjustment-type">Adjustment Type</Label>
            <Select
              value={adjustmentType}
              onValueChange={(value: "increase" | "decrease") =>
                setAdjustmentType(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-600" />
                    Increase Stock
                  </div>
                </SelectItem>
                <SelectItem value="decrease">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-red-600" />
                    Decrease Stock
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity to adjust"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for stock adjustment..."
              rows={3}
            />
          </div>

          {quantity && parseInt(quantity) > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Current Stock:</span>
                  <Badge variant="outline">{currentStock}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Adjustment:</span>
                  <Badge
                    variant={
                      adjustmentType === "increase" ? "default" : "destructive"
                    }
                  >
                    {adjustmentType === "increase" ? "+" : "-"}
                    {quantity}
                  </Badge>
                </div>
                <div className="flex justify-between font-medium">
                  <span>New Stock:</span>
                  <Badge variant="secondary">{newStock}</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!quantity || parseInt(quantity) <= 0 || isPending}
          >
            {isPending ? "Updating..." : "Update Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
