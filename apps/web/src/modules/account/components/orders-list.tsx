"use client";

import { formatPrice } from "@/components/price";
import { CancelOrder } from "@/features/orders/components/cancel-order";
import { getProductThumbnail } from "@/lib/helpers";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ArrowUpDown, Calendar, Package, Search, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type FilterParams, useGetMyOrders } from "../actions/use-get-orders";

export function AccountOrdersList() {
  const [filterParams, setFilterParams] = useState<FilterParams>({
    limit: 10,
    page: 1,
    search: "",
    sort: "desc"
  });

  const { data, isLoading, error } = useGetMyOrders(filterParams);

  const handleSearchChange = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      search: value,
      page: 1 // Reset to first page when searching
    }));
  };

  const handleSortChange = () => {
    setFilterParams((prev) => ({
      ...prev,
      sort: prev.sort === "desc" ? "asc" : "desc"
    }));
  };

  const handlePageChange = (page: number) => {
    setFilterParams((prev) => ({
      ...prev,
      page
    }));
  };

  const handleLimitChange = (limit: string) => {
    setFilterParams((prev) => ({
      ...prev,
      limit: parseInt(limit),
      page: 1 // Reset to first page when changing limit
    }));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "processing":
        return "default";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      case "refunded":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Orders Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">
            Failed to load orders. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by order number..."
              value={filterParams.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleSortChange}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {filterParams.sort === "desc" ? "Newest First" : "Oldest First"}
          </Button>
          <Select
            value={filterParams.limit?.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {filterParams.search
                ? "No orders match your search criteria."
                : "You haven't placed any orders yet."}
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by order number..."
            value={filterParams.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleSortChange}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          {filterParams.sort === "desc" ? "Newest First" : "Oldest First"}
        </Button>
        <Select
          value={filterParams.limit?.toString()}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {data.data.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {formatPrice(parseFloat(order.totalAmount), "LKR")}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </Badge>
                    <Badge
                      variant={getPaymentStatusBadgeVariant(
                        order.paymentStatus
                      )}
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const thumbnail = getProductThumbnail(item.product);

                  return (
                    <div key={item.id}>
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-medium text-sm hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
                          >
                            {item.productName}
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Variant: {item.variantName}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatPrice(parseFloat(item.unitPrice), "LKR")}{" "}
                              each
                            </span>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-sm font-medium text-right">
                          {formatPrice(parseFloat(item.totalPrice), "LKR")}
                        </div>
                      </div>

                      {/* Separator (except for last item) */}
                      {index < order.items.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <Separator className="my-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Subtotal:</span>
                  <div className="font-medium">
                    {formatPrice(parseFloat(order.subtotal), "LKR")}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Shipping:</span>
                  <div className="font-medium">
                    {parseFloat(order.shippingCost) === 0
                      ? "Free"
                      : formatPrice(parseFloat(order.shippingCost), "LKR")}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Tax:</span>
                  <div className="font-medium">
                    {formatPrice(parseFloat(order.taxAmount), "LKR")}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <div className="font-semibold text-lg">
                    {formatPrice(parseFloat(order.totalAmount), "LKR")}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Shipping Address</h4>
                <p className="text-xs text-muted-foreground">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Order Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/account/orders/${order.id}`}>View Details</Link>
                </Button>
                {order.orderStatus === "pending" && (
                  <CancelOrder orderId={order.id}>
                    <Button variant="outline" size="sm">
                      Cancel Order
                    </Button>
                  </CancelOrder>
                )}
                {order.trackingNumber && (
                  <Button variant="outline" size="sm">
                    Track Package
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(data.meta.currentPage - 1) * data.meta.limit + 1} to{" "}
            {Math.min(
              data.meta.currentPage * data.meta.limit,
              data.meta.totalCount
            )}{" "}
            of {data.meta.totalCount} orders
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.meta.currentPage - 1)}
              disabled={data.meta.currentPage <= 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, data.meta.totalPages) },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={
                        data.meta.currentPage === pageNum
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8"
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}

              {data.meta.totalPages > 5 && (
                <>
                  <span className="text-muted-foreground">...</span>
                  <Button
                    variant={
                      data.meta.currentPage === data.meta.totalPages
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(data.meta.totalPages)}
                    className="w-8 h-8"
                  >
                    {data.meta.totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.meta.currentPage + 1)}
              disabled={data.meta.currentPage >= data.meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
