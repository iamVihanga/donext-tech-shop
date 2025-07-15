import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import {
  buildCategoryTree,
  calculateCategoryLevel,
  categories,
  generateCategoryPath,
  productImages,
  products
} from "@repo/database";

import { toKebabCase } from "../../lib/helpers";
import type {
  AddSubcategoryRoute,
  CreateRoute,
  GetCategoryTreeRoute,
  GetOneRoute,
  ListRoute,
  MoveCategoryRoute,
  PatchRoute,
  ProductsByCategoryRoute,
  RemoveRoute,
  RemoveSubcategoryRoute
} from "./categories.routes";

// List categories route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    search = "",
    sort = "desc"
  } = c.req.valid("query");

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  const whereClause = search
    ? ilike(categories.name, `%${search}%`)
    : undefined;

  const [categoriesData, totalCount] = await Promise.all([
    db
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(sort === "asc" ? categories.name : desc(categories.name))
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql`count(*)` })
      .from(categories)
      .where(whereClause)
  ]);

  const total = Number(totalCount[0]?.count) || 0;
  const totalPages = Math.ceil(total / limitNumber);

  // Build nested structure
  const tree = buildCategoryTree(categoriesData);

  return c.json({
    data: tree,
    meta: {
      currentPage: pageNumber,
      limit: limitNumber,
      totalCount: total,
      totalPages
    }
  });
};

// Get category tree handler
export const getCategoryTree: AppRouteHandler<GetCategoryTreeRoute> = async (
  c
) => {
  const categoriesData = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.level, categories.sortOrder, categories.name);

  const tree = buildCategoryTree(categoriesData);
  return c.json(tree);
};

// Create category route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const slug = toKebabCase(body.name);

  // Calculate path and level if parent is provided
  let path = `/${slug}`;
  let level = 0;

  if (body.parentId) {
    const allCategories = await db.select().from(categories);
    path = generateCategoryPath(allCategories, body.parentId) + `/${slug}`;
    level = calculateCategoryLevel(allCategories, body.parentId) + 1;
  }

  const [category] = await db
    .insert(categories)
    .values({
      ...body,
      slug,
      path,
      level
    })
    .returning();

  return c.json(category, HttpStatusCodes.CREATED);
};

// Get one category route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));

  if (!category) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Get all categories to build the tree for this category
  const allCategories = await db.select().from(categories);

  // Find all children of this category
  const childCategories = allCategories.filter((cat) => cat.parentId === id);
  const children = buildCategoryTree(childCategories);

  // Return with proper typing
  return c.json(
    {
      ...category,
      children
    },
    HttpStatusCodes.OK
  );
};

// Update category route handler
export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  // Check if category exists
  const [existingCategory] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));

  if (!existingCategory) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Calculate new path and level if parent is changing
  let updateData: any = { ...body };

  if (body.parentId !== existingCategory.parentId) {
    const allCategories = await db.select().from(categories);
    const slug = body.name ? toKebabCase(body.name) : existingCategory.slug;

    if (body.parentId) {
      updateData.path =
        generateCategoryPath(allCategories, body.parentId) + `/${slug}`;
      updateData.level =
        calculateCategoryLevel(allCategories, body.parentId) + 1;
    } else {
      updateData.path = `/${slug}`;
      updateData.level = 0;
    }
  } else if (body.name) {
    // Update slug if name changed but parent didn't
    const slug = toKebabCase(body.name);
    updateData.slug = slug;

    // Update path with new slug
    if (existingCategory.parentId) {
      const allCategories = await db.select().from(categories);
      updateData.path =
        generateCategoryPath(allCategories, existingCategory.parentId) +
        `/${slug}`;
    } else {
      updateData.path = `/${slug}`;
    }
  }

  const [updatedCategory] = await db
    .update(categories)
    .set(updateData)
    .where(eq(categories.id, id))
    .returning();

  return c.json(updatedCategory);
};

// Remove category route handler
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));

  if (!category) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(categories).where(eq(categories.id, id));

  return c.json(
    { message: "Category deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Move category handler (for drag and drop)
export const moveCategory: AppRouteHandler<MoveCategoryRoute> = async (c) => {
  const { categoryId, newParentId, newSortOrder } = c.req.valid("json");

  const allCategories = await db.select().from(categories);

  // Calculate new path and level
  const categoryToMove = allCategories.find((cat) => cat.id === categoryId);
  if (!categoryToMove) {
    return c.json(
      { message: "Category not found" },
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const newPath = newParentId
    ? generateCategoryPath(allCategories, newParentId) +
      `/${categoryToMove.slug}`
    : `/${categoryToMove.slug}`;

  const newLevel = newParentId
    ? calculateCategoryLevel(allCategories, newParentId) + 1
    : 0;

  const [updatedCategory] = await db
    .update(categories)
    .set({
      parentId: newParentId,
      sortOrder: newSortOrder,
      path: newPath,
      level: newLevel
    })
    .where(eq(categories.id, categoryId))
    .returning();

  return c.json(updatedCategory);
};

// Legacy subcategory handlers (for backward compatibility)
export const addSubcategory: AppRouteHandler<AddSubcategoryRoute> = async (
  c
) => {
  const { id: parentId } = c.req.valid("param");
  const body = c.req.valid("json");

  // This is now just creating a child category
  const slug = toKebabCase(body.name);
  const allCategories = await db.select().from(categories);
  const path = generateCategoryPath(allCategories, parentId) + `/${slug}`;
  const level = calculateCategoryLevel(allCategories, parentId) + 1;

  const [subcategory] = await db
    .insert(categories)
    .values({
      ...body,
      slug,
      path,
      level,
      parentId
    })
    .returning();

  return c.json(subcategory, HttpStatusCodes.CREATED);
};

export const removeSubcategory: AppRouteHandler<
  RemoveSubcategoryRoute
> = async (c) => {
  const { id: parentId, subcategoryId } = c.req.valid("param");

  // Check if subcategory exists and belongs to parent
  const [subcategory] = await db
    .select()
    .from(categories)
    .where(
      and(eq(categories.id, subcategoryId), eq(categories.parentId, parentId))
    );

  if (!subcategory) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(categories).where(eq(categories.id, subcategoryId));

  return c.json(
    { message: "Subcategory deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Products by category handler
export const productsByCategory: AppRouteHandler<
  ProductsByCategoryRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const {
    page = "1",
    limit = "10",
    search = "",
    sort = "desc"
  } = c.req.valid("query");

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  const whereClause = and(
    eq(products.categoryId, id),
    search ? ilike(products.name, `%${search}%`) : undefined
  );

  const [productsData, totalCount] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        sku: products.sku,
        stockQuantity: products.stockQuantity,
        reservedQuantity: products.reservedQuantity,
        minStockLevel: products.minStockLevel,
        weight: products.weight,
        dimensions: products.dimensions,
        categoryId: products.categoryId,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        requiresShipping: products.requiresShipping,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        tags: products.tags,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        images: sql<
          Array<{
            id: string;
            productId: string;
            imageUrl: string;
            altText: string | null;
            sortOrder: number | null;
            isThumbnail: boolean | null;
            createdAt: string;
            updatedAt: string | null;
          }>
        >`
          COALESCE(
            json_agg(
              json_build_object(
                'id', ${productImages.id},
                'productId', ${productImages.productId},
                'imageUrl', ${productImages.imageUrl},
                'altText', ${productImages.altText},
                'sortOrder', ${productImages.sortOrder},
                'isThumbnail', ${productImages.isThumbnail},
                'createdAt', ${productImages.createdAt},
                'updatedAt', ${productImages.updatedAt}
              )
              ORDER BY ${productImages.sortOrder}
            ) FILTER (WHERE ${productImages.id} IS NOT NULL),
            '[]'::json
          )
        `
      })
      .from(products)
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(whereClause)
      .groupBy(products.id)
      .orderBy(sort === "asc" ? products.name : desc(products.name))
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql`count(*)` })
      .from(products)
      .where(whereClause)
  ]);

  const total = Number(totalCount[0]?.count) || 0;
  const totalPages = Math.ceil(total / limitNumber);

  return c.json(
    {
      data: productsData,
      meta: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalCount: total,
        totalPages
      }
    },
    HttpStatusCodes.OK
  );
};
