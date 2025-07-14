import { z } from "zod";
import { formStepStatus } from "./shared";

export const ctxImageSchema = z.object({
  url: z.string().url(),
  orderIndex: z.number().int().min(0),
  isThumbnail: z.boolean()
});

export const imagesFormSchema = z
  .object({
    images: z.array(ctxImageSchema),
    status: formStepStatus
  })
  .refine(
    (data) => {
      if (data.images.length < 1) {
        return false;
      }

      return true;
    },
    {
      message: "You must upload at least one image",
      path: ["images"]
    }
  )
  .refine(
    (data) => {
      // If there are images, at least one must be marked as thumbnail
      if (data.images.length > 0) {
        return data.images.some((img) => img.isThumbnail);
      }
    },
    {
      message: "You must mark at least one image as thumbnail",
      path: ["images"]
    }
  );

export type CtxImageT = z.infer<typeof ctxImageSchema>;

export type ImagesFormSchemaT = z.infer<typeof imagesFormSchema>;
