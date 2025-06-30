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

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
