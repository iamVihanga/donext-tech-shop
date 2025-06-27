import { z } from "zod";
import { formStepStatus } from "./shared";

export const basicInformationsFormSchema = z
  .object({
    name: z.string().min(2).max(100),
    slug: z.string().min(2).max(100),
    shortDescription: z.string().max(200),
    description: z.string().max(1000),
    categoryId: z.string().uuid(),
    subcategoryId: z.string().uuid().or(z.literal("")),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    status: formStepStatus
  })
  // This transform ensures the output type has exactly the types we want
  .transform((data) => ({
    ...data,
    isActive: Boolean(data.isActive),
    isFeatured: Boolean(data.isFeatured),
    status: data.status || "pending"
  }));

export type BasicInformationsFormSchemaT = z.infer<
  typeof basicInformationsFormSchema
>;
