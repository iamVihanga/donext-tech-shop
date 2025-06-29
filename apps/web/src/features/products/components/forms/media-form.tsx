"use client";

import { useCreateProductStore } from "@/features/products/store/create-product-store";
import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { CheckIcon, PlusIcon, SaveIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { imagesFormSchema } from "../../schemas/forms/images-form";
import { setActiveTab, Tabs } from "../../store/helpers";

export function MediaForm() {
  const [showGallery, setShowGallery] = useState(false);
  const ctx = useCreateProductStore((state) => state.media);
  const updateCtx = useCreateProductStore((state) => state.setMedia);

  const form = useAppForm({
    validators: {
      onChange: imagesFormSchema
    },
    defaultValues: {
      images: ctx.images || [],
      status: ctx.status || "pending"
    },
    onSubmit: ({ value }) => {
      updateCtx({ ...value, status: "valid" });
      setActiveTab(Tabs.INVENTORY);
    }
  });

  // Sync form with store changes
  useEffect(() => {
    form.setFieldValue("images", ctx.images);
    form.setFieldValue("status", ctx.status);
  }, [ctx.images, ctx.status, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleMakeAsThumbnail = useCallback(
    (targetIndex: number) => {
      const updatedImages = ctx.images.map((img, index) => ({
        ...img,
        isThumbnail: index === targetIndex
      }));

      updateCtx({
        images: updatedImages,
        status: "pending"
      });
    },
    [ctx.images, updateCtx]
  );

  const handleRemoveImage = useCallback(
    (targetIndex: number) => {
      const updatedImages = ctx.images.filter(
        (_, index) => index !== targetIndex
      );

      updateCtx({
        images: updatedImages,
        status: "pending"
      });
    },
    [ctx.images, updateCtx]
  );

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="space-y-6">
        {showGallery && (
          <GalleryView
            modal={true}
            activeTab="library"
            onUseSelected={(selectedFiles) => {
              const hasExistingThumbnail = ctx.images.some(
                (img) => img.isThumbnail
              );

              const newImages = selectedFiles.map((file, index) => ({
                url: file.url,
                orderIndex: ctx.images.length + index,
                // Make first image as thumbnail if no existing thumbnail
                isThumbnail: !hasExistingThumbnail && index === 0
              }));

              const updatedImages = [...ctx.images, ...newImages];

              updateCtx({
                images: updatedImages,
                status: "pending"
              });

              setShowGallery(false);
            }}
            modalOpen={showGallery}
            setModalOpen={setShowGallery}
          />
        )}

        <form.AppField
          name="images"
          children={(field) => (
            <field.FormItem>
              <field.FormControl>
                <div className="grid grid-cols-4 gap-3">
                  <Card
                    onClick={() => setShowGallery(true)}
                    className="w-full group aspect-square p-0 flex items-center justify-center hover:border-card-foreground/40 transition-all ease-in-out cursor-pointer"
                  >
                    <div className="flex flex-col gap-3 items-center justify-center">
                      <PlusIcon
                        strokeWidth={0.5}
                        className="size-18 text-card-foreground/90"
                      />
                      <div className="text-sm text-foreground/60">
                        Add new Images
                      </div>
                    </div>
                  </Card>

                  {ctx.images.length > 0 &&
                    ctx.images.map((image, index) => {
                      const isThumbnail = image.isThumbnail;

                      return (
                        <div
                          key={index}
                          className={`group w-full aspect-square rounded-md relative overflow-hidden`}
                        >
                          {!isThumbnail ? (
                            <div className="group-hover:flex hidden absolute top-1 left-1 z-10">
                              <Button
                                type="button"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleMakeAsThumbnail(index)}
                              >
                                Mark as Thumbnail
                              </Button>
                            </div>
                          ) : (
                            <div className="absolute top-1 left-1 z-10">
                              <Button
                                type="button"
                                size="sm"
                                className="text-xs"
                                icon={
                                  <div className="flex items-center justify-center p-1 rounded-full bg-primary-foreground">
                                    <CheckIcon className="size-2 text-primary" />
                                  </div>
                                }
                              >
                                Thumbnail
                              </Button>
                            </div>
                          )}

                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="hidden group-hover:flex absolute top-1 right-1 z-10 size-8"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ×
                          </Button>

                          <Image
                            src={image.url}
                            alt={`Image ${index}`}
                            width={300}
                            height={300}
                            className={`w-full h-full group-hover:scale-105 transition-transform duration-200 ease-in-out object-cover rounded-md`}
                          />
                        </div>
                      );
                    })}
                </div>
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        />

        <div className="mt-5 flex items-center justify-between">
          <Button type="submit" icon={<SaveIcon />}>
            Save and Continue
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}
