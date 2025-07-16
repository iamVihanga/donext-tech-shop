"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { useForm } from "react-hook-form";

import {
  useCreateBrand,
  useUpdateBrand
} from "@/features/brands/actions/use-brands";
import {
  Brand,
  InsertBrand,
  insertBrandSchema
} from "@/features/brands/schemas/brands.zod";
import { useEffect } from "react";

interface CreateBrandDialogProps {
  brand?: Brand;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBrandDialog({
  brand,
  open,
  onOpenChange
}: CreateBrandDialogProps) {
  const isEditing = !!brand;
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand();

  const form = useForm<InsertBrand>({
    resolver: zodResolver(insertBrandSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      isActive: true
    }
  });

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || "",
        imageUrl: brand.imageUrl || "",
        isActive: brand.isActive
      });
    } else {
      form.reset({
        name: "",
        description: "",
        imageUrl: "",
        isActive: true
      });
    }
  }, [brand, form]);

  const onSubmit = (data: InsertBrand) => {
    if (isEditing) {
      updateBrand(
        { id: brand.id, ...data },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          }
        }
      );
    } else {
      createBrand(data, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        }
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Brand" : "Create New Brand"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the brand information."
                : "Add a new brand to your store."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...form.register("name")}
                placeholder="Brand name"
              />
            </div>
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 col-span-4">
                {form.formState.errors.name.message}
              </p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                {...form.register("description")}
                placeholder="Brand description (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                className="col-span-3"
                {...form.register("imageUrl")}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {form.formState.errors.imageUrl && (
              <p className="text-sm text-red-500 col-span-4">
                {form.formState.errors.imageUrl.message}
              </p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <Switch
                id="isActive"
                checked={form.watch("isActive")}
                onCheckedChange={(checked) =>
                  form.setValue("isActive", checked)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isEditing ? "Update Brand" : "Create Brand"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
