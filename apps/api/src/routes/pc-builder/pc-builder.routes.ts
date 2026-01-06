import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { errorMessageSchema, stringIdParamSchema } from "@api/lib/helpers";
import {
  compatibilityCheckSchema,
  createCompatibilityRuleSchema,
  createComponentSpecsSchema,
  createPcBuildSchema,
  getCompatibleComponentsSchema,
  getComponentsQuerySchema,
  getPcBuildsQuerySchema,
  updateCompatibilityRuleSchema,
  updateComponentSpecsSchema,
  updatePcBuildSchema,
} from "./pc-builder.zod";

const tags: string[] = ["PC Builder"];

// ============= PC BUILD ROUTES =============

/**
 * List All PC Builds
 */
export const listBuilds = createRoute({
  tags,
  summary: "List all PC builds",
  path: "/builds",
  method: "get",
  request: {
    query: getPcBuildsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        builds: z.array(z.any()),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      "List of PC builds with pagination"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request"
    ),
  },
});

/**
 * Get PC Build by ID
 */
export const getBuild = createRoute({
  tags,
  summary: "Get PC build by ID",
  path: "/builds/{id}",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.any(), "PC build with all components"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PC build not found"
    ),
  },
});

/**
 * Create PC Build
 */
export const createBuild = createRoute({
  tags,
  summary: "Create new PC build",
  path: "/builds",
  method: "post",
  request: {
    body: jsonContentRequired(createPcBuildSchema, "PC build data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(z.any(), "Created PC build"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request"
    ),
  },
});

/**
 * Update PC Build
 */
export const updateBuild = createRoute({
  tags,
  summary: "Update PC build",
  path: "/builds/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updatePcBuildSchema, "Updated build data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.any(), "Updated PC build"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PC build not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

/**
 * Delete PC Build
 */
export const deleteBuild = createRoute({
  tags,
  summary: "Delete PC build",
  path: "/builds/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Build deleted successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PC build not found"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

/**
 * Clone PC Build
 */
export const cloneBuild = createRoute({
  tags,
  summary: "Clone PC build",
  path: "/builds/{id}/clone",
  method: "post",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(z.any(), "Cloned PC build"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PC build not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// ============= COMPATIBILITY ROUTES =============

/**
 * Check Compatibility
 */
export const checkCompatibility = createRoute({
  tags,
  summary: "Check component compatibility",
  path: "/compatibility/check",
  method: "post",
  request: {
    body: jsonContentRequired(compatibilityCheckSchema, "Components to check"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        isCompatible: z.boolean(),
        issues: z.array(
          z.object({
            severity: z.enum(["error", "warning", "info"]),
            component: z.string(),
            message: z.string(),
          })
        ),
        estimatedWattage: z.number(),
      }),
      "Compatibility check results"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request"
    ),
  },
});

/**
 * Get Compatible Components
 */
export const getCompatibleComponents = createRoute({
  tags,
  summary: "Get compatible components",
  path: "/compatibility/components",
  method: "get",
  request: {
    query: getCompatibleComponentsSchema
      .omit({
        currentComponents: true,
      })
      .extend({
        currentComponents: z.string().optional(),
      }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(z.any()),
      "List of compatible components"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request"
    ),
  },
});

// ============= COMPONENT SPECS ROUTES =============

/**
 * List Component Specs
 */
export const listComponents = createRoute({
  tags,
  summary: "List component specifications",
  path: "/components",
  method: "get",
  request: {
    query: getComponentsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        components: z.array(z.any()),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      "List of components with specifications"
    ),
  },
});

/**
 * Create Component Spec
 */
export const createComponent = createRoute({
  tags,
  summary: "Create component specification",
  path: "/components",
  method: "post",
  request: {
    body: jsonContentRequired(
      createComponentSpecsSchema,
      "Component specification data"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.any(),
      "Created component specification"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Product not found"
    ),
  },
});

/**
 * Update Component Spec
 */
export const updateComponent = createRoute({
  tags,
  summary: "Update component specification",
  path: "/components/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateComponentSpecsSchema,
      "Updated specification data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.any(),
      "Updated component specification"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Component spec not found"
    ),
  },
});

/**
 * Delete Component Spec
 */
export const deleteComponent = createRoute({
  tags,
  summary: "Delete component specification",
  path: "/components/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Component spec deleted successfully"
    ),
  },
});

// ============= COMPATIBILITY RULES ROUTES =============

/**
 * List Compatibility Rules
 */
export const listRules = createRoute({
  tags,
  summary: "List compatibility rules",
  path: "/rules",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(z.any()), "List of rules"),
  },
});

/**
 * Create Compatibility Rule
 */
export const createRule = createRoute({
  tags,
  summary: "Create compatibility rule",
  path: "/rules",
  method: "post",
  request: {
    body: jsonContentRequired(
      createCompatibilityRuleSchema,
      "Compatibility rule data"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.any(),
      "Created compatibility rule"
    ),
  },
});

/**
 * Update Compatibility Rule
 */
export const updateRule = createRoute({
  tags,
  summary: "Update compatibility rule",
  path: "/rules/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateCompatibilityRuleSchema,
      "Updated rule data"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.any(), "Updated compatibility rule"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Compatibility rule not found"
    ),
  },
});

/**
 * Delete Compatibility Rule
 */
export const deleteRule = createRoute({
  tags,
  summary: "Delete compatibility rule",
  path: "/rules/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Compatibility rule deleted successfully"
    ),
  },
});

// ============= ROUTE TYPES =============

export type ListBuildsRoute = typeof listBuilds;
export type GetBuildRoute = typeof getBuild;
export type CreateBuildRoute = typeof createBuild;
export type UpdateBuildRoute = typeof updateBuild;
export type DeleteBuildRoute = typeof deleteBuild;
export type CloneBuildRoute = typeof cloneBuild;
export type CheckCompatibilityRoute = typeof checkCompatibility;
export type GetCompatibleComponentsRoute = typeof getCompatibleComponents;
export type ListComponentsRoute = typeof listComponents;
export type CreateComponentRoute = typeof createComponent;
export type UpdateComponentRoute = typeof updateComponent;
export type DeleteComponentRoute = typeof deleteComponent;
export type ListRulesRoute = typeof listRules;
export type CreateRuleRoute = typeof createRule;
export type UpdateRuleRoute = typeof updateRule;
export type DeleteRuleRoute = typeof deleteRule;
