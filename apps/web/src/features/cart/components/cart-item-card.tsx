"use client";

import { formatPrice } from "@/components/price";
import { getProductThumbnail, getStockStatus } from "@/lib/helpers";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { AlertTriangle, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "../schemas/cart.zod";

interface Props {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isLoading?: boolean;
  showStock?: boolean;
  className?: string;
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  isLoading = false,
  showStock = true,
  className
}: Props) {
  const thumbnail = getProductThumbnail(item.product);
  const stockStatus = getStockStatus(item.product);

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 border rounded-lg ${className}`}
    >
      {/* Product Image */}
      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.id}`}
          className="text-lg font-medium text-foreground hover:text-primary block"
        >
          {item.product.name}
        </Link>

        {item.variant && (
          <p className="text-sm text-muted-foreground mt-1">
            Variant: {item.variant.name}
          </p>
        )}

        <p className="text-sm text-muted-foreground mt-1">
          {formatPrice(parseFloat(item.unitPrice), "LKR")} each
        </p>

        {/* Stock Status */}
        {showStock && (
          <div className="flex items-center gap-2 mt-2">
            {stockStatus === "out-of-stock" && (
              <>
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              </>
            )}
            {stockStatus === "low" && (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <Badge
                  variant="outline"
                  className="text-xs border-yellow-500 text-yellow-500"
                >
                  Low Stock
                </Badge>
              </>
            )}
            {stockStatus === "in-stock" && (
              <Badge variant="secondary" className="text-xs">
                In Stock
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={isLoading || item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-12 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={isLoading || stockStatus === "out-of-stock"}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-lg font-semibold text-primary">
            {formatPrice(parseFloat(item.totalPrice), "LKR")}
          </p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id)}
          disabled={isLoading}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
