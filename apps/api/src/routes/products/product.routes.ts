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
  insertProductSchema,
  productSchema,
  stockAdjustmentSchema,
  updateProductSchema
} from "./product.zod";

const tags: string[] = ["Products"];

/**
 * List All Products Endpoint
 */
export const list = createRoute({
  tags,
  summary: "List all Products",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(productSchema)),
      "The list of all products (Populated with product images and variants)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Get Product by ID
 */
export const getOne = createRoute({
  tags,
  summary: "Get product by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      productSchema,
      "The product with Images and Variants"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "The product not found for given ID"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Create Product
 */
export const create = createRoute({
  tags,
  summary: "Create new Product",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertProductSchema,
      "Product details with Images and Variants info."
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      productSchema,
      "The created product with images and variants"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Update product by ID
 */
export const update = createRoute({
  tags,
  summary: "Update Product by ID",
  path: "/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateProductSchema,
      "Product details to update exsisting product"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      productSchema,
      "The updated product (with images and variants)"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access are forbidden"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No product was found for given ID"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Delete product by ID
 */
export const remove = createRoute({
  tags,
  summary: "Remove product by ID",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema, // Used only for respond with message
      "Product successfully deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No product was found for given ID"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Update Product Stock
 */
export const updateStock = createRoute({
  tags,
  summary: "Update product stock quantity",
  path: "/{id}/stock",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(stockAdjustmentSchema, "Stock adjustment details")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      productSchema,
      "Stock updated successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Product not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Request forbidden, you are not allowed to update stock"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access forbidden"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid stock adjustment"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Update Variant Stock
 */
export const updateVariantStock = createRoute({
  tags: ["Product Variants"],
  summary: "Update product variant stock quantity",
  path: "/variants/{id}/stock",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      stockAdjustmentSchema,
      "Variant stock adjustment details"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string(), variant: z.any() }),
      "Variant stock updated successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Variant not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Request forbidden, you are not allowed to update stock"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access forbidden"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid stock adjustment"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type UpdateStockRoute = typeof updateStock;
export type UpdateVariantStockRoute = typeof updateVariantStock;
