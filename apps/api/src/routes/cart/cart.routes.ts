import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@api/lib/helpers";
import {
  addCartItemSchema,
  cartItemSchema,
  cartWithItemsSchema,
  updateCartItemSchema
} from "./cart.schema";

const tags: string[] = ["Shopping Cart"];

/**
 * Get all Carts
 * - Used by Admin Routes to Manage and List every cart in the system
 */
export const list = createRoute({
  tags,
  summary: "List all carts",
  path: "/all",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(cartWithItemsSchema)),
      "The list of all carts (Populated with cart items)"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden: Admins only can access this route"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Get user Cart
 */
export const getUserCart = createRoute({
  tags,
  summary: "Get user cart",
  path: "/",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      cartWithItemsSchema,
      "The cart record for active user"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Add new item to user's cart
 */
export const addCartItem = createRoute({
  tags,
  summary: "Add new item to cart",
  path: "/items",
  method: "put",
  request: {
    body: jsonContentRequired(addCartItemSchema, "Cart item details")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      cartItemSchema,
      "The cart item record added to user's cart"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Get cart item by ID
 */
export const getCartItemById = createRoute({
  tags,
  summary: "Get cart item by ID",
  path: "/items/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      cartItemSchema,
      "The cart item record for the specified ID"
    ),

    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Update cart item by ID
 */
export const updateCartItemById = createRoute({
  tags,
  summary: "Update cart item by ID",
  path: "/items/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateCartItemSchema,
      "Cart item details to update"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      cartItemSchema,
      "The updated cart item record for the specified ID"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Delete cart item by ID
 */
export const deleteCartItemById = createRoute({
  tags,
  summary: "Delete cart item by ID",
  path: "/items/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Cart item deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

export type ListRoute = typeof list;
export type GetUserCartRoute = typeof getUserCart;
export type GetCartItemByIdRoute = typeof getCartItemById;
export type AddCartItemRoute = typeof addCartItem;
export type UpdateCartItemByIdRoute = typeof updateCartItemById;
export type DeleteCartItemByIdRoute = typeof deleteCartItemById;
