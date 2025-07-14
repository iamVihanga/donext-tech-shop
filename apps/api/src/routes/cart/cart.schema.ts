import { cartItems, carts } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { productSchema, productVariantsSchema } from "../products/product.zod";

// Cart Schema
export const cartSchema = createSelectSchema(carts);

export type Cart = z.infer<typeof cartSchema>;

// Cart Item with product and variant Schema
export const cartItemSchema = createSelectSchema(cartItems).extend({
  product: productSchema,
  variant: productVariantsSchema.nullable()
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Cart with Cart Items Schema
export const cartWithItemsSchema = cartSchema.extend({
  items: z.array(cartItemSchema)
});

export type CartWithItems = z.infer<typeof cartWithItemsSchema>;

// Create Cart Schema
export const createCartSchema = createInsertSchema(carts).omit({
  id: true,
  updatedAt: true,
  createdAt: true
});

export type CreateCartT = z.infer<typeof createCartSchema>;

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
