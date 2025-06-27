import { z } from "zod";
import { formStepStatus } from "./shared";

export const imagesFormSchema = z.object({
  images: z.array(
    z.object({
      url: z.string().url(),
      orderIndex: z.number().int().min(0),
      isThumbnail: z.boolean()
    })
  ),
  status: formStepStatus.default("pending")
});

export type ImagesFormSchemaT = z.infer<typeof imagesFormSchema>;
