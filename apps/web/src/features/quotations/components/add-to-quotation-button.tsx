"use client";

import { Product } from "@/features/products/schemas/products.zod";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { FileText, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuotationStore } from "../store/quotation-store";

interface Props {
  product: Product;
  variantId?: string | null;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
    | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function AddToQuotationButton({
  product,
  variantId = null,
  className,
  variant = "default",
  size = "default",
  disabled = false
}: Props) {
  const { items, addItem, updateItemQuantity } = useQuotationStore();
  const [localQuantity, setLocalQuantity] = useState(1);

  // Find selected variant
  const selectedVariant = variantId
    ? product.variants?.find((v) => v.id === variantId)
    : undefined;

  // Check stock availability
  const isOutOfStock = selectedVariant
    ? (selectedVariant.stockQuantity ?? 0) <= 0
    : (product.stockQuantity ?? 0) <= 0;

  // Check if item is already in quotation
  const existingItem = items.find(
    (item) =>
      item.product.id === product.id &&
      item.variant?.id === (selectedVariant?.id || undefined)
  );

  const handleAddToQuotation = () => {
    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    addItem(product, selectedVariant, localQuantity);
    toast.success(`${product.name} added to quotation`);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0 || !existingItem) return;

    // Check if new quantity exceeds available stock
    const availableStock = selectedVariant
      ? (selectedVariant.stockQuantity ?? 0)
      : (product.stockQuantity ?? 0);

    if (newQuantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    updateItemQuantity(existingItem.id, newQuantity);
  };

  // If item is already in quotation, show quantity controls
  if (existingItem) {
    const availableStock = selectedVariant
      ? (selectedVariant.stockQuantity ?? 0)
      : (product.stockQuantity ?? 0);

    const isAtMaxStock = existingItem.quantity >= availableStock;

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(existingItem.quantity - 1)}
          disabled={existingItem.quantity <= 1 || disabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-8 text-center font-medium">
          {existingItem.quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(existingItem.quantity + 1)}
          disabled={disabled || isAtMaxStock}
          title={
            isAtMaxStock ? `Only ${availableStock} items available` : undefined
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Show add to quotation button
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToQuotation}
      disabled={!product.isActive || disabled || isOutOfStock}
      className={cn("text-sm", className)}
      title={isOutOfStock ? "Product is out of stock" : undefined}
    >
      <FileText className="h-4 w-4 mr-1" />
      {isOutOfStock ? "Out of Stock" : "Add to Quotation"}
    </Button>
  );
}
