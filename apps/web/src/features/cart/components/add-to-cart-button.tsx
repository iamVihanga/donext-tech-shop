"use client";

import { Product } from "@/features/products/schemas/products.zod";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../hooks/use-cart";
import type { AddCartItemT } from "../schemas/cart.zod";

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

export function AddToCartButton({
  product,
  variantId = null,
  className,
  variant = "default",
  size = "default",
  disabled = false
}: Props) {
  const {
    addToCart,
    updateCartItem,
    isAddingToCart,
    isUpdatingCart,
    isInCart,
    getCartItemQuantity
  } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);
  const session = authClient.useSession();
  const router = useRouter();

  const inCart = isInCart(product.id, variantId);
  const currentQuantity = getCartItemQuantity(product.id, variantId);

  // Check if product is out of stock
  const isOutOfStock = !product.stockQuantity || product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    // Check if product is out of stock
    if (isOutOfStock) {
      toast.error("This product is out of stock and cannot be added to cart.");
      return;
    }

    if (!session.data || session.error) {
      // Redirect to sign-in if not authenticated
      router.push("/signin");
      return;
    }

    const price = variantId
      ? product.variants?.find((v) => v.id === variantId)?.price ||
        product.price
      : product.price;

    const cartItem: AddCartItemT = {
      productId: product.id,
      variantId,
      quantity: localQuantity,
      unitPrice: price,
      totalPrice: (parseFloat(price) * localQuantity).toString()
    };

    await addToCart(cartItem);
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity <= 0) return;

    // Check stock when increasing quantity
    if (newQuantity > currentQuantity && isOutOfStock) {
      toast.error("This product is out of stock.");
      return;
    }

    const cartItem = product.variants?.find((v) => v.id === variantId);
    if (!cartItem) return;

    await updateCartItem(cartItem.id, { quantity: newQuantity });
  };

  const isLoading = isAddingToCart || isUpdatingCart;

  if (inCart) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(currentQuantity - 1)}
          disabled={isLoading || currentQuantity <= 1 || disabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-8 text-center font-medium">
          {currentQuantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleUpdateQuantity(currentQuantity + 1)}
          disabled={isLoading || disabled || isOutOfStock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isLoading || !product.isActive || disabled || isOutOfStock}
      className={className}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isOutOfStock
        ? "Out of Stock"
        : isLoading
        ? "Adding..."
        : "Add to Cart"}
    </Button>
  );
}
