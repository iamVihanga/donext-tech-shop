import { z } from "zod";

import { formStepStatus } from "./shared";

export const additionalInfoFormSchema = z.object({
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  requiresShipping: z.boolean().optional(),

  // SEO
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  tags: z.string().max(100).optional(),

  status: formStepStatus.default("pending")
});

export type AdditionalInfoFormSchemaT = z.infer<
  typeof additionalInfoFormSchema
>;
