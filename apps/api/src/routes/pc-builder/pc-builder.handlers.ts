import {
  compatibilityRules,
  pcBuilds,
  productComponentSpecs,
  products,
} from "@repo/database";
import { and, desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";

import {
  calculateBuildPrice,
  checkBuildCompatibility,
  getCompatibleComponents,
} from "./pc-builder.helpers";

import type {
  CheckCompatibilityRoute,
  CloneBuildRoute,
  CreateBuildRoute,
  CreateComponentRoute,
  CreateRuleRoute,
  DeleteBuildRoute,
  DeleteComponentRoute,
  DeleteRuleRoute,
  GetBuildRoute,
  GetCompatibleComponentsRoute,
  ListBuildsRoute,
  ListComponentsRoute,
  ListRulesRoute,
  UpdateBuildRoute,
  UpdateComponentRoute,
  UpdateRuleRoute,
} from "./pc-builder.routes";

// ============= PC BUILDS HANDLERS =============

/**
 * Get all PC builds with optional filters
 */
export const getPcBuilds: AppRouteHandler<ListBuildsRoute> = async (c) => {
  const { userId, isPublic, isTemplate, page, limit } = c.req.valid("query");

  const pageNum = page || 1;
  const limitNum = limit || 20;
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (userId) conditions.push(eq(pcBuilds.userId, userId));
  if (isPublic !== undefined) conditions.push(eq(pcBuilds.isPublic, isPublic));
  if (isTemplate !== undefined)
    conditions.push(eq(pcBuilds.isTemplate, isTemplate));

  const [builds, totalResult] = await Promise.all([
    db
      .select()
      .from(pcBuilds)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(pcBuilds.createdAt))
      .limit(limitNum)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(pcBuilds)
      .where(conditions.length > 0 ? and(...conditions) : undefined),
  ]);

  const total = Number(totalResult[0]?.count || 0);

  return c.json(
    {
      builds,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    HttpStatusCodes.OK
  );
};

/**
 * Get a single PC build by ID
 */
export const getPcBuildById: AppRouteHandler<GetBuildRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const build = await db.query.pcBuilds.findFirst({
    where: eq(pcBuilds.id, id),
    with: {
      processor: true,
      motherboard: true,
      memory: true,
      graphicCard: true,
      ssdNvme: true,
      hardDisk: true,
      powerSupply: true,
      cooler: true,
      pcCase: true,
      keyboard: true,
      mouse: true,
      mousePad: true,
      headset: true,
      speaker: true,
      ups: true,
      table: true,
      chair: true,
      thermalPaste: true,
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!build) {
    return c.json({ message: "PC build not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(build, HttpStatusCodes.OK);
};

/**
 * Create a new PC build
 */
export const createPcBuild: AppRouteHandler<CreateBuildRoute> = async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const body = c.req.valid("json");

  // Check compatibility
  const { isCompatible, issues, estimatedWattage } =
    await checkBuildCompatibility(body);

  // Calculate total price
  const totalPrice = await calculateBuildPrice(body);

  // Clean up array fields - remove empty strings and return undefined if empty
  const cleanArrayField = (arr: any) => {
    if (!arr || !Array.isArray(arr)) return undefined;
    const filtered = arr.filter((item) => item && item !== "");
    return filtered.length > 0 ? filtered : undefined;
  };

  // Clean up empty string fields - convert to undefined
  const cleanStringField = (value: any) => {
    return value === "" || value === null ? undefined : value;
  };

  const buildData: any = {
    name: body.name,
    description: body.description,
    userId: user.id,
    compatibilityIssues: issues,
    totalPrice: totalPrice.toString(),
    estimatedWattage,
    memoryQuantity: body.memoryQuantity,
    isPublic: body.isPublic,
    isTemplate: body.isTemplate,
  };

  // Add foreign key fields only if they have values
  const processorId = cleanStringField(body.processorId);
  const motherboardId = cleanStringField(body.motherboardId);
  const memoryId = cleanStringField(body.memoryId);
  const graphicCardId = cleanStringField(body.graphicCardId);
  const ssdNvmeId = cleanStringField(body.ssdNvmeId);
  const hardDiskId = cleanStringField(body.hardDiskId);
  const powerSupplyId = cleanStringField(body.powerSupplyId);
  const coolerId = cleanStringField(body.coolerId);
  const pcCaseId = cleanStringField(body.pcCaseId);
  const keyboardId = cleanStringField(body.keyboardId);
  const mouseId = cleanStringField(body.mouseId);
  const mousePadId = cleanStringField(body.mousePadId);
  const headsetId = cleanStringField(body.headsetId);
  const speakerId = cleanStringField(body.speakerId);
  const upsId = cleanStringField(body.upsId);
  const tableId = cleanStringField(body.tableId);
  const chairId = cleanStringField(body.chairId);
  const thermalPasteId = cleanStringField(body.thermalPasteId);

  if (processorId !== undefined) buildData.processorId = processorId;
  if (motherboardId !== undefined) buildData.motherboardId = motherboardId;
  if (memoryId !== undefined) buildData.memoryId = memoryId;
  if (graphicCardId !== undefined) buildData.graphicCardId = graphicCardId;
  if (ssdNvmeId !== undefined) buildData.ssdNvmeId = ssdNvmeId;
  if (hardDiskId !== undefined) buildData.hardDiskId = hardDiskId;
  if (powerSupplyId !== undefined) buildData.powerSupplyId = powerSupplyId;
  if (coolerId !== undefined) buildData.coolerId = coolerId;
  if (pcCaseId !== undefined) buildData.pcCaseId = pcCaseId;
  if (keyboardId !== undefined) buildData.keyboardId = keyboardId;
  if (mouseId !== undefined) buildData.mouseId = mouseId;
  if (mousePadId !== undefined) buildData.mousePadId = mousePadId;
  if (headsetId !== undefined) buildData.headsetId = headsetId;
  if (speakerId !== undefined) buildData.speakerId = speakerId;
  if (upsId !== undefined) buildData.upsId = upsId;
  if (tableId !== undefined) buildData.tableId = tableId;
  if (chairId !== undefined) buildData.chairId = chairId;
  if (thermalPasteId !== undefined) buildData.thermalPasteId = thermalPasteId;

  // Add array fields only if they have values
  const fanIds = cleanArrayField(body.fanIds);
  const extraSsdNvmeIds = cleanArrayField(body.extraSsdNvmeIds);
  const extraHardDiskIds = cleanArrayField(body.extraHardDiskIds);
  const monitorIds = cleanArrayField(body.monitorIds);
  const softwareIds = cleanArrayField(body.softwareIds);
  const cableIds = cleanArrayField(body.cableIds);

  if (fanIds !== undefined) buildData.fanIds = fanIds;
  if (extraSsdNvmeIds !== undefined)
    buildData.extraSsdNvmeIds = extraSsdNvmeIds;
  if (extraHardDiskIds !== undefined)
    buildData.extraHardDiskIds = extraHardDiskIds;
  if (monitorIds !== undefined) buildData.monitorIds = monitorIds;
  if (softwareIds !== undefined) buildData.softwareIds = softwareIds;
  if (cableIds !== undefined) buildData.cableIds = cableIds;

  try {
    const [newBuild] = await db.insert(pcBuilds).values(buildData).returning();

    return c.json(newBuild, HttpStatusCodes.CREATED);
  } catch (error: any) {
    console.error("Failed to create PC build:", {
      error,
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      constraint: error?.constraint,
      buildData,
    });

    // Check for foreign key constraint violations
    if (error?.code === "23503") {
      return c.json(
        {
          message: "Invalid product reference",
          detail: error?.detail || "One or more product IDs do not exist",
        },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    throw error;
  }
};

/**
 * Update a PC build
 */
export const updatePcBuild: AppRouteHandler<UpdateBuildRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if build exists and user owns it
  const existingBuild = await db.query.pcBuilds.findFirst({
    where: eq(pcBuilds.id, id),
  });

  if (!existingBuild) {
    return c.json({ message: "PC build not found" }, HttpStatusCodes.NOT_FOUND);
  }

  if (existingBuild.userId !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Merge existing build with updates
  const updatedComponents = {
    ...existingBuild,
    ...body,
  };

  // Check compatibility
  const { isCompatible, issues, estimatedWattage } =
    await checkBuildCompatibility(updatedComponents);

  // Calculate total price
  const totalPrice = await calculateBuildPrice(updatedComponents);

  const [updatedBuild] = await db
    .update(pcBuilds)
    .set({
      ...body,
      compatibilityIssues: issues,
      totalPrice: totalPrice.toString(),
      estimatedWattage,
      updatedAt: new Date(),
    })
    .where(eq(pcBuilds.id, id))
    .returning();

  return c.json(updatedBuild, HttpStatusCodes.OK);
};

/**
 * Delete a PC build
 */
export const deletePcBuild: AppRouteHandler<DeleteBuildRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if build exists and user owns it
  const existingBuild = await db.query.pcBuilds.findFirst({
    where: eq(pcBuilds.id, id),
  });

  if (!existingBuild) {
    return c.json({ message: "PC build not found" }, HttpStatusCodes.NOT_FOUND);
  }

  if (existingBuild.userId !== user.id) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(pcBuilds).where(eq(pcBuilds.id, id));

  return c.json(
    { message: "PC build deleted successfully" },
    HttpStatusCodes.OK
  );
};

/**
 * Clone a PC build
 */
export const clonePcBuild: AppRouteHandler<CloneBuildRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingBuild = await db.query.pcBuilds.findFirst({
    where: eq(pcBuilds.id, id),
  });

  if (!existingBuild) {
    return c.json({ message: "PC build not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Create a copy
  const { id: _id, createdAt, updatedAt, userId, ...buildData } = existingBuild;

  const [clonedBuild] = await db
    .insert(pcBuilds)
    .values({
      ...buildData,
      userId: user.id,
      name: `${buildData.name} (Copy)`,
      isPublic: false,
    })
    .returning();

  return c.json(clonedBuild, HttpStatusCodes.CREATED);
};

// ============= COMPATIBILITY HANDLERS =============

/**
 * Check component compatibility
 */
export const checkCompatibilityHandler: AppRouteHandler<
  CheckCompatibilityRoute
> = async (c) => {
  const body = c.req.valid("json");

  const result = await checkBuildCompatibility(body);

  return c.json(result, HttpStatusCodes.OK);
};

/**
 * Get compatible components for a build
 */
export const getCompatibleComponentsHandler: AppRouteHandler<
  GetCompatibleComponentsRoute
> = async (c) => {
  const { componentType, buildId, currentComponents } = c.req.valid("query");

  let parsedCurrentComponents = currentComponents
    ? JSON.parse(currentComponents)
    : undefined;

  // If buildId is provided, fetch the build
  if (buildId) {
    const build = await db.query.pcBuilds.findFirst({
      where: eq(pcBuilds.id, buildId),
    });

    if (build) {
      parsedCurrentComponents = {
        processorId: build.processorId || undefined,
        motherboardId: build.motherboardId || undefined,
        memoryId: build.memoryId || undefined,
        graphicCardId: build.graphicCardId || undefined,
        pcCaseId: build.pcCaseId || undefined,
        powerSupplyId: build.powerSupplyId || undefined,
      };
    }
  }

  const compatibleComponents = await getCompatibleComponents(
    componentType,
    parsedCurrentComponents
  );

  return c.json(compatibleComponents, HttpStatusCodes.OK);
};

// ============= COMPONENT SPECS HANDLERS =============

/**
 * Get component specifications
 */
export const getComponentSpecs: AppRouteHandler<ListComponentsRoute> = async (
  c
) => {
  const {
    page,
    limit,
    componentType,
    socketType,
    memoryType,
    formFactor,
    minPrice,
    maxPrice,
  } = c.req.valid("query");

  const pageNum = page || 1;
  const limitNum = limit || 20;
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (componentType)
    conditions.push(
      eq(productComponentSpecs.componentType, componentType as any)
    );
  if (socketType)
    conditions.push(eq(productComponentSpecs.socketType, socketType as any));
  if (memoryType)
    conditions.push(eq(productComponentSpecs.memoryType, memoryType as any));
  if (formFactor)
    conditions.push(eq(productComponentSpecs.formFactor, formFactor as any));

  const [specs, totalResult] = await Promise.all([
    db
      .select({
        product: products,
        specs: productComponentSpecs,
      })
      .from(productComponentSpecs)
      .innerJoin(products, eq(products.id, productComponentSpecs.productId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limitNum)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(productComponentSpecs)
      .where(conditions.length > 0 ? and(...conditions) : undefined),
  ]);

  const total = Number(totalResult[0]?.count || 0);

  return c.json(
    {
      components: specs.map((s) => ({ ...s.product, specs: s.specs })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    HttpStatusCodes.OK
  );
};

/**
 * Create component specifications
 */
export const createComponentSpec: AppRouteHandler<
  CreateComponentRoute
> = async (c) => {
  const body = c.req.valid("json");

  // Check if product exists
  const product = await db.query.products.findFirst({
    where: eq(products.id, body.productId),
  });

  if (!product) {
    return c.json({ message: "Product not found" }, HttpStatusCodes.NOT_FOUND);
  }

  const [newSpec] = await db
    .insert(productComponentSpecs)
    .values(body)
    .returning();

  return c.json(newSpec, HttpStatusCodes.CREATED);
};

/**
 * Update component specification
 */
export const updateComponentSpec: AppRouteHandler<
  UpdateComponentRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  // Remove immutable fields that shouldn't be updated
  const { productId, componentType, ...updateData } = body;

  const [updatedSpec] = await db
    .update(productComponentSpecs)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(productComponentSpecs.id, id))
    .returning();

  if (!updatedSpec) {
    return c.json(
      { message: "Component spec not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedSpec, HttpStatusCodes.OK);
};

/**
 * Delete component specification
 */
export const deleteComponentSpec: AppRouteHandler<
  DeleteComponentRoute
> = async (c) => {
  const { id } = c.req.valid("param");

  await db
    .delete(productComponentSpecs)
    .where(eq(productComponentSpecs.id, id));

  return c.json(
    { message: "Component spec deleted successfully" },
    HttpStatusCodes.OK
  );
};

// ============= COMPATIBILITY RULES HANDLERS =============

/**
 * Get all compatibility rules
 */
export const getCompatibilityRules: AppRouteHandler<ListRulesRoute> = async (
  c
) => {
  const rules = await db.select().from(compatibilityRules);
  return c.json(rules, HttpStatusCodes.OK);
};

/**
 * Create a compatibility rule
 */
export const createCompatibilityRule: AppRouteHandler<CreateRuleRoute> = async (
  c
) => {
  const body = c.req.valid("json");

  const [newRule] = await db
    .insert(compatibilityRules)
    .values(body)
    .returning();

  return c.json(newRule, HttpStatusCodes.CREATED);
};

/**
 * Update a compatibility rule
 */
export const updateCompatibilityRule: AppRouteHandler<UpdateRuleRoute> = async (
  c
) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const [updatedRule] = await db
    .update(compatibilityRules)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(compatibilityRules.id, id))
    .returning();

  if (!updatedRule) {
    return c.json(
      { message: "Compatibility rule not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedRule, HttpStatusCodes.OK);
};

/**
 * Delete a compatibility rule
 */
export const deleteCompatibilityRule: AppRouteHandler<DeleteRuleRoute> = async (
  c
) => {
  const { id } = c.req.valid("param");

  await db.delete(compatibilityRules).where(eq(compatibilityRules.id, id));

  return c.json(
    { message: "Compatibility rule deleted successfully" },
    HttpStatusCodes.OK
  );
};
