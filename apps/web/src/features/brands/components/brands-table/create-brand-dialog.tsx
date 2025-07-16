"use client";

import { ImageIcon, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { Textarea } from "@repo/ui/components/textarea";

import {
  useCreateBrand,
  useUpdateBrand
} from "@/features/brands/actions/use-brands";
import { Brand, insertBrandSchema } from "@/features/brands/schemas/brands.zod";
import GalleryView from "@/modules/media/components/gallery-view";
import { Media } from "@/modules/media/types";

interface CreateBrandDialogProps {
  brand?: Brand;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateBrandDialog({
  brand,
  open,
  onOpenChange
}: CreateBrandDialogProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  const isEditing = !!brand;
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand();

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;
  const form = useAppForm({
    validators: { onChange: insertBrandSchema },
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      isActive: true
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        imageUrl: selectedImageUrl || value.imageUrl
      };

      if (isEditing) {
        updateBrand(
          { id: brand.id, ...payload },
          {
            onSuccess: () => {
              handleOpenChange(false);
              form.reset();
              setSelectedImageUrl("");
            }
          }
        );
      } else {
        createBrand(payload, {
          onSuccess: () => {
            handleOpenChange(false);
            form.reset();
            setSelectedImageUrl("");
          }
        });
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

  // Reset form when dialog closes or brand changes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSelectedImageUrl("");
    } else if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || "",
        imageUrl: brand.imageUrl || "",
        isActive: brand.isActive || false
      });
      setSelectedImageUrl(brand.imageUrl || "");
    } else {
      form.reset({
        name: "",
        description: "",
        imageUrl: "",
        isActive: true
      });
      setSelectedImageUrl("");
    }
  }, [isOpen, brand, form]);

  const handleClose = () => {
    handleOpenChange(false);
    form.reset();
    setSelectedImageUrl("");
  };

  const handleImageSelect = (selectedFiles: Media[]) => {
    if (selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      if (selectedFile) {
        setSelectedImageUrl(selectedFile.url);
        form.setFieldValue("imageUrl", selectedFile.url);
      }
    }
    setShowGallery(false);
  };

  const handleRemoveImage = () => {
    setSelectedImageUrl("");
    form.setFieldValue("imageUrl", "");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Brand" : "Create Brand"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edit the brand information below."
                : "Create a new brand by filling out the form below."}
            </DialogDescription>
          </DialogHeader>

          <form.AppForm>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Name</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="Enter brand name"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isCreating || isUpdating}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <form.AppField
                  name="description"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Description</field.FormLabel>
                      <field.FormControl>
                        <Textarea
                          placeholder="Enter brand description"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isCreating || isUpdating}
                          rows={3}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Brand Image</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGallery(true)}
                    disabled={isCreating || isUpdating}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Choose from Gallery
                  </Button>
                  {selectedImageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={isCreating || isUpdating}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>

                {selectedImageUrl && (
                  <div className="mt-2">
                    <img
                      src={selectedImageUrl}
                      alt="Brand preview"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <form.AppField
                  name="isActive"
                  children={(field) => (
                    <field.FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <field.FormLabel>Is Active</field.FormLabel>
                        <field.FormDescription>
                          Toggle to set the brand as active or inactive.
                        </field.FormDescription>
                      </div>
                      <field.FormControl>
                        <Checkbox
                          checked={field.state.value}
                          onCheckedChange={(checked: boolean) =>
                            field.handleChange(checked)
                          }
                          disabled={isCreating || isUpdating}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditing ? "Update Brand" : "Create Brand"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </form.AppForm>
        </DialogContent>
      </Dialog>

      {showGallery && (
        <GalleryView
          modal
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
          onUseSelected={handleImageSelect}
          activeTab="library"
        />
      )}
    </>
  );
}
