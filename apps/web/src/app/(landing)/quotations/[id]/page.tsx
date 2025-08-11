"use client";

import { useGetQuotation } from "@/features/quotations/actions/use-get-quotation";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/components/table";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quotationId = params.id as string;

  const { data: quotation, isLoading, error } = useGetQuotation(quotationId);

  const handlePrint = () => {
    const printUrl = `/quotations/${quotationId}/print`;
    window.open(printUrl, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading quotation...</span>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load quotation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">
              {error instanceof Error ? error.message : "Quotation not found"}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Quotation #{quotation.quotationNumber || quotation.id.slice(-8)}
            </h1>
            <p className="text-gray-600">
              {quotation.title || `Quotation for ${quotation.customerName}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(quotation.status)}>
            {quotation.status.charAt(0).toUpperCase() +
              quotation.status.slice(1)}
          </Badge>
          <Button onClick={handlePrint}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View & Print
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">{quotation.customerName}</p>
              {quotation.customerEmail && (
                <p className="text-sm text-gray-600">
                  {quotation.customerEmail}
                </p>
              )}
              {quotation.customerPhone && (
                <p className="text-sm text-gray-600">
                  {quotation.customerPhone}
                </p>
              )}
              {quotation.customerCompany && (
                <p className="text-sm text-gray-600">
                  {quotation.customerCompany}
                </p>
              )}
            </div>
            {quotation.customerAddress && (
              <div className="pt-2 border-t">
                <p className="font-medium text-sm">Address:</p>
                <div className="text-sm text-gray-600">
                  {quotation.customerAddress.street && (
                    <p>{quotation.customerAddress.street}</p>
                  )}
                  {(quotation.customerAddress.city ||
                    quotation.customerAddress.state ||
                    quotation.customerAddress.postalCode) && (
                    <p>
                      {[
                        quotation.customerAddress.city,
                        quotation.customerAddress.state,
                        quotation.customerAddress.postalCode
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {quotation.customerAddress.country && (
                    <p>{quotation.customerAddress.country}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quotation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-medium">Created:</p>
                <p className="text-gray-600">
                  {formatDate(quotation.createdAt)}
                </p>
              </div>
              <div>
                <p className="font-medium">Updated:</p>
                <p className="text-gray-600">
                  {formatDate(quotation.updatedAt || "")}
                </p>
              </div>
              {quotation.validUntil && (
                <div className="col-span-2">
                  <p className="font-medium">Valid Until:</p>
                  <p
                    className={
                      new Date(quotation.validUntil) < new Date()
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {formatDate(quotation.validUntil)}
                  </p>
                </div>
              )}
            </div>
            {quotation.description && (
              <div className="pt-2 border-t">
                <p className="font-medium text-sm">Description:</p>
                <p className="text-sm text-gray-600">{quotation.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${parseFloat(quotation.subtotal).toFixed(2)}</span>
              </div>
              {parseFloat(quotation.discountAmount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>
                    -${parseFloat(quotation.discountAmount).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${parseFloat(quotation.taxAmount).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span>${parseFloat(quotation.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>
            {quotation.items.length} item
            {quotation.items.length !== 1 ? "s" : ""} in this quotation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotation.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      {item.notes && (
                        <p className="text-sm text-gray-600">{item.notes}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.productSku || "-"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {item.variantName || "-"}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${parseFloat(item.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${parseFloat(item.totalPrice).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes and Terms */}
      {(quotation.notes || quotation.terms) && (
        <div className="grid gap-6 md:grid-cols-2">
          {quotation.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {quotation.notes}
                </p>
              </CardContent>
            </Card>
          )}
          {quotation.terms && (
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {quotation.terms}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
