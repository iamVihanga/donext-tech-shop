"use client";

import { PlusCircleIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Switch } from "@repo/ui/components/switch";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { useEffect } from "react";
import { useCreateCategory } from "../actions/use-create-category";
import { newCategorySchema } from "../schemas/categories.zod";

interface AddNewCategoryProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  parentId?: string | null;
}

export function AddNewCategory({
  open,
  setOpen,
  parentId
}: AddNewCategoryProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const { mutate, isPending } = useCreateCategory();

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = setOpen || setInternalOpen;

  const form = useAppForm({
    validators: { onChange: newCategorySchema },
    defaultValues: {
      name: "",
      description: "",
      isActive: false
    },
    onSubmit: async ({ value }) => {
      const payload = parentId ? { ...value, parentId } : value;
      mutate(payload, {
        onSuccess: () => {
          handleOpenChange(false);
          form.reset();
        }
      });
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const DialogComponent = (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {parentId
                  ? "Create new Subcategory"
                  : "Create new Product Category"}
              </DialogTitle>
              <DialogDescription>
                {parentId
                  ? "Create a new subcategory under the selected parent category."
                  : "Create a new category by filling out the details below."}
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );

  // If external control is provided, return just the dialog without trigger
  if (open !== undefined) {
    return DialogComponent;
  }

  // If no external control, return with trigger button
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button icon={<PlusCircleIcon />}>Add new Category</Button>
      </DialogTrigger>
      {DialogComponent}
    </Dialog>
  );
}
