import { db } from "@api/db";
import { quotationItems, quotations } from "@repo/database";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@api/types";
import type {
  CreateRoute,
  GeneratePDFRoute,
  GetOneRoute,
  GetUserQuotationsRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
  UpdateStatusRoute
} from "./quotation.routes";

interface QuotationItemData {
  productId: string;
  variantId?: string | null;
  quantity?: number;
  unitPrice: string;
  totalPrice: string;
  productName: string;
  productSku?: string | null;
  variantName?: string | null;
  notes?: string | null;
}

/**
 * List all Quotations with pagination
 */
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
    status,
    userId
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.quotations.findMany({
    with: {
      items: {
        with: {
          product: true,
          variant: true
        }
      },
      user: {
        columns: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, eq }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(
          ilike(fields.quotationNumber, `%${search}%`),
          ilike(fields.customerName, `%${search}%`),
          ilike(fields.customerEmail, `%${search}%`)
        );
      }

      // Add status filter
      if (status) {
        conditions.push(eq(fields.status, status));
      }

      // Add user filter
      if (userId) {
        conditions.push(eq(fields.userId, userId));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return [fields.createdAt];
      }
      return [desc(fields.createdAt)];
    }
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(quotations)
    .where(
      and(
        search
          ? sql`(${ilike(quotations.quotationNumber, `%${search}%`)} OR ${ilike(quotations.customerName, `%${search}%`)} OR ${ilike(quotations.customerEmail, `%${search}%`)})`
          : undefined,
        status ? eq(quotations.status, status) : undefined,
        userId ? eq(quotations.userId, userId) : undefined
      )
    );

  const [quotationEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: quotationEntries,
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
 * Create quotation handler
 */
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");

  try {
    // Generate quotation number
    const quotationNumber = `QUO-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    /**
     * Database Transactional Process
     * - Create Quotation first,
     * - Create Quotation items with created quotation ID,
     * - Calculate totals
     */
    const result = await db.transaction(async (tx) => {
      // Create Quotation
      const { items, ...quotationData } = body;

      const [createdQuotation] = await tx
        .insert(quotations)
        .values({
          ...quotationData,
          quotationNumber
        })
        .returning();

      console.log({ createdQuotation, bodyData: { items, ...quotationData } });

      if (!createdQuotation) {
        throw new Error("Failed to create quotation");
      }

      // Insert Quotation Items
      if (items && items.length > 0) {
        const quotationItemsData = items.map((item: QuotationItemData) => ({
          ...item,
          quotationId: createdQuotation.id,
          quantity: item.quantity || 1,
          totalPrice: (
            parseFloat(item.unitPrice) * (item.quantity || 1)
          ).toString()
        }));

        await tx.insert(quotationItems).values(quotationItemsData);

        // Calculate totals
        const subtotal = quotationItemsData.reduce(
          (sum: number, item: { totalPrice: string }) =>
            sum + parseFloat(item.totalPrice),
          0
        );
        const taxAmount = subtotal * 0.1; // 10% tax (configurable)
        const discountAmount = parseFloat(quotationData.discountAmount || "0");
        const totalAmount = subtotal + taxAmount - discountAmount;

        // Update quotation with calculated totals
        await tx
          .update(quotations)
          .set({
            subtotal: subtotal.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            updatedAt: new Date()
          })
          .where(eq(quotations.id, createdQuotation.id));
      }

      // Fetch full quotation with items
      const fullQuotation = await tx.query.quotations.findFirst({
        where: (fields, { eq }) => eq(fields.id, createdQuotation.id),
        with: {
          items: {
            with: {
              product: true,
              variant: true
            }
          }
        }
      });

      return fullQuotation;
    });

    return c.json(result, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Create quotation error:", error);
    return c.json(
      { message: "Failed to create quotation" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get one quotation by ID handler
 */
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Fetch quotation with items
  const quotation = await db.query.quotations.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
    with: {
      items: {
        with: {
          product: true,
          variant: true
        }
      },
      user: {
        columns: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!quotation) {
    return c.json(
      { message: "Quotation not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(quotation, HttpStatusCodes.OK);
};

/**
 * Update quotation by ID handler
 */
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  // Check if quotation exists
  const existingQuotation = await db.query.quotations.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
    with: {
      items: true
    }
  });

  if (!existingQuotation) {
    return c.json(
      { message: "Quotation not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      // Extract items from body
      const { items, ...quotationData } = body;

      // Update basic quotation data
      const [updatedQuotation] = await tx
        .update(quotations)
        .set({ ...quotationData, updatedAt: new Date() })
        .where(eq(quotations.id, id))
        .returning();

      if (!updatedQuotation) {
        throw new Error("Failed to update quotation");
      }

      // Handle items update if provided
      if (items !== undefined) {
        // Delete existing items
        await tx
          .delete(quotationItems)
          .where(eq(quotationItems.quotationId, id));

        // Insert new items
        if (items.length > 0) {
          const quotationItemsData = items.map((item: QuotationItemData) => ({
            ...item,
            quotationId: id,
            quantity: item.quantity || 1,
            totalPrice: (
              parseFloat(item.unitPrice) * (item.quantity || 1)
            ).toString()
          }));

          await tx.insert(quotationItems).values(quotationItemsData);

          // Recalculate totals
          const subtotal = quotationItemsData.reduce(
            (sum, item) => sum + parseFloat(item.totalPrice),
            0
          );

          const taxAmount = subtotal * 0.1;
          const discountAmount = parseFloat(
            quotationData.discountAmount || updatedQuotation.discountAmount
          );
          const totalAmount = subtotal + taxAmount - discountAmount;

          // Update quotation with new totals
          await tx
            .update(quotations)
            .set({
              subtotal: subtotal.toFixed(2),
              taxAmount: taxAmount.toFixed(2),
              totalAmount: totalAmount.toFixed(2),
              updatedAt: new Date()
            })
            .where(eq(quotations.id, id));
        }
      }

      // Fetch full updated quotation with items
      const fullQuotation = await tx.query.quotations.findFirst({
        where: (fields, { eq }) => eq(fields.id, id),
        with: {
          items: {
            with: {
              product: true,
              variant: true
            }
          }
        }
      });

      return fullQuotation;
    });

    return c.json(result, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Update quotation error:", error);
    return c.json(
      { message: "Failed to update quotation" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Delete quotation by ID handler
 */
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Check if quotation exists
  const existingQuotation = await db.query.quotations.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingQuotation) {
    return c.json(
      { message: "Quotation not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  try {
    // Delete quotation (items will be deleted automatically due to cascade)
    await db.delete(quotations).where(eq(quotations.id, id));

    return c.json(
      { message: "Quotation deleted successfully" },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Delete quotation error:", error);
    return c.json(
      { message: "Failed to delete quotation" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Update quotation status handler
 */
export const updateStatus: AppRouteHandler<UpdateStatusRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { status, notes } = c.req.valid("json");

  // Check if quotation exists
  const existingQuotation = await db.query.quotations.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingQuotation) {
    return c.json(
      { message: "Quotation not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  try {
    // Update quotation status
    await db
      .update(quotations)
      .set({
        status,
        notes: notes || existingQuotation.notes,
        updatedAt: new Date()
      })
      .where(eq(quotations.id, id));

    // Get the updated quotation with relations
    const fullQuotation = await db.query.quotations.findFirst({
      where: eq(quotations.id, id),
      with: {
        items: {
          with: {
            product: true,
            variant: true
          }
        }
      }
    });

    return c.json(fullQuotation, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Update quotation status error:", error);
    return c.json(
      { message: "Failed to update quotation status" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Generate PDF handler
 */
export const generatePDF: AppRouteHandler<GeneratePDFRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    // Fetch quotation with full details
    const quotation = await db.query.quotations.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        items: {
          with: {
            product: {
              columns: {
                id: true,
                name: true,
                sku: true
              }
            },
            variant: {
              columns: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!quotation) {
      return c.json(
        { message: "Quotation not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Import PDF generator
    const { generateSimpleQuotationPDF } = await import(
      "../../lib/pdf-generator"
    );

    // Generate PDF buffer
    const pdfBuffer = generateSimpleQuotationPDF(
      quotation as Parameters<typeof generateSimpleQuotationPDF>[0]
    );

    // Set headers for PDF download
    c.header("Content-Type", "application/pdf");
    c.header(
      "Content-Disposition",
      `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`
    );
    c.header("Content-Length", pdfBuffer.length.toString());

    return c.body(pdfBuffer);
  } catch (error) {
    console.error("Generate PDF error:", error);
    return c.json(
      { message: "Failed to generate PDF" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get user's quotations handler
 */
export const getUserQuotations: AppRouteHandler<
  GetUserQuotationsRoute
> = async (c) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { message: "User must be authenticated" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
    status
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.quotations.findMany({
    where: (fields, { eq, and, ilike }) => {
      const conditions = [eq(fields.userId, user.id)];

      if (search) {
        conditions.push(ilike(fields.quotationNumber, `%${search}%`));
      }

      if (status) {
        conditions.push(eq(fields.status, status));
      }

      return and(...conditions);
    },
    with: {
      items: {
        with: {
          product: true,
          variant: true
        }
      }
    },
    limit: limitNum,
    offset,
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return [fields.createdAt];
      }
      return [desc(fields.createdAt)];
    }
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(quotations)
    .where(
      and(
        eq(quotations.userId, user.id),
        search ? ilike(quotations.quotationNumber, `%${search}%`) : undefined,
        status ? eq(quotations.status, status) : undefined
      )
    );

  const [quotationEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: quotationEntries,
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
