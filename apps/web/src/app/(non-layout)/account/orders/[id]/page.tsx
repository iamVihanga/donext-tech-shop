"use client";

import { formatPrice } from "@/components/price";
import { CancelOrder } from "@/features/orders/components/cancel-order";
import { getProductThumbnail } from "@/lib/helpers";
import { useGetOrderByID } from "@/modules/account/actions/use-get-order-by-id";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function SingleOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, error, isLoading } = useGetOrderByID(params.id);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Status History Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Order Summary Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Customer Info Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>

        {/* Error State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button asChild>
              <Link href="/account/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 p-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>

        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Order Data</h3>
            <p className="text-muted-foreground text-center mb-4">
              Unable to load order information. Please try again later.
            </p>
            <Button asChild>
              <Link href="/account/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = data;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
              <p className="text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold">
            {formatPrice(parseFloat(order.totalAmount), "LKR")}
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
              {order.orderStatus.charAt(0).toUpperCase() +
                order.orderStatus.slice(1)}
            </Badge>
            <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
              {order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const thumbnail = getProductThumbnail(item.product);

                  return (
                    <div key={item.id}>
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-semibold hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                          >
                            {item.productName}
                          </Link>

                          {item.product.shortDescription && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.product.shortDescription}
                            </p>
                          )}

                          {item.variantName && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Variant:</span>{" "}
                              {item.variantName}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>
                              <span className="font-medium">SKU:</span>{" "}
                              {item.productSku}
                            </span>
                            <span>
                              <span className="font-medium">Qty:</span>{" "}
                              {item.quantity}
                            </span>
                            <span>
                              <span className="font-medium">Unit Price:</span>{" "}
                              {formatPrice(parseFloat(item.unitPrice), "LKR")}
                            </span>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            {formatPrice(parseFloat(item.totalPrice), "LKR")}
                          </div>
                        </div>
                      </div>

                      {index < order.items.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {order.statusHistory &&
                  order.statusHistory.map((status, index) => (
                    <div key={status.id} className="flex gap-4 pb-4">
                      {/* Timeline Line */}
                      <div className="relative flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        {index < (order.statusHistory || []).length - 1 && (
                          <div className="w-0.5 h-8 bg-border mt-2" />
                        )}
                      </div>

                      {/* Status Info */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getStatusBadgeVariant(status.toStatus)}
                          >
                            {status.toStatus.charAt(0).toUpperCase() +
                              status.toStatus.slice(1)}
                          </Badge>
                          {status.fromStatus && (
                            <span className="text-sm text-muted-foreground">
                              (from {status.fromStatus})
                            </span>
                          )}
                        </div>

                        {status.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {status.notes}
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(status.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(parseFloat(order.subtotal), "LKR")}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  {parseFloat(order.shippingCost) === 0
                    ? "Free"
                    : formatPrice(parseFloat(order.shippingCost), "LKR")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatPrice(parseFloat(order.taxAmount), "LKR")}</span>
              </div>

              {parseFloat(order.discountAmount) > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span>
                    -{formatPrice(parseFloat(order.discountAmount), "LKR")}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatPrice(parseFloat(order.totalAmount), "LKR")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerEmail}</span>
              </div>

              {order.customerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Method:</span>
                <span className="capitalize">
                  {order.paymentMethod?.replace("_", " ")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge
                  variant={getPaymentStatusBadgeVariant(order.paymentStatus)}
                  className="text-xs"
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </Badge>
              </div>

              {order.paymentIntentId && (
                <div className="flex justify-between text-sm">
                  <span>Payment ID:</span>
                  <span className="font-mono text-xs">
                    {order.paymentIntentId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.customerName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>

              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tracking Number</p>
                      <p className="font-mono">{order.trackingNumber}</p>
                      {order.carrierName && (
                        <p className="text-muted-foreground">
                          via {order.carrierName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Address (if different) */}
          {order.billingAddress &&
            JSON.stringify(order.billingAddress) !==
              JSON.stringify(order.shippingAddress) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.customerName}</p>
                    <p>{order.billingAddress.street}</p>
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.postalCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {order.orderStatus === "pending" && (
              <CancelOrder orderId={order.id}>
                <Button variant="destructive" className="w-full">
                  Cancel Order
                </Button>
              </CancelOrder>
            )}

            {order.trackingNumber && (
              <Button variant="outline" className="w-full">
                Track Package
              </Button>
            )}

            <Button variant="outline" className="w-full">
              Download Quotation
            </Button>

            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
