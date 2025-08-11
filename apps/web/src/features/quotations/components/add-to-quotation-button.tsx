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

  // Check if item is already in quotation
  const existingItem = items.find(
    (item) =>
      item.product.id === product.id &&
      item.variant?.id === (selectedVariant?.id || undefined)
  );

  const handleAddToQuotation = () => {
    addItem(product, selectedVariant, localQuantity);
    toast.success(`${product.name} added to quotation`);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0 || !existingItem) return;
    updateItemQuantity(existingItem.id, newQuantity);
  };

  // If item is already in quotation, show quantity controls
  if (existingItem) {
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
          disabled={disabled}
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
      disabled={!product.isActive || disabled}
      className={cn("text-sm", className)}
    >
      <FileText className="h-4 w-4 mr-1" />
      Add to Quotation
    </Button>
  );
}
