import { z } from "zod";

import { formStepStatus } from "./shared";

export const additionalInfoFormSchema = z.object({
  weight: z.number(),
  dimensions: z.string(),
  requiresShipping: z.boolean(),

  // SEO
  metaTitle: z.string().max(60),
  metaDescription: z.string().max(160),
  tags: z.string().max(100),

  status: formStepStatus
});

export type AdditionalInfoFormSchemaT = z.infer<
  typeof additionalInfoFormSchema
>;
