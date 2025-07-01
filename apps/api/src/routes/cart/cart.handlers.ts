import { desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { cartItems, carts } from "@repo/database/schemas";

import { selectOrCreateCart } from "./cart.helpers";
import type {
  AddCartItemRoute,
  DeleteCartItemByIdRoute,
  GetCartItemByIdRoute,
  GetUserCartRoute,
  ListRoute,
  UpdateCartItemByIdRoute
} from "./cart.routes";

/**
 * List all Products with paginations
 */
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.get("user");
  const { page = "1", limit = "10", sort = "asc" } = c.req.valid("query");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      { message: "Forbidden: Admins only can access this route" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.carts.findMany({
    with: { items: { with: { product: true, variant: true } } },
    limit: limitNum,
    offset,
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }

      return desc(fields.createdAt);
    }
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(carts);

  const [cartsEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: cartsEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};

/**
 * Get user Cart
 */
export const getUserCart: AppRouteHandler<GetUserCartRoute> = async (c) => {
  const user = c.get("user");

  if (!user)
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );

  const userCart = await selectOrCreateCart(user.id);

  if (!userCart) {
    return c.json(
      { message: "Cannot initialize user's cart" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const cartData = await db.query.carts.findFirst({
    where: (fields, { eq }) => eq(fields.id, userCart.id),
    with: { items: { with: { product: true, variant: true } } }
  });

  return c.json(cartData, HttpStatusCodes.OK);
};

/**
 * Add new item to user's cart
 */
export const addCartItem: AppRouteHandler<AddCartItemRoute> = async (c) => {
  const user = c.get("user");
  const body = c.req.valid("json");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const userCart = await selectOrCreateCart(user.id);

  if (!userCart) {
    return c.json(
      { message: "Cannot initialize user's cart" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const [createdCartItem] = await db
    .insert(cartItems)
    .values({ ...body, cartId: userCart.id })
    .returning();

  if (!createdCartItem) {
    return c.json(
      { message: "Cart item creation failed" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const fullCartItem = await db.query.cartItems.findFirst({
    where: (fields, { eq }) => eq(fields.id, createdCartItem.id),
    with: { product: { with: { images: true, variants: true } }, variant: true }
  });

  if (!fullCartItem) {
    return c.json(
      { message: "Failed to fetch full cart" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(fullCartItem, HttpStatusCodes.OK);
};

/**
 * Get cart item by ID
 */
export const getCartItemById: AppRouteHandler<GetCartItemByIdRoute> = async (
  c
) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session || !session.userId) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const userCart = selectOrCreateCart(session.userId);

  if (!userCart) {
    return c.json(
      { message: "Cannot initialize user's cart" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const cartItem = await db.query.cartItems.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
    with: { product: { with: { images: true, variants: true } }, variant: true }
  });

  return c.json(cartItem, HttpStatusCodes.OK);
};

/**
 * Update cart item by ID
 */
export const updateCartItemById: AppRouteHandler<
  UpdateCartItemByIdRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session || !session.userId) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const userCart = await selectOrCreateCart(session.userId);

  if (!userCart) {
    return c.json(
      { message: "Cannot initialize user's cart" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const [updatedCartItem] = await db
    .update(cartItems)
    .set(body)
    .where(eq(cartItems.id, id))
    .returning();

  if (!updatedCartItem) {
    return c.json(
      { message: "Cart item update failed" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const completeCartItem = await db.query.cartItems.findFirst({
    where: (fields, { eq }) => eq(fields.id, updatedCartItem.id),
    with: { product: { with: { images: true, variants: true } }, variant: true }
  });

  return c.json(completeCartItem, HttpStatusCodes.OK);
};

/**
 * Delete cart item by ID
 */
export const deleteCartItemById: AppRouteHandler<
  DeleteCartItemByIdRoute
> = async (c) => {
  const session = c.get("session");
  const { id } = c.req.valid("param");

  if (!session || !session.userId) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const userCart = await selectOrCreateCart(session.userId);

  if (!userCart) {
    return c.json(
      { message: "Cannot initialize user's cart" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  await db.delete(cartItems).where(eq(cartItems.id, id));

  return c.json(
    { message: "Cart item deleted successfully" },
    HttpStatusCodes.OK
  );
};
