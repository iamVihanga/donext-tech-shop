"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { PlusIcon, SaveIcon, TrashIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { inventoryFormSchema } from "../../schemas/forms/inventory-form";
import { useCreateProductStore } from "../../store/create-product-store";
import { generateSku, setActiveTab, Tabs } from "../../store/helpers";

export function InventoryForm() {
  const ctx = useCreateProductStore((state) => state.inventory);
  const updateCtx = useCreateProductStore((state) => state.setInventory);
  const productName = useCreateProductStore(
    (state) => state.basicInformation.name
  );

  const [variantTypeName, setVariantTypeName] = useState("");
  const [variantValues, setVariantValues] = useState<string[]>([""]);

  const form = useAppForm({
    validators: { onChange: inventoryFormSchema },
    defaultValues: {
      mainSku: ctx.mainSku || generateSku(productName),
      quantity: ctx.quantity || 0,
      reservedQuantity: ctx.reservedQuantity || 0,
      minStockLevel: ctx.minStockLevel || 0,
      hasVariants: ctx.hasVariants || false,
      variantTypes: ctx.variantTypes || [],
      status: ctx.status || "pending"
    },
    onSubmit: ({ value }) => {
      updateCtx({ ...value, status: "valid" });
      setActiveTab(Tabs.PRICING);
    }
  });

  // Sync form with store changes and auto-generate SKU
  useEffect(() => {
    const mainSku = generateSku(productName);
    form.setFieldValue("mainSku", mainSku);
    form.setFieldValue("quantity", ctx.quantity);
    form.setFieldValue("reservedQuantity", ctx.reservedQuantity);
    form.setFieldValue("minStockLevel", ctx.minStockLevel);
    form.setFieldValue("hasVariants", ctx.hasVariants);
    form.setFieldValue("variantTypes", ctx.variantTypes);
    form.setFieldValue("status", ctx.status);
  }, [ctx, productName, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleVariantsToggle = (hasVariants: boolean) => {
    form.setFieldValue("hasVariants", hasVariants);

    if (!hasVariants) {
      // Clear variants when disabled
      form.setFieldValue("variantTypes", []);
      setVariantTypeName("");
      setVariantValues([""]);

      updateCtx({
        ...form.state.values,
        hasVariants,
        variantTypes: [],
        status: "pending"
      });
    } else {
      updateCtx({
        ...form.state.values,
        hasVariants,
        status: "pending"
      });
    }
  };

  const addVariantValue = () => {
    setVariantValues([...variantValues, ""]);
  };

  const removeVariantValue = (index: number) => {
    const newValues = variantValues.filter((_, i) => i !== index);
    setVariantValues(newValues);
  };

  const updateVariantValue = (index: number, value: string) => {
    const newValues = [...variantValues];
    newValues[index] = value;
    setVariantValues(newValues);
  };

  const addVariantType = () => {
    if (
      !variantTypeName.trim() ||
      variantValues.filter((v) => v.trim()).length === 0
    ) {
      return;
    }

    const validValues = variantValues.filter((v) => v.trim());
    const mainSku = form.getFieldValue("mainSku");

    const variantTypeWithValues = {
      name: variantTypeName.trim(),
      values: validValues.map((value) => ({
        name: value.trim(),
        sku: generateSku(productName, variantTypeName.trim(), value.trim()),
        quantity: 0,
        price: 0,
        comparePrice: 0
      }))
    };

    const updatedVariantTypes = [variantTypeWithValues]; // Max 1 variant type
    form.setFieldValue("variantTypes", updatedVariantTypes);

    updateCtx({
      ...form.state.values,
      variantTypes: updatedVariantTypes,
      status: "pending"
    });

    // Reset form
    setVariantTypeName("");
    setVariantValues([""]);
  };

  const removeVariantType = () => {
    form.setFieldValue("variantTypes", []);
    updateCtx({
      ...form.state.values,
      variantTypes: [],
      status: "pending"
    });
  };

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Inventory Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <form.AppField
              name="mainSku"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Main SKU</field.FormLabel>
                  <field.FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Auto-generated from product name"
                      disabled
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    Automatically generated from product name
                  </field.FormDescription>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
            <form.AppField
              name="reservedQuantity"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Reserved Quantity</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="number"
                      value={field.state.value}
                      disabled
                      placeholder="0"
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    Reserved quantity is managed automatically
                  </field.FormDescription>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField
              name="quantity"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Quantity</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="number"
                      min="0"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(parseInt(e.target.value) || 0)
                      }
                      onBlur={field.handleBlur}
                      placeholder="100"
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="minStockLevel"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Minimum Stock Level</field.FormLabel>
                  <field.FormControl>
                    <Input
                      type="number"
                      min="0"
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(parseInt(e.target.value) || 0)
                      }
                      onBlur={field.handleBlur}
                      placeholder="10"
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </div>
        </div>

        {/* Variants Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Product Variants</h3>
            <form.AppField
              name="hasVariants"
              children={(field) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={handleVariantsToggle}
                  />
                  <Label>Has Variants</Label>
                </div>
              )}
            />
          </div>

          {form.getFieldValue("hasVariants") && (
            <div className="space-y-4 border rounded-lg p-4">
              {/* Existing Variant Type */}
              {ctx.variantTypes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {ctx?.variantTypes[0]?.name}
                    </h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeVariantType}
                      icon={<TrashIcon className="h-4 w-4" />}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    {ctx?.variantTypes[0]?.values.map((value, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded"
                      >
                        <span className="flex-1">{value.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {value.sku}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Variant Type (only if none exists) */}
              {ctx.variantTypes.length === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="variantTypeName">Variant Type Name</Label>
                    <Input
                      id="variantTypeName"
                      value={variantTypeName}
                      onChange={(e) => setVariantTypeName(e.target.value)}
                      placeholder="e.g., Color, Size"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Variant Values</Label>
                    {variantValues.map((value, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={value}
                          onChange={(e) =>
                            updateVariantValue(index, e.target.value)
                          }
                          placeholder="e.g., Red, Blue, Large"
                        />
                        {variantValues.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeVariantValue(index)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariantValue}
                      icon={<PlusIcon className="h-4 w-4" />}
                    >
                      Add Value
                    </Button>
                  </div>

                  <Button
                    type="button"
                    onClick={addVariantType}
                    disabled={
                      !variantTypeName.trim() ||
                      variantValues.filter((v) => v.trim()).length === 0
                    }
                  >
                    Create Variant Type
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button type="submit" icon={<SaveIcon />}>
            Save and Continue
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}
