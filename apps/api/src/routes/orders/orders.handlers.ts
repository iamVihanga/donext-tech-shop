/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import {
  cartItems,
  carts,
  generateOrderNumber,
  orderItems,
  orders,
  orderStatusHistory,
  products,
  productVariants
} from "@repo/database";

import type {
  CalculateTotalsRoute,
  CancelOrderRoute,
  CheckoutRoute,
  GetOrderByIdRoute,
  GetUserOrdersRoute,
  ListRoute,
  UpdateOrderStatusRoute
} from "./orders.routes";

/**
 * List all orders (admin only)
 */
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.get("user");
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    status,
    paymentStatus,
    userId
  } = c.req.valid("query");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      { message: "Forbidden: Admins only can access this route" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build where conditions
  const whereConditions = [];
  if (status) {
    whereConditions.push(eq(orders.orderStatus, status));
  }
  if (paymentStatus) {
    whereConditions.push(eq(orders.paymentStatus, paymentStatus));
  }
  if (userId) {
    whereConditions.push(eq(orders.userId, userId));
  }

  const whereClause =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  // Get orders with pagination
  const ordersList = await db.query.orders.findMany({
    where: whereClause,
    with: {
      items: {
        with: {
          product: {
            with: {
              images: true,
              variants: true
            }
          },
          variant: true
        }
      },
      statusHistory: {
        orderBy: (fields) => desc(fields.createdAt)
      }
    },
    limit: limitNum,
    offset,
    orderBy: (fields) => {
      return sort === "desc" ? desc(fields.createdAt) : fields.createdAt;
    }
  });

  console.log({ ordersList });

  // Get total count for pagination
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(whereClause);

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: ordersList,
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
 * Get user's orders
 */
export const getUserOrders: AppRouteHandler<GetUserOrdersRoute> = async (c) => {
  const user = c.get("user");
  const { page = "1", limit = "10", sort = "desc" } = c.req.valid("query");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Get user's orders with pagination
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    with: {
      items: {
        with: {
          product: {
            with: {
              images: true,
              variants: true
            }
          },
          variant: true
        }
      },
      statusHistory: {
        orderBy: (fields) => desc(fields.createdAt)
      }
    },
    limit: limitNum,
    offset,
    orderBy: (fields) => {
      return sort === "desc" ? desc(fields.createdAt) : fields.createdAt;
    }
  });

  // Get total count for pagination
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.userId, user.id));

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: userOrders,
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
 * Get order by ID
 */
export const getOrderById: AppRouteHandler<GetOrderByIdRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: {
        with: {
          product: {
            with: {
              images: true,
              variants: true
            }
          },
          variant: true
        }
      },
      statusHistory: {
        orderBy: (fields) => desc(fields.createdAt)
      }
    }
  });

  if (!order) {
    return c.json({ message: "Order not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check if user can access this order (owner or admin)
  if (user.role !== "admin" && order.userId !== user.id) {
    return c.json(
      { message: "You don't have permission to view this order" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  return c.json(order, HttpStatusCodes.OK);
};

/**
 * Calculate order totals from current cart
 */
export const calculateTotals: AppRouteHandler<CalculateTotalsRoute> = async (
  c
) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Get user's cart with items
  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
    with: {
      items: {
        with: {
          product: true,
          variant: true
        }
      }
    }
  });

  if (!userCart || !userCart.items || userCart.items.length === 0) {
    return c.json(
      { message: "Empty cart or invalid cart items" },
      HttpStatusCodes.BAD_REQUEST
    );
  }

  // Calculate totals
  let subtotal = 0;
  let itemCount = 0;

  for (const item of userCart.items) {
    const price = item.variant?.price || item.product.price;
    const itemTotal = parseFloat(price) * item.quantity;
    subtotal += itemTotal;
    itemCount += item.quantity;
  }

  // Calculate additional charges
  const shippingCost = calculateShippingCost(subtotal); // You can implement shipping logic
  const taxAmount = calculateTaxAmount(subtotal); // You can implement tax logic
  const discountAmount = 0; // You can implement discount logic
  const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

  return c.json(
    {
      subtotal,
      shippingCost,
      taxAmount,
      discountAmount,
      totalAmount,
      itemCount
    },
    HttpStatusCodes.OK
  );
};

/**
 * Checkout cart and create order
 */
export const checkout: AppRouteHandler<CheckoutRoute> = async (c) => {
  const user = c.get("user");
  const checkoutData = c.req.valid("json");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Get user's cart with items
  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
    with: {
      items: {
        with: {
          product: true,
          variant: true
        }
      }
    }
  });

  if (!userCart || !userCart.items || userCart.items.length === 0) {
    return c.json(
      { message: "Invalid checkout data or empty cart" },
      HttpStatusCodes.BAD_REQUEST
    );
  }

  // Validate stock availability
  for (const item of userCart.items) {
    const currentStock =
      item.variant?.stockQuantity || item.product.stockQuantity || 0;

    if (currentStock < item.quantity) {
      return c.json(
        { message: `Insufficient stock for ${item.product.name}` },
        HttpStatusCodes.BAD_REQUEST
      );
    }
  }

  // Calculate totals
  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    variantId: string | null;
    productName: string;
    variantName: string | null;
    productSku: string | null;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    productSnapshot: {
      product: {
        tags: string | null;
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        id: string;
        slug: string;
        shortDescription: string | null;
        price: string;
        sku: string | null;
        reservedQuantity: number | null;
        stockQuantity: number | null;
        minStockLevel: number | null;
        weight: string | null;
        dimensions: string | null;
        categoryId: string;
        subcategoryId: string | null;
        isActive: boolean | null;
        isFeatured: boolean | null;
        requiresShipping: boolean | null;
        metaTitle: string | null;
        metaDescription: string | null;
      };
      variant: {
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        id: string;
        productId: string;
        price: string | null;
        sku: string | null;
        stockQuantity: number | null;
        isActive: boolean | null;
        comparePrice: string | null;
        attributes: string | null;
      } | null;
    };
  }[] = [];

  for (const item of userCart.items) {
    const price = item.variant?.price || item.product.price;
    const itemTotal = parseFloat(price) * item.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      variantName: item.variant?.name || null,
      productSku: item.variant?.sku || item.product.sku,
      quantity: item.quantity,
      unitPrice: price,
      totalPrice: itemTotal.toFixed(2),
      productSnapshot: {
        product: item.product,
        variant: item.variant
      }
    });
  }

  const shippingCost = calculateShippingCost(subtotal);
  const taxAmount = calculateTaxAmount(subtotal);
  const discountAmount = 0; // Implement discount logic if needed
  const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

  // Use billing address if provided, otherwise use shipping address
  const billingAddress =
    checkoutData.billingAddress || checkoutData.shippingAddress;

  try {
    // Create order in a transaction
    const result = await db.transaction(async (trx) => {
      // Create order
      const [newOrder] = await trx
        .insert(orders)
        .values({
          orderNumber: generateOrderNumber(),
          userId: user.id,
          customerEmail: checkoutData.customerEmail,
          customerName: checkoutData.customerName,
          customerPhone: checkoutData.customerPhone,
          subtotal: subtotal.toFixed(2),
          shippingCost: shippingCost.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          orderStatus: "pending",
          paymentStatus: "pending",
          shippingAddress: checkoutData.shippingAddress,
          billingAddress: billingAddress,
          paymentMethod: checkoutData.paymentMethod,
          notes: checkoutData.notes
        })
        .returning();

      if (!newOrder) {
        throw new Error("Order creation failed");
      }

      // Create order items
      const createdOrderItems = await trx
        .insert(orderItems)
        .values(
          orderItemsData.map((item) => ({
            orderId: newOrder.id,
            ...item
          }))
        )
        .returning();

      // Create initial status history entry
      await trx.insert(orderStatusHistory).values({
        orderId: newOrder.id,
        fromStatus: null,
        toStatus: "pending",
        notes: "Order created",
        changedBy: user.id
      });

      // Update product stock
      for (const item of userCart.items) {
        if (item.variantId) {
          // Update variant stock
          await trx
            .update(productVariants)
            .set({
              stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}`
            })
            .where(eq(productVariants.id, item.variantId));
        } else {
          // Update product stock
          await trx
            .update(products)
            .set({
              stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`
            })
            .where(eq(products.id, item.productId));
        }
      }

      // Clear user's cart
      await trx.delete(cartItems).where(eq(cartItems.cartId, userCart.id));

      return { newOrder, createdOrderItems };
    });

    // Fetch the complete order with relations
    const completeOrder = await db.query.orders.findFirst({
      where: eq(orders.id, result.newOrder.id),
      with: {
        items: {
          with: {
            product: true,
            variant: true
          }
        },
        statusHistory: {
          orderBy: (fields) => desc(fields.createdAt)
        }
      }
    });

    return c.json(completeOrder, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Checkout error:", error);
    return c.json(
      { message: "Something went wrong during checkout" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatus: AppRouteHandler<
  UpdateOrderStatusRoute
> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const updateData = c.req.valid("json");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      { message: "Forbidden: Admins only can update order status" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Get current order
  const currentOrder = await db.query.orders.findFirst({
    where: eq(orders.id, id)
  });

  if (!currentOrder) {
    return c.json({ message: "Order not found" }, HttpStatusCodes.NOT_FOUND);
  }

  try {
    await db.transaction(async (trx) => {
      // Update order
      const updateFields: any = {};

      if (updateData.orderStatus) {
        updateFields.orderStatus = updateData.orderStatus;

        // Set special timestamps based on status
        if (updateData.orderStatus === "shipped") {
          updateFields.shippedAt = new Date();
        } else if (updateData.orderStatus === "delivered") {
          updateFields.deliveredAt = new Date();
        } else if (updateData.orderStatus === "cancelled") {
          updateFields.cancelledAt = new Date();
        }
      }

      if (updateData.paymentStatus) {
        updateFields.paymentStatus = updateData.paymentStatus;
      }

      if (updateData.trackingNumber) {
        updateFields.trackingNumber = updateData.trackingNumber;
      }

      if (updateData.carrierName) {
        updateFields.carrierName = updateData.carrierName;
      }

      await trx.update(orders).set(updateFields).where(eq(orders.id, id));

      // Create status history entry
      if (
        updateData.orderStatus &&
        updateData.orderStatus !== currentOrder.orderStatus
      ) {
        await trx.insert(orderStatusHistory).values({
          orderId: id,
          fromStatus: currentOrder.orderStatus,
          toStatus: updateData.orderStatus,
          notes:
            updateData.notes || `Status updated to ${updateData.orderStatus}`,
          changedBy: user.id
        });
      }
    });

    // Fetch updated order
    const updatedOrder = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true,
            variant: true
          }
        },
        statusHistory: {
          orderBy: (fields) => desc(fields.createdAt)
        }
      }
    });

    return c.json(updatedOrder, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Update order status error:", error);
    return c.json(
      { message: "Something went wrong" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Cancel order
 */
export const cancelOrder: AppRouteHandler<CancelOrderRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const { reason } = c.req.valid("json");

  if (!user) {
    return c.json(
      { message: "Unauthorized: User not found" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Get current order
  const currentOrder = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: {
        with: {
          product: true,
          variant: true
        }
      }
    }
  });

  if (!currentOrder) {
    return c.json({ message: "Order not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Check if user can cancel this order (owner or admin)
  if (user.role !== "admin" && currentOrder.userId !== user.id) {
    return c.json(
      { message: "You don't have permission to cancel this order" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check if order can be cancelled
  const cancellableStatuses = ["pending", "confirmed"];
  if (!cancellableStatuses.includes(currentOrder.orderStatus)) {
    return c.json(
      { message: "Order cannot be cancelled" },
      HttpStatusCodes.BAD_REQUEST
    );
  }

  try {
    await db.transaction(async (trx) => {
      // Update order status
      await trx
        .update(orders)
        .set({
          orderStatus: "cancelled",
          cancelledAt: new Date()
        })
        .where(eq(orders.id, id));

      // Create status history entry
      await trx.insert(orderStatusHistory).values({
        orderId: id,
        fromStatus: currentOrder.orderStatus,
        toStatus: "cancelled",
        notes: reason || "Order cancelled by user",
        changedBy: user.id
      });

      // Restore product stock
      for (const item of currentOrder.items) {
        if (item.variantId) {
          // Restore variant stock
          await trx
            .update(productVariants)
            .set({
              stockQuantity: sql`${productVariants.stockQuantity} + ${item.quantity}`
            })
            .where(eq(productVariants.id, item.variantId));
        } else {
          // Restore product stock
          await trx
            .update(products)
            .set({
              stockQuantity: sql`${products.stockQuantity} + ${item.quantity}`
            })
            .where(eq(products.id, item.productId));
        }
      }
    });

    // Fetch updated order
    const cancelledOrder = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true,
            variant: true
          }
        },
        statusHistory: {
          orderBy: (fields) => desc(fields.createdAt)
        }
      }
    });

    return c.json(cancelledOrder, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Cancel order error:", error);
    return c.json(
      { message: "Something went wrong" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Helper functions

function calculateShippingCost(subtotal: number): number {
  // Simple shipping logic - free shipping over $100
  if (subtotal >= 100) {
    return 0;
  }
  return 10; // $10 flat rate
}

function calculateTaxAmount(subtotal: number): number {
  // Simple tax calculation - 8.25% tax rate
  return subtotal * 0.0825;
}
