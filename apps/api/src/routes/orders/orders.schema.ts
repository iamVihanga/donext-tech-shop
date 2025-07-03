import { orderItems, orders, orderStatusHistory } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { productSchema, productVariantsSchema } from "../products/product.zod";

// Order Schema
export const orderSchema = createSelectSchema(orders);
export type Order = z.infer<typeof orderSchema>;

// Order Item Schema
export const orderItemSchema = createSelectSchema(orderItems).extend({
  product: productSchema,
  variant: productVariantsSchema.nullable()
});
export type OrderItem = z.infer<typeof orderItemSchema>;

// Order with Items Schema
export const orderWithItemsSchema = orderSchema.extend({
  items: z.array(orderItemSchema),
  statusHistory: z.array(createSelectSchema(orderStatusHistory)).optional()
});
export type OrderWithItems = z.infer<typeof orderWithItemsSchema>;

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
  notes: z.string().optional()
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Create Order Schema
export const createOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
  shippedAt: true,
  deliveredAt: true,
  cancelledAt: true
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Create Order Item Schema
export const createOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  orderId: true,
  createdAt: true,
  updatedAt: true
});

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;

// Update Order Status Schema
export const updateOrderStatusSchema = z.object({
  orderStatus: z
    .enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded"
    ])
    .optional(),
  paymentStatus: z
    .enum(["pending", "paid", "failed", "refunded", "partially_refunded"])
    .optional(),
  trackingNumber: z.string().optional(),
  carrierName: z.string().optional(),
  notes: z.string().optional()
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Order Summary Schema (for cart totals calculation)
export const orderSummarySchema = z.object({
  subtotal: z.number(),
  shippingCost: z.number(),
  taxAmount: z.number(),
  discountAmount: z.number(),
  totalAmount: z.number(),
  itemCount: z.number()
});

export type OrderSummary = z.infer<typeof orderSummarySchema>;
