import { desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import {
  productImages,
  products,
  productVariants
} from "@repo/database/schemas";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
  UpdateStockRoute,
  UpdateVariantStockRoute
} from "./product.routes";

/**
 * List all Products with paginations
 */
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.products.findMany({
    with: { images: true, variants: true },
    limit: limitNum,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.name, `%${search}%`));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }

      return desc(fields.createdAt);
    }
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(search ? ilike(products.name, `%${search}%`) : undefined);

  const [productsEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: productsEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};

/**
 * Create product handler
 */
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  // Validate Authentication
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Handle Product Category Creation
  const body = c.req.valid("json");

  /**
   * Database Transactional Process
   * - Create Product first,
   * - Create Product images with created product ID,
   * - Create Product variants with created product ID.
   */
  const result = await db.transaction(async (tx) => {
    // - Create Product
    const { images, variants, ...productData } = body;

    const [createdProduct] = await tx
      .insert(products)
      .values(productData)
      .returning();

    if (!createdProduct) {
      tx.rollback();
      return c.json(
        { message: "Product creation failed" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // - Insert Product Images
    if (images.length > 0) {
      await tx.insert(productImages).values(
        images.map((image) => ({
          ...image,
          productId: createdProduct.id
        }))
      );
    }

    // - Insert Product Variants
    if (variants.length > 0) {
      await tx.insert(productVariants).values(
        variants.map((variant) => ({
          ...variant,
          productId: createdProduct.id
        }))
      );
    }

    // - Fetch full product with images and variants
    const fullProduct = await tx.query.products.findFirst({
      where: (fields, { eq }) => eq(fields.id, createdProduct.id),
      with: {
        images: true,
        variants: true
      }
    });

    return fullProduct;
  });

  return c.json(result, HttpStatusCodes.OK);
};

/**
 * Get one product by ID handler
 */
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Fetch product with images and variants
  const product = await db.query.products.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
    with: {
      images: true,
      variants: true
    }
  });

  if (!product) {
    return c.json({ message: "Product not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(product, HttpStatusCodes.OK);
};

/**
 * Update product by ID handler
 */
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  // Validate Authentication
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if product exists
  const existingProduct = await db.query.products.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingProduct) {
    return c.json({ message: "Product not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Update product details
  const [updatedProduct] = await db
    .update(products)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  if (!updatedProduct) {
    return c.json(
      { message: "Product update failed" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const fullProduct = await db.query.products.findFirst({
    where: (fields, { eq }) => eq(fields.id, updatedProduct.id),
    with: {
      images: true,
      variants: true
    }
  });

  return c.json(fullProduct, HttpStatusCodes.OK);
};

/**
 * Delete product by ID handler
 */
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Validate Authentication
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if product exists
  const existingProduct = await db.query.products.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingProduct) {
    return c.json({ message: "Product not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Delete product and related images and variants
  await db.transaction(async (tx) => {
    await tx.delete(productImages).where(eq(productImages.productId, id));
    await tx.delete(productVariants).where(eq(productVariants.productId, id));
    await tx.delete(products).where(eq(products.id, id));
  });

  return c.json(
    { message: "Product deleted successfully" },
    HttpStatusCodes.OK
  );
};

/**
 * Update product stock handler
 */
export const updateStock: AppRouteHandler<UpdateStockRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const { adjustmentType, quantity } = c.req.valid("json");

  if (!user) {
    return c.json(
      { message: "User must be authenticated" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      { message: "Only admins can update stock" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    // First, get the current product
    const product = await db.query.products.findFirst({
      where: eq(products.id, id)
    });

    if (!product) {
      return c.json(
        { message: "Product not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const currentStock = product.stockQuantity || 0;
    let newStock: number;

    if (adjustmentType === "increase") {
      newStock = currentStock + quantity;
    } else {
      newStock = Math.max(0, currentStock - quantity);
    }

    // Update the product stock
    const [updatedProduct] = await db
      .update(products)
      .set({
        stockQuantity: newStock,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      return c.json({ message: "Failed to update product stock" }, 500);
    }

    // Get the updated product with relations
    const fullProduct = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { images: true, variants: true }
    });

    return c.json(fullProduct, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error updating product stock:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};

/**
 * Update variant stock handler
 */
export const updateVariantStock: AppRouteHandler<
  UpdateVariantStockRoute
> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const { adjustmentType, quantity } = c.req.valid("json");

  if (!user) {
    return c.json(
      { message: "User must be authenticated" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      { message: "Only admins can update stock" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    // First, get the current variant
    const variant = await db.query.productVariants.findFirst({
      where: eq(productVariants.id, id)
    });

    if (!variant) {
      return c.json(
        { message: "Variant not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const currentStock = variant.stockQuantity || 0;
    let newStock: number;

    if (adjustmentType === "increase") {
      newStock = currentStock + quantity;
    } else {
      newStock = Math.max(0, currentStock - quantity);
    }

    // Update the variant stock
    const [updatedVariant] = await db
      .update(productVariants)
      .set({
        stockQuantity: newStock,
        updatedAt: new Date()
      })
      .where(eq(productVariants.id, id))
      .returning();

    if (!updatedVariant) {
      return c.json(
        { message: "Failed to update variant stock" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return c.json(
      {
        message: "Variant stock updated successfully",
        variant: updatedVariant
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error updating variant stock:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
