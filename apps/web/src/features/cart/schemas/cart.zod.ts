import { cartItems, carts } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  productSchema,
  productVariantsSchema
} from "../../products/schemas/products.zod";

// Cart Schema
export const cartSchema = createSelectSchema(carts).extend({
  createdAt: z.date().transform((date) => date && date.toISOString()),
  updatedAt: z
    .date()
    .transform((date) => date && date.toISOString())
    .nullable()
});

export type Cart = z.infer<typeof cartSchema>;

// Cart Item with product and variant Schema
export const cartItemSchema = createSelectSchema(cartItems).extend({
  product: productSchema,
  variant: productVariantsSchema.nullable(),
  createdAt: z.date().transform((date) => date && date.toISOString()),
  updatedAt: z
    .date()
    .transform((date) => date && date.toISOString())
    .nullable()
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Cart with Cart Items Schema
export const cartWithItemsSchema = cartSchema.extend({
  items: z.array(cartItemSchema)
});

export type CartWithItems = z.infer<typeof cartWithItemsSchema>;

// Add Cart Item Schema
export const addCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  cartId: true,
  createdAt: true,
  updatedAt: true
});

export type AddCartItemT = z.infer<typeof addCartItemSchema>;

// Update Cart Item Schema
export const updateCartItemSchema = createInsertSchema(cartItems)
  .omit({
    id: true,
    cartId: true,
    productId: true,
    variantId: true,
    totalPrice: true,
    unitPrice: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type UpdateCartItemT = z.infer<typeof updateCartItemSchema>;

// Additional validation schemas for frontend
export const addToCartFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional().nullable(),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
  unitPrice: z.string().min(1, "Unit price is required"),
  totalPrice: z.string().min(1, "Total price is required")
});

export const updateCartItemFormSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1")
});

export type AddToCartFormInput = z.infer<typeof addToCartFormSchema>;
export type UpdateCartItemFormInput = z.infer<typeof updateCartItemFormSchema>;
