"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { cn } from "@repo/ui/lib/utils";
import { Building2 } from "lucide-react";

interface PaymentMethodSelectProps {
  form: any; // TanStack Form instance
  className?: string;
}

const PAYMENT_METHODS = [
  // {
  //   value: "card" as const,
  //   label: "Credit/Debit Card",
  //   description: "Pay securely with your card",
  //   icon: CreditCard
  // },
  // {
  //   value: "paypal" as const,
  //   label: "PayPal",
  //   description: "Pay with your PayPal account",
  //   icon: DollarSign
  // },
  {
    value: "bank_transfer" as const,
    label: "Bank Transfer",
    description: "Direct bank transfer",
    icon: Building2
  }
];

export function PaymentMethodSelect({
  form,
  className
}: PaymentMethodSelectProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

      <form.AppField
        name="paymentMethod"
        children={(field: any) => (
          <field.FormItem>
            <field.FormControl>
              <RadioGroup
                onValueChange={field.handleChange}
                value={field.state.value}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div key={method.value}>
                        <Label htmlFor={method.value}>
                          <Card
                            className={cn(
                              "h-full cursor-pointer transition-all hover:bg-muted/50 border-2",
                              field.state.value === method.value
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem
                                  value={method.value}
                                  id={method.value}
                                />
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {method.label}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {method.description}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </field.FormControl>
            <field.FormMessage />
          </field.FormItem>
        )}
      />
    </div>
  );
}
