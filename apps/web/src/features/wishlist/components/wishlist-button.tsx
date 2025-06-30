"use client";

import { Product } from "@/features/products/schemas/products.zod";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Heart } from "lucide-react";
import { useWishlistStore } from "../store";

type Props = {
  className?: string;
  product: Product;
};

export function WishlistButton({ className, product }: Props) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleToggle = () => {
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "border-amber-200 hover:border-amber-300 dark:border-amber-700 dark:hover:border-amber-600",
        "hover:bg-amber-50 dark:hover:bg-amber-950/20",
        "transition-all duration-200",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors duration-200",
          isWishlisted
            ? "fill-amber-500 text-amber-500"
            : "text-amber-600 dark:text-amber-400"
        )}
      />
    </Button>
  );
}
