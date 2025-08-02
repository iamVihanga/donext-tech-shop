"use client";

import { formatPrice } from "@/components/price";
import { getProductThumbnail } from "@/lib/helpers";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../hooks/use-cart";

export function CartPage() {
  const {
    cart,
    isLoading,
    removeFromCart,
    updateCartItem,
    getItemCount,
    getTotalPrice,
    isRemovingFromCart,
    isUpdatingCart,
  } = useCart();

  const itemCount = getItemCount();
  const totalPrice = getTotalPrice();

  const handleQuantityChange = (
    itemId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartItem(itemId, { quantity: newQuantity });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>

      {cart?.items?.length === 0 || !cart?.items ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({itemCount})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cart.items.map((item) => {
                    const thumbnail = getProductThumbnail(item.product);

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="relative h-20 w-20 sm:h-16 sm:w-16 rounded-md overflow-hidden bg-muted flex-shrink-0 mx-auto sm:mx-0">
                          {thumbnail && (
                            <Image
                              src={thumbnail}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              className="object-cover h-full w-full"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-base sm:text-lg font-medium text-foreground hover:text-primary block"
                          >
                            {item.product.name}
                          </Link>

                          {item.variant && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Variant: {item.variant.name}
                            </p>
                          )}

                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(parseFloat(item.unitPrice), "LKR")}{" "}
                            each
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                          <div className="flex items-center gap-2 order-2 sm:order-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity, -1)
                              }
                              disabled={isUpdatingCart || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-medium min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity, 1)
                              }
                              disabled={isUpdatingCart}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between w-full sm:w-auto sm:block order-1 sm:order-2">
                            <p className="text-lg font-semibold text-primary">
                              {formatPrice(parseFloat(item.totalPrice), "LKR")}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              disabled={isRemovingFromCart}
                              className="text-muted-foreground hover:text-destructive sm:mt-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items):</span>
                    <span>{formatPrice(totalPrice, "LKR")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatPrice(0, "LKR")}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice, "LKR")}</span>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      asChild
                    >
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
