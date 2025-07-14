"use client";

import { formatPrice } from "@/components/price";
import { useCart } from "@/features/cart/hooks/use-cart";
import { getProductThumbnail } from "@/lib/helpers";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import Image from "next/image";

interface CheckoutItemsProps {
  className?: string;
}

export function CheckoutItems({ className }: CheckoutItemsProps) {
  const { cart, isLoading } = useCart();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-16 w-16 bg-muted rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cart?.items?.length) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Items</span>
          <Badge variant="secondary">{cart.items.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cart.items.map((item, index) => {
            const thumbnail = getProductThumbnail(item.product);

            return (
              <div key={item.id}>
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                    <h4 className="font-medium text-sm truncate">
                      {item.product.name}
                    </h4>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">
                        Variant: {item.variant.name}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatPrice(parseFloat(item.unitPrice), "LKR")} each
                      </span>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="text-sm font-medium">
                    {formatPrice(parseFloat(item.totalPrice), "LKR")}
                  </div>
                </div>

                {/* Separator (except for last item) */}
                {index < cart.items.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
