"use client";
import { PlusCircleIcon } from "lucide-react";
import React, { useCallback, useState } from "react";

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

import { useCreateSubcategory } from "../actions/use-create-subcategory";
import { newSubcategorySchema } from "../schemas/categories.zod";

interface AddNewSubcategoryProps {
  parentId: string;
  trigger?: React.ReactNode;
}

export function AddNewSubcategory({
  parentId,
  trigger
}: AddNewSubcategoryProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending } = useCreateSubcategory();

  const form = useAppForm({
    validators: { onChange: newSubcategorySchema },
    defaultValues: {
      name: "",
      description: "",
      isActive: false
    },
    onSubmit: async ({ value }) => {
      mutate(
        { parentId, ...value },
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
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button icon={<PlusCircleIcon />}>Add new Subcategory</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create new Subcategory</DialogTitle>
              <DialogDescription>
                Create a new subcategory by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Subcategory Name</field.FormLabel>
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
}
