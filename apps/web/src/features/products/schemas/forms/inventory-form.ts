import { z } from "zod";
import { formStepStatus } from "./shared";

export const inventoryFormSchema = z.object({
  hasVariants: z.boolean(),
  mainSku: z.string(),
  quantity: z.number().min(0),
  reservedQuantity: z.number().min(0),
  minStockLevel: z.number().min(0),
  variantTypes: z.array(
    z.object({
      name: z.string(),
      values: z.array(
        z.object({
          name: z.string(),
          sku: z.string(),
          quantity: z.number().min(0),
          price: z.number().min(0),
          comparePrice: z.number().min(0)
        })
      )
    })
  ),
  status: formStepStatus
});

export type InventoryFormSchemaT = z.infer<typeof inventoryFormSchema>;
