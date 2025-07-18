import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@api/lib/helpers";

import {
  brandSchema,
  brandWithProductsSchema,
  insertBrandSchema,
  updateBrandSchema
} from "./brands.zod";

const tags = ["Brands"];

export const list = createRoute({
  tags,
  summary: "List all Brands",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(brandSchema)),
      "The list of all brands"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

export const create = createRoute({
  tags,
  summary: "Create a new Brand",
  path: "/",
  method: "post",
  request: {
    body: jsonContent(insertBrandSchema, "Brand to create")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(brandSchema, "The created brand"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

export const getOne = createRoute({
  tags,
  summary: "Get a single Brand by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      brandWithProductsSchema,
      "The brand with its products"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Brand not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

export const update = createRoute({
  tags,
  summary: "Update a Brand",
  path: "/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContent(updateBrandSchema, "Brand data to update")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(brandSchema, "The updated brand"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Brand not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Validation error"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

export const remove = createRoute({
  tags,
  summary: "Delete a Brand",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Brand deleted successfully"
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Brand not found"
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
