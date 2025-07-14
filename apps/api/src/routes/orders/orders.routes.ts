import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@api/lib/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  checkoutSchema,
  orderSummarySchema,
  orderWithItemsSchema,
  updateOrderStatusSchema
} from "./orders.schema";

const tags = ["Orders"];

// List orders (admin only)
export const list = createRoute({
  tags,
  summary: "List all orders",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema.extend({
      status: z.string().optional(),
      paymentStatus: z.string().optional(),
      userId: z.string().optional()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(orderWithItemsSchema)),
      "The list of all orders with items"
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

// Get user's orders
export const getUserOrders = createRoute({
  tags,
  summary: "Get user's orders",
  path: "/my-orders",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(orderWithItemsSchema)),
      "The list of user's orders with items"
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

// Get order by ID
export const getOrderById = createRoute({
  tags,
  summary: "Get order by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      orderWithItemsSchema,
      "The order with items and status history"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Order not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "You don't have permission to view this order"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

// Checkout (create order from cart)
export const checkout = createRoute({
  tags,
  summary: "Checkout cart and create order",
  path: "/checkout",
  method: "post",
  request: {
    body: jsonContentRequired(checkoutSchema, "Checkout information")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      orderWithItemsSchema,
      "The created order with items"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid checkout data or empty cart"
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

// Calculate order totals (preview before checkout)
export const calculateTotals = createRoute({
  tags,
  summary: "Calculate order totals from current cart",
  path: "/calculate-totals",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      orderSummarySchema,
      "The calculated order totals"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Empty cart or invalid cart items"
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

// Update order status (admin only)
export const updateOrderStatus = createRoute({
  tags,
  summary: "Update order status",
  path: "/{id}/status",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateOrderStatusSchema, "Order status update")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      orderWithItemsSchema,
      "The updated order"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Order not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden: Admins only can update order status"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

// Cancel order (user can cancel if order is pending/confirmed)
export const cancelOrder = createRoute({
  tags,
  summary: "Cancel an order",
  path: "/{id}/cancel",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      z.object({ reason: z.string().optional() }),
      "Cancellation reason"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      orderWithItemsSchema,
      "The cancelled order"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Order cannot be cancelled"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Order not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "You don't have permission to cancel this order"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

export type ListRoute = typeof list;
export type GetUserOrdersRoute = typeof getUserOrders;
export type GetOrderByIdRoute = typeof getOrderById;
export type CheckoutRoute = typeof checkout;
export type CalculateTotalsRoute = typeof calculateTotals;
export type UpdateOrderStatusRoute = typeof updateOrderStatus;
export type CancelOrderRoute = typeof cancelOrder;
