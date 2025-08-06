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
  insertQuotationSchema,
  quotationSchema,
  quotationStatusSchema,
  updateQuotationSchema
} from "./quotation.zod";

const tags: string[] = ["Quotations"];

/**
 * List All Quotations Endpoint
 */
export const list = createRoute({
  tags,
  summary: "List all Quotations",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema.extend({
      status: z
        .enum(["draft", "pending", "approved", "rejected", "expired"])
        .optional(),
      userId: z.string().optional()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(quotationSchema)),
      "The list of all quotations (with items)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Get Quotation by ID
 */
export const getOne = createRoute({
  tags,
  summary: "Get quotation by ID",
  path: "/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      quotationSchema,
      "The quotation with items"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "The quotation not found for given ID"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Create Quotation
 */
export const create = createRoute({
  tags,
  summary: "Create new Quotation",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertQuotationSchema,
      "Quotation details with items"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      quotationSchema,
      "The created quotation with items"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid quotation data"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Update quotation by ID
 */
export const update = createRoute({
  tags,
  summary: "Update Quotation by ID",
  path: "/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateQuotationSchema,
      "Quotation details to update"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      quotationSchema,
      "The updated quotation (with items)"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No quotation was found for given ID"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Delete quotation by ID
 */
export const remove = createRoute({
  tags,
  summary: "Remove quotation by ID",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Quotation successfully deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No quotation was found for given ID"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Update Quotation Status
 */
export const updateStatus = createRoute({
  tags,
  summary: "Update quotation status",
  path: "/{id}/status",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(quotationStatusSchema, "Status update details")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      quotationSchema,
      "Status updated successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Quotation not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Request forbidden, you are not allowed to update status"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Generate PDF for quotation
 */
export const generatePdf = createRoute({
  tags,
  summary: "Generate PDF for quotation",
  path: "/{id}/pdf",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "PDF file",
      content: {
        "application/pdf": {
          schema: {
            type: "string",
            format: "binary"
          }
        }
      }
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Quotation not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong"
    )
  }
});

/**
 * Get user's quotations
 */
export const getUserQuotations = createRoute({
  tags,
  summary: "Get current user's quotations",
  path: "/my-quotations",
  method: "get",
  request: {
    query: queryParamsSchema.extend({
      status: z
        .enum(["draft", "pending", "approved", "rejected", "expired"])
        .optional()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(quotationSchema)),
      "The list of user's quotations"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access forbidden"
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
export type UpdateStatusRoute = typeof updateStatus;
export type GeneratePdfRoute = typeof generatePdf;
export type GetUserQuotationsRoute = typeof getUserQuotations;
