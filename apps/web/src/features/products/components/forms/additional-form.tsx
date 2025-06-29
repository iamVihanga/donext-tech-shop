"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Switch } from "@repo/ui/components/switch";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";
import { SaveIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { additionalInfoFormSchema } from "../../schemas/forms/additional-info-form";
import { useCreateProductStore } from "../../store/create-product-store";
import { setActiveTab, Tabs } from "../../store/helpers";

export function AdditionalInfoForm() {
  const ctx = useCreateProductStore((state) => state.additional);
  const updateCtx = useCreateProductStore((state) => state.setAdditional);

  const form = useAppForm({
    validators: { onChange: additionalInfoFormSchema },
    defaultValues: {
      weight: ctx.weight || 0,
      dimensions: ctx.dimensions || "",
      requiresShipping: ctx.requiresShipping || false,
      metaTitle: ctx.metaTitle || "",
      metaDescription: ctx.metaDescription || "",
      tags: ctx.tags || "",
      status: ctx.status || "pending"
    },
    onSubmit: ({ value }) => {
      updateCtx({ ...value, status: "valid" });
      setActiveTab(Tabs.SUMMARY);
    }
  });

  // Sync form with store changes
  useEffect(() => {
    form.setFieldValue("weight", ctx.weight);
    form.setFieldValue("dimensions", ctx.dimensions);
    form.setFieldValue("requiresShipping", ctx.requiresShipping);
    form.setFieldValue("metaTitle", ctx.metaTitle);
    form.setFieldValue("metaDescription", ctx.metaDescription);
    form.setFieldValue("tags", ctx.tags);
    form.setFieldValue("status", ctx.status);
  }, [ctx, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Section */}
        <div className="space-y-4">
          <h3 className="text-md font-medium">Shipping Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <form.AppField
              name="weight"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Weight (kg)</field.FormLabel>
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
                      placeholder="0.5"
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    Product weight in kilograms
                  </field.FormDescription>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            <form.AppField
              name="dimensions"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Dimensions</field.FormLabel>
                  <field.FormControl>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="20 x 15 x 10 cm"
                    />
                  </field.FormControl>
                  <field.FormDescription>
                    Product dimensions (L x W x H)
                  </field.FormDescription>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </div>

          <form.AppField
            name="requiresShipping"
            children={(field) => (
              <field.FormItem>
                <div className="flex items-center space-x-2">
                  <field.FormControl>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                    />
                  </field.FormControl>
                  <Label>Requires Shipping</Label>
                </div>
                <field.FormDescription>
                  Enable if this product needs to be shipped to customers
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />

        {/* SEO Section */}
        <div className="space-y-4">
          <h3 className="text-md font-medium">SEO Information</h3>

          <form.AppField
            name="metaTitle"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Meta Title</field.FormLabel>
                <field.FormControl>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="SEO-friendly title for search engines"
                    maxLength={60}
                  />
                </field.FormControl>
                <field.FormDescription>
                  {field.state.value?.length || 0}/60 characters. This appears
                  in search engine results.
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <form.AppField
            name="metaDescription"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Meta Description</field.FormLabel>
                <field.FormControl>
                  <Textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Brief description that appears in search results"
                    maxLength={160}
                    rows={3}
                  />
                </field.FormControl>
                <field.FormDescription>
                  {field.state.value?.length || 0}/160 characters. This appears
                  below the title in search results.
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <form.AppField
            name="tags"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Tags</field.FormLabel>
                <field.FormControl>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="electronics, smartphone, apple, ios"
                    maxLength={100}
                  />
                </field.FormControl>
                <field.FormDescription>
                  {field.state.value?.length || 0}/100 characters.
                  Comma-separated tags for better categorization.
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
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
