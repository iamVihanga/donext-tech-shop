import { z } from "zod";

// Address Schema
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required")
});

export type Address = z.infer<typeof addressSchema>;

// Checkout Schema
export const checkoutSchema = z.object({
  // Customer information
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),

  // Addresses
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(), // If not provided, use shipping address

  // Payment information
  paymentMethod: z.enum(["card", "paypal", "bank_transfer"]),

  // Order notes
  notes: z.string().optional(),

  // UI state
  useShippingAsBilling: z.boolean().default(true)
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Order Summary Schema
export const orderSummarySchema = z.object({
  subtotal: z.number(),
  shippingCost: z.number(),
  taxAmount: z.number(),
  discountAmount: z.number(),
  totalAmount: z.number(),
  itemCount: z.number()
});

export type OrderSummary = z.infer<typeof orderSummarySchema>;
