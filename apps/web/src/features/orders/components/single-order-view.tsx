"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Textarea } from "@repo/ui/components/textarea";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  History,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShoppingCart,
  User,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OrderWithItems } from "../schemas/orders.schema";

type Props = {
  order: OrderWithItems;
};

export default function SingleOrderView({ order }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );
  const [carrierName, setCarrierName] = useState(order.carrierName || "");
  const [notes, setNotes] = useState("");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
      case "processing":
        return "default";
      case "shipped":
      case "delivered":
        return "default";
      case "cancelled":
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
      case "refunded":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price: string, currency: string = "LKR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "LKR" ? "USD" : currency,
      minimumFractionDigits: 2
    }).format(parseFloat(price));
  };

  const getProductThumbnail = (product: any) => {
    return (
      product.images?.find((img: any) => img.isThumbnail)?.imageUrl ||
      product.images?.[0]?.imageUrl ||
      null
    );
  };

  const handleSaveChanges = async () => {
    // TODO: Implement API call to update order
    console.log("Saving changes:", {
      orderStatus,
      paymentStatus,
      trackingNumber,
      carrierName,
      notes
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
    setTrackingNumber(order.trackingNumber || "");
    setCarrierName(order.carrierName || "");
    setNotes("");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Badge
              variant={getStatusBadgeVariant(order.orderStatus)}
              className="capitalize"
            >
              {order.orderStatus}
            </Badge>
            <Badge
              variant={getPaymentStatusBadgeVariant(order.paymentStatus)}
              className="capitalize"
            >
              {order.paymentStatus}
            </Badge>
          </div>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Order
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSaveChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
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
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {item.productName}
                              </h3>

                              {item.product.shortDescription && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.product.shortDescription}
                                </p>
                              )}

                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>
                                  <span className="font-medium">SKU:</span>{" "}
                                  {item.productSku}
                                </span>
                                {item.variantName && (
                                  <span>
                                    <span className="font-medium">
                                      Variant:
                                    </span>{" "}
                                    {item.variantName}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>
                                  <span className="font-medium">Quantity:</span>{" "}
                                  {item.quantity}
                                </span>
                                <span>
                                  <span className="font-medium">
                                    Unit Price:
                                  </span>{" "}
                                  {formatPrice(item.unitPrice)}
                                </span>
                                <span>
                                  <span className="font-medium">Weight:</span>{" "}
                                  {item.product.weight}kg
                                </span>
                              </div>

                              {/* Product Actions */}
                              <div className="flex gap-2 mt-3">
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={`/admin/products/${item.product.id}`}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Product
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={`/products/${item.product.slug}`}
                                    target="_blank"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Preview
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <div className="font-semibold text-xl">
                                {formatPrice(item.totalPrice)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.quantity} × {formatPrice(item.unitPrice)}
                              </div>
                            </div>
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

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {order.statusHistory?.map((status, index) => (
                  <div key={status.id} className="flex gap-4 pb-6">
                    {/* Timeline Line */}
                    <div className="relative flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      {index < (order.statusHistory?.length || 0) - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2" />
                      )}
                    </div>

                    {/* Status Info */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(status.toStatus)}
                          className="capitalize"
                        >
                          {status.toStatus}
                        </Badge>
                        {status.fromStatus && (
                          <span className="text-sm text-muted-foreground">
                            (from {status.fromStatus})
                          </span>
                        )}
                      </div>

                      {status.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {status.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(status.createdAt)}</span>
                        {status.changedBy && (
                          <>
                            <span>•</span>
                            <span>by {status.changedBy}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {(order.notes || isEditing) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.notes && !isEditing ? (
                  <p className="text-sm">{order.notes}</p>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Add Note</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add a note about this order..."
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Management */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Update Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderStatus">Order Status</Label>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={setPaymentStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="partially_refunded">
                        Partially Refunded
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carrierName">Carrier Name</Label>
                  <Input
                    id="carrierName"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    placeholder="Enter carrier name"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  {parseFloat(order.shippingCost) === 0
                    ? "Free"
                    : formatPrice(order.shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>

              {parseFloat(order.discountAmount) > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
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
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {order.customerEmail}
                </a>
              </div>

              {order.customerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.customerPhone}
                  </a>
                </div>
              )}

              {order.userId && (
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href={`/admin/customers/${order.userId}`}>
                      View Customer Profile
                    </Link>
                  </Button>
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
                  className="text-xs capitalize"
                >
                  {order.paymentStatus}
                </Badge>
              </div>

              {order.paymentIntentId && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">
                    Payment Intent ID:
                  </span>
                  <p className="font-mono text-xs text-muted-foreground break-all">
                    {order.paymentIntentId}
                  </p>
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
                <p className="text-muted-foreground">
                  {order.shippingAddress.country}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
