"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { SaveIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { pricingFormSchema } from "../../schemas/forms/pricing-form";
import { useCreateProductStore } from "../../store/create-product-store";
import { setActiveTab, Tabs } from "../../store/helpers";

export function PricingForm() {
  // This used to update base price and status for pricing form
  const ctx = useCreateProductStore((state) => state.pricing);
  const updateCtx = useCreateProductStore((state) => state.setPricing);

  // This used to update variant type pricing
  const inventoryCtx = useCreateProductStore((state) => state.inventory);
  const updateInventoryCtx = useCreateProductStore(
    (state) => state.setInventory
  );

  const hasVariants = inventoryCtx.hasVariants;
  const variantTypes = inventoryCtx.variantTypes;

  const form = useAppForm({
    validators: { onChange: pricingFormSchema },
    defaultValues: {
      basePrice: ctx.basePrice || 0,
      status: ctx.status || "pending"
    },
    onSubmit: ({ value }) => {
      // If has variants, force base price to 0
      const finalValue = hasVariants ? { ...value, basePrice: 0 } : value;
      updateCtx({ ...finalValue, status: "valid" });
      setActiveTab(Tabs.ADDITIONAL);
    }
  });

  // Sync form with store changes
  useEffect(() => {
    // If has variants, set base price to 0 and disable
    if (hasVariants) {
      form.setFieldValue("basePrice", 0);
    } else {
      form.setFieldValue("basePrice", ctx.basePrice);
    }
    form.setFieldValue("status", ctx.status);
  }, [ctx, hasVariants, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleVariantPriceChange = (
    variantName: string,
    valueName: string,
    field: "price" | "comparePrice",
    value: string
  ) => {
    const numericValue = parseFloat(value) || 0;

    updateInventoryCtx({
      ...inventoryCtx,
      variantTypes: inventoryCtx.variantTypes.map((variant) => {
        if (variant.name === variantName) {
          return {
            ...variant,
            values: variant.values.map((variantValue) => {
              if (variantValue.name === valueName) {
                return {
                  ...variantValue,
                  [field]: numericValue
                };
              }
              return variantValue;
            })
          };
        }
        return variant;
      })
    });
  };

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Base Price Section */}
        <div className="space-y-4">
          <form.AppField
            name="basePrice"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Base Price ($)</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                    onBlur={field.handleBlur}
                    placeholder="0.00"
                    disabled={hasVariants}
                  />
                </field.FormControl>
                {hasVariants ? (
                  <field.FormDescription>
                    Base price is disabled because this product has variants.
                    Individual variant prices are managed below.
                  </field.FormDescription>
                ) : (
                  <field.FormDescription>
                    Set the base price for this product.
                  </field.FormDescription>
                )}
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </div>

        {/* Variant Pricing Section */}
        {hasVariants && variantTypes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-md font-medium">Variant Pricing</h3>

            {variantTypes.map((variantType) => (
              <div key={variantType.name} className="space-y-3">
                <h4 className="font-medium text-sm">
                  {variantType.name} Variants
                </h4>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Variant</th>
                        <th className="text-left p-3 font-medium">SKU</th>
                        <th className="text-left p-3 font-medium">Price ($)</th>
                        <th className="text-left p-3 font-medium">
                          Compare Price ($)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantType.values.map((value, index) => (
                        <tr
                          key={value.name}
                          className={index % 2 === 0 ? "bg-muted/25" : ""}
                        >
                          <td className="p-3 font-medium">{value.name}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {value.sku}
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={value.price}
                              onChange={(e) =>
                                handleVariantPriceChange(
                                  variantType.name,
                                  value.name,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="0.00"
                              className="w-full"
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={value.comparePrice}
                              onChange={(e) =>
                                handleVariantPriceChange(
                                  variantType.name,
                                  value.name,
                                  "comparePrice",
                                  e.target.value
                                )
                              }
                              placeholder="0.00"
                              className="w-full"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-muted-foreground">
                  Compare price is optional and typically used to show original
                  price when on sale.
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button type="submit" icon={<SaveIcon />}>
            Save and Continue
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}
