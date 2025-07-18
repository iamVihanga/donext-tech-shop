import { asc, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import { toKebabCase } from "@api/lib/helpers";
import type { AppRouteHandler } from "@api/types";
import { brands } from "@repo/database";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute
} from "./brands.routes";

/**
 * List all Brands with pagination
 */
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search
  } = c.req.valid("query");

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const offset = (pageNum - 1) * limitNum;

  try {
    const whereClause = search ? ilike(brands.name, `%${search}%`) : undefined;

    const orderByClause =
      sort === "asc" ? asc(brands.name) : desc(brands.createdAt);

    const [data, totalCountResult] = await Promise.all([
      db
        .select()
        .from(brands)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limitNum)
        .offset(offset),
      db
        .select({ count: sql`count(*)` })
        .from(brands)
        .where(whereClause)
    ]);

    const totalCount = Number(totalCountResult[0]?.count) || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data,
        meta: {
          currentPage: pageNum,
          limit: limitNum,
          totalCount,
          totalPages
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Create brand handler
 */
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");

  try {
    const slug = toKebabCase(body.name);

    const [brand] = await db
      .insert(brands)
      .values({
        ...body,
        slug
      })
      .returning();

    return c.json(brand, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get one brand by ID handler
 */
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));

    if (!brand) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Get brand with products
    const brandWithProducts = await db.query.brands.findFirst({
      where: eq(brands.id, id),
      with: {
        products: {
          limit: 10,
          orderBy: desc(brands.createdAt)
        }
      }
    });

    return c.json(brandWithProducts, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Update brand handler
 */
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  try {
    const updateData = { ...body };

    // Update slug if name is being changed
    if (body.name) {
      updateData.slug = toKebabCase(body.name);
    }

    const [updatedBrand] = await db
      .update(brands)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(brands.id, id))
      .returning();

    if (!updatedBrand) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(updatedBrand, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Delete brand handler
 */
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const [deletedBrand] = await db
      .delete(brands)
      .where(eq(brands.id, id))
      .returning();

    if (!deletedBrand) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.body(null, HttpStatusCodes.NO_CONTENT);
  } catch (error) {
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
