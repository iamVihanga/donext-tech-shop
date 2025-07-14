"use client";

import { useCart } from "@/features/cart/hooks/use-cart";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useCheckout } from "../hooks/use-checkout";
import { AddressForm } from "./address-form";
import { CheckoutItems } from "./checkout-items";
import { OrderSummaryCard } from "./order-summary-card";
import { PaymentMethodSelect } from "./payment-method-select";

export function CheckoutForm() {
  const router = useRouter();
  const { cart, isLoading: cartLoading } = useCart();
  const checkoutMutation = useCheckout();
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  const form = useAppForm({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
      },
      billingAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
      },
      paymentMethod: "card" as const,
      notes: "",
      useShippingAsBilling: true
    },
    onSubmit: async ({ value }) => {
      try {
        await checkoutMutation.mutateAsync(value);
      } catch (error) {
        console.error("Checkout failed:", error);
      }
    }
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  // Update billing address when shipping address changes and checkbox is checked
  const handleUseShippingAsBillingChange = (checked: boolean) => {
    setUseShippingAsBilling(checked);
    form.setFieldValue("useShippingAsBilling", checked);

    if (checked) {
      const shippingAddress = form.getFieldValue("shippingAddress");
      form.setFieldValue("billingAddress", shippingAddress);
    }
  };

  // Sync billing address with shipping when checkbox is checked
  React.useEffect(() => {
    if (useShippingAsBilling) {
      const shippingAddress = form.getFieldValue("shippingAddress");
      form.setFieldValue("billingAddress", shippingAddress);
    }
  }, [form, useShippingAsBilling]);

  // Redirect if cart is empty
  if (!cartLoading && !cart?.items?.length) {
    router.push("/cart");
    return null;
  }

  if (cartLoading) {
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.AppField
                      name="customerName"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Full Name *</field.FormLabel>
                          <field.FormControl>
                            <Input
                              placeholder="John Doe"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />

                    <form.AppField
                      name="customerEmail"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Email Address *</field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  <form.AppField
                    name="customerPhone"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Phone Number</field.FormLabel>
                        <field.FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardContent className="pt-6">
                  <AddressForm
                    form={form}
                    prefix="shippingAddress"
                    title="Shipping Address"
                  />
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useShippingAsBilling"
                        checked={useShippingAsBilling}
                        onCheckedChange={handleUseShippingAsBillingChange}
                      />
                      <Label htmlFor="useShippingAsBilling">
                        Use shipping address as billing address
                      </Label>
                    </div>

                    {!useShippingAsBilling && (
                      <AddressForm
                        form={form}
                        prefix="billingAddress"
                        title="Billing Address"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="pt-6">
                  <PaymentMethodSelect form={form} />
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField
                    name="notes"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>
                          Special Instructions (Optional)
                        </field.FormLabel>
                        <field.FormControl>
                          <Textarea
                            placeholder="Any special instructions for your order..."
                            rows={3}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <CheckoutItems />
                <OrderSummaryCard />

                {/* Place Order Button */}
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={
                        checkoutMutation.isPending || form.state.isSubmitting
                      }
                      loading={
                        checkoutMutation.isPending || form.state.isSubmitting
                      }
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {checkoutMutation.isPending || form.state.isSubmitting
                        ? "Processing..."
                        : "Place Order"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-3">
                      By placing your order, you agree to our terms of service
                      and privacy policy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </form.AppForm>
    </div>
  );
}
