import { z } from "zod";
import { formStepStatus } from "./shared";

export const pricingFormSchema = z.object({
  basePrice: z.number(),
  status: formStepStatus
});

export type PricingFormSchemaT = z.infer<typeof pricingFormSchema>;
