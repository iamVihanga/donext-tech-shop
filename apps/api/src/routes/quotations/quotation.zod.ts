import { quotationItems, quotations } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ------- Quotation Items ZOD Schemas ----------
export const quotationItemSchema = createSelectSchema(quotationItems);

export type QuotationItem = z.infer<typeof quotationItemSchema>;

export const insertQuotationItemSchema = createInsertSchema(
  quotationItems
).omit({
  id: true,
  quotationId: true,
  createdAt: true,
  updatedAt: true
});

export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;

// ------- Quotation Entity ZOD Schemas ----------
export const quotationSchema = createSelectSchema(quotations).extend({
  items: z.array(quotationItemSchema)
});

export type Quotation = z.infer<typeof quotationSchema>;

export const insertQuotationSchema = createInsertSchema(quotations)
  .extend({
    items: z.array(insertQuotationItemSchema)
  })
  .omit({
    id: true,
    quotationNumber: true, // Auto-generated
    createdAt: true,
    updatedAt: true
  });

export type InsertQuotation = z.infer<typeof insertQuotationSchema>;

export const updateQuotationSchema = createInsertSchema(quotations)
  .extend({
    items: z.array(insertQuotationItemSchema).optional()
  })
  .omit({
    id: true,
    quotationNumber: true, // Cannot be updated
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type UpdateQuotation = z.infer<typeof updateQuotationSchema>;

// Quotation status update schema
export const quotationStatusSchema = z.object({
  status: z.enum(["draft", "pending", "approved", "rejected", "expired"]),
  notes: z.string().optional()
});

export type QuotationStatusUpdate = z.infer<typeof quotationStatusSchema>;

// Quotation customer info schema for non-authenticated users
export const quotationCustomerSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  customerCompany: z.string().optional(),
  customerAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional()
    })
    .optional()
});

export type QuotationCustomer = z.infer<typeof quotationCustomerSchema>;
