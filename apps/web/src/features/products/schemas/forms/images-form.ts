import { z } from "zod";
import { formStepStatus } from "./shared";

export const ctxImageSchema = z.object({
  url: z.string().url(),
  orderIndex: z.number().int().min(0),
  isThumbnail: z.boolean()
});

export const imagesFormSchema = z.object({
  images: z.array(ctxImageSchema),
  status: formStepStatus.default("pending")
});

export type CtxImageT = z.infer<typeof ctxImageSchema>;

export type ImagesFormSchemaT = z.infer<typeof imagesFormSchema>;
