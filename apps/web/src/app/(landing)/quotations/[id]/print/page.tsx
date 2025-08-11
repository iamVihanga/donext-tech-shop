"use client";

import { useGetQuotation } from "@/features/quotations/actions/use-get-quotation";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeftIcon, DownloadIcon, PrinterIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function QuotationPrintPage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const quotationId = params.id as string;

  const { data: quotation, isLoading, error } = useGetQuotation(quotationId);

  const handlePrint = useReactToPrint({
    // content: () => printRef.current,
    contentRef: printRef,
    documentTitle: `Quotation-${quotation?.quotationNumber || quotationId}`,
    // onBeforeGetContent: () => {
    //   // Hide the action buttons before printing
    //   const actionButtons = document.getElementById("action-buttons");
    //   if (actionButtons) {
    //     actionButtons.style.display = "none";
    //   }
    // },
    onAfterPrint: () => {
      // Show the action buttons after printing
      const actionButtons = document.getElementById("action-buttons");
      if (actionButtons) {
        actionButtons.style.display = "block";
      }
    }
  });

  const handleDownloadPDF = async () => {
    if (!printRef.current || !quotation) return;

    try {
      // Hide action buttons before capturing
      const actionButtons = document.getElementById("action-buttons");
      if (actionButtons) {
        actionButtons.style.display = "none";
      }

      // Create canvas from the quotation content
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff"
      });

      // Show action buttons again
      if (actionButtons) {
        actionButtons.style.display = "block";
      }

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`Quotation-${quotation.quotationNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to print
      handlePrint();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">
            {error?.message || "Quotation not found"}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Buttons - Hidden during print */}
      <div
        id="action-buttons"
        className="sticky top-0 z-10 bg-white border-b shadow-sm p-4 print:hidden"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Quotations
          </Button>

          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Quotation Content */}
      <div className="p-8">
        <div
          ref={printRef}
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg"
        >
          <QuotationPrintTemplate quotation={quotation} />
        </div>
      </div>
    </div>
  );
}

// Quotation Print Template Component
interface QuotationPrintTemplateProps {
  quotation: any; // Replace with your quotation type
}

function QuotationPrintTemplate({ quotation }: QuotationPrintTemplateProps) {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR"
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="p-8 print:p-6">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GameZone Tech
            </h1>
            <p className="text-gray-600">Your Technology Partner</p>
            <p className="text-sm text-gray-500 mt-2">
              Email: info@gamezonetech.com | Phone: +94 XXX XXX XXX
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">QUOTATION</h2>
            <p className="text-lg font-semibold">
              #{quotation.quotationNumber}
            </p>
            <p className="text-sm text-gray-600">
              Date: {formatDate(quotation.createdAt)}
            </p>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  quotation.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : quotation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : quotation.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {quotation.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Bill To:</h3>
          <div className="space-y-1">
            <p className="font-medium">{quotation.customerName}</p>
            {quotation.customerCompany && (
              <p className="text-gray-600">{quotation.customerCompany}</p>
            )}
            <p className="text-gray-600">{quotation.customerEmail}</p>
            {quotation.customerPhone && (
              <p className="text-gray-600">{quotation.customerPhone}</p>
            )}
            {quotation.customerAddress && (
              <div className="text-gray-600 text-sm mt-2">
                {quotation.customerAddress.street && (
                  <p>{quotation.customerAddress.street}</p>
                )}
                {(quotation.customerAddress.city ||
                  quotation.customerAddress.state) && (
                  <p>
                    {quotation.customerAddress.city}
                    {quotation.customerAddress.city &&
                      quotation.customerAddress.state &&
                      ", "}
                    {quotation.customerAddress.state}
                  </p>
                )}
                {quotation.customerAddress.postalCode && (
                  <p>{quotation.customerAddress.postalCode}</p>
                )}
                {quotation.customerAddress.country && (
                  <p>{quotation.customerAddress.country}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            Quotation Details:
          </h3>
          <div className="space-y-1 text-sm">
            {quotation.title && (
              <p>
                <span className="font-medium">Title:</span> {quotation.title}
              </p>
            )}
            {quotation.validUntil && (
              <p>
                <span className="font-medium">Valid Until:</span>{" "}
                {formatDate(quotation.validUntil)}
              </p>
            )}
            <p>
              <span className="font-medium">Created:</span>{" "}
              {formatDate(quotation.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {quotation.description && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Description:
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {quotation.description}
          </p>
        </div>
      )}

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Items:</h3>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotation.items?.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.product?.name || item.productName}
                      </p>
                      {item.productSku && (
                        <p className="text-xs text-gray-500">
                          SKU: {item.productSku}
                        </p>
                      )}
                      {item.variant?.name && (
                        <p className="text-xs text-gray-600">
                          Variant: {item.variant.name}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-xs text-gray-600 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-center">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(quotation.subtotal)}</span>
              </div>

              {parseFloat(quotation.discountAmount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(quotation.discountAmount)}</span>
                </div>
              )}

              {parseFloat(quotation.taxAmount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(quotation.taxAmount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">
                    {formatCurrency(quotation.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {quotation.notes && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Notes:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {quotation.notes}
            </p>
          </div>
        </div>
      )}

      {/* Terms */}
      {quotation.terms && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Terms & Conditions:
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {quotation.terms}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6 mt-8">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">Thank you for your business!</p>
          <p>
            This is a computer-generated quotation and does not require a
            signature.
          </p>
          <p className="mt-4">
            Generated on {new Date().toLocaleDateString("en-LK")} at{" "}
            {new Date().toLocaleTimeString("en-LK")}
          </p>
        </div>
      </div>
    </div>
  );
}
