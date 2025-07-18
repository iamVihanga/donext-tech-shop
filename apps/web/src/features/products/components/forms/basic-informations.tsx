import { toKebabCase } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Switch } from "@repo/ui/components/switch";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";
import { SaveIcon } from "lucide-react";
import { useCallback } from "react";
import { basicInformationsFormSchema } from "../../schemas/forms/basic-informations-form";
import { useCreateProductStore } from "../../store/create-product-store";
import { setActiveTab, Tabs } from "../../store/helpers";
import { BrandSelector } from "../brand-selector";

type Props = {};

export function BasicInformationsForm({}: Props) {
  const ctx = useCreateProductStore((state) => state.basicInformation);
  const updateCtx = useCreateProductStore((state) => state.setBasicInformation);

  const form = useAppForm({
    validators: { onChange: basicInformationsFormSchema },
    defaultValues: {
      name: ctx.name || "",
      slug: ctx.slug || "",
      shortDescription: ctx.shortDescription || "",
      description: ctx.description || "",
      brandId: ctx.brandId || "",
      isActive: ctx.isActive ? ctx.isActive : false,
      isFeatured: ctx.isFeatured ? ctx.isFeatured : false,
      status: ctx.status || "pending"
    },
    onSubmit: ({ value }) => {
      updateCtx({ ...value, status: "valid" });
      setActiveTab(Tabs.CATEGORIES);
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

  const onNameChange = (value: string) => {
    const generatedSlug = toKebabCase(value);
    form.setFieldValue("slug", generatedSlug);
  };

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-6">
        <form.AppField
          name="name"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Product Name</field.FormLabel>
              <field.FormControl>
                <Input
                  placeholder="MSI Gaming Laptop"
                  value={field.state.value}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                    field.handleChange(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <form.AppField
            name="slug"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Product Slug</field.FormLabel>
                <field.FormControl>
                  <Input
                    placeholder="msi-gaming-laptop"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <form.AppField
            name="shortDescription"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Short Description</field.FormLabel>
                <field.FormControl>
                  <Input
                    placeholder="A high-performance laptop"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </div>

        <form.AppField
          name="description"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Product Description</field.FormLabel>
              <field.FormControl>
                <Textarea
                  placeholder="Detailed description of the product"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        />

        <form.AppField
          name="brandId"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Brand *</field.FormLabel>
              <field.FormControl>
                <BrandSelector
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  placeholder="Select a brand..."
                  required={true}
                />
              </field.FormControl>
              <field.FormDescription>
                Choose the brand for this product.
              </field.FormDescription>
              <field.FormMessage />
            </field.FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <form.AppField
            name="isActive"
            children={(field) => (
              <field.FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <field.FormLabel>Is Active</field.FormLabel>
                  <field.FormDescription>
                    Toggle to set the product as active or inactive.
                  </field.FormDescription>
                </div>

                <field.FormControl>
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-readonly
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="isFeatured"
            children={(field) => (
              <field.FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <field.FormLabel>Is Featured</field.FormLabel>
                  <field.FormDescription>
                    Toggle to set the product as featured or not featured
                  </field.FormDescription>
                </div>

                <field.FormControl>
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    aria-readonly
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Button icon={<SaveIcon />}>Save and Continue</Button>
        </div>
      </form>
    </form.AppForm>
  );
}
