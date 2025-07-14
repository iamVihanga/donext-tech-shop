import { db } from "@api/db";
import { carts } from "@repo/database";
import { Cart } from "./cart.schema";

export async function selectOrCreateCart(
  userId: string
): Promise<Cart | undefined> {
  // Check if the user already has a cart
  const existingCart = await db.query.carts.findFirst({
    where: (fields, { eq }) => eq(fields.userId, userId)
  });

  // If not exisiting cart, create a new one
  if (!existingCart) {
    const [newCart] = await db
      .insert(carts)
      .values({
        userId: userId
      })
      .returning();

    if (!newCart) return undefined;

    const fullCart = await db.query.carts.findFirst({
      where: (fields, { eq }) => eq(fields.id, newCart.id)
    });

    return fullCart;
  }

  return existingCart;
}
