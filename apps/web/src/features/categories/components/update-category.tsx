"use client";
import { useCallback } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Switch } from "@repo/ui/components/switch";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { useGetCategoryById } from "../actions/use-get-category-by-id";
import { useUpdateCategory } from "../actions/use-update-category";
import { updateCategorySchema } from "../schemas/categories.zod";

interface UpdateCategoryProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateCategoryId: string;
}

export function UpdateCategory({
  open,
  setOpen,
  updateCategoryId
}: UpdateCategoryProps) {
  const { mutate, isPending } = useUpdateCategory();
  const { data: category, isLoading } = useGetCategoryById(updateCategoryId);

  const form = useAppForm({
    validators: { onChange: updateCategorySchema },
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      slug: category?.slug || "",
      isActive: category?.isActive || false
    },
    onSubmit: async ({ value }) => {
      mutate(
        { id: updateCategoryId, values: value },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          }
        }
      );
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button icon={<PlusCircleIcon />}>Update Category</Button>
      </DialogTrigger> */}

      <DialogContent className="sm:max-w-[425px]">
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Update Product Category</DialogTitle>
              <DialogDescription>
                Create a new category by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Category Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Electronics"
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
                name="description"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Description</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Enter a brief description of the category"
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
                name="isActive"
                children={(field) => (
                  <field.FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <field.FormLabel>Is Active</field.FormLabel>
                      <field.FormDescription>
                        Toggle to set the category as active or inactive.
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" loading={isPending}>
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
