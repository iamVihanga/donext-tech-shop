"use client";

import { formatPrice } from "@/components/price";
import { useCart } from "@/features/cart/hooks/use-cart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useOrderTotals } from "../hooks/use-checkout";

interface OrderSummaryCardProps {
  className?: string;
}

export function OrderSummaryCard({ className }: OrderSummaryCardProps) {
  const { cart, isLoading: cartLoading } = useCart();
  const { data: orderTotals, isLoading: totalsLoading } = useOrderTotals();

  const isLoading = cartLoading || totalsLoading;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Separator />
          <Skeleton className="h-6 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!cart?.items?.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No items in cart</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">
                    {item.variant.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-medium">
                {formatPrice(parseFloat(item.totalPrice), "LKR")}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Totals */}
        {orderTotals && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({orderTotals.itemCount} items)</span>
              <span>{formatPrice(orderTotals.subtotal, "LKR")}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {orderTotals.shippingCost === 0
                  ? "Free"
                  : formatPrice(orderTotals.shippingCost, "LKR")}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatPrice(orderTotals.taxAmount, "LKR")}</span>
            </div>

            {orderTotals.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(orderTotals.discountAmount, "LKR")}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(orderTotals.totalAmount, "LKR")}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
