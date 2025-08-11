"use client";

import { useCreateQuotation } from "@/features/quotations/actions/use-create-quotation";
import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { getProductThumbnail } from "@/lib/helpers";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import jsPDF from "jspdf";
import { Download, FileText, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  className?: string;
}

export function QuotationDropdown({ className }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const createQuotationMutation = useCreateQuotation();
  const {
    items,
    updateItemQuantity,
    removeItem,
    totals,
    customerInfo,
    quotationDetails,
    clearQuotation
  } = useQuotationStore();

  const itemCount = items.length;
  const totalPrice = totals.totalAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateItemQuantity(itemId, newQuantity);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (items.length === 0) {
      toast.error("Please add items to quotation before downloading");
      return;
    }

    // Validate customer information - provide defaults if empty but ensure they're valid
    const finalCustomerName =
      customerInfo.customerName?.trim() || "Guest Customer";
    const finalCustomerEmail =
      customerInfo.customerEmail?.trim() || "guest@gamezonetech.com";
    const finalTitle =
      quotationDetails.title?.trim() || "Product Quotation Request";

    setIsDownloading(true);
    try {
      // Step 1: Save quotation to database first
      const quotationNumber = `QT-${Date.now()}`;

      // Prepare quotation data for saving with proper validation
      const quotationData = {
        customerName: finalCustomerName,
        customerEmail: finalCustomerEmail,
        customerPhone: customerInfo.customerPhone?.trim() || null,
        customerCompany: customerInfo.customerCompany?.trim() || null,
        customerAddress: customerInfo.customerAddress.street?.trim()
          ? {
              street: customerInfo.customerAddress.street.trim(),
              city: customerInfo.customerAddress.city?.trim() || undefined,
              state: customerInfo.customerAddress.state?.trim() || undefined,
              postalCode:
                customerInfo.customerAddress.postalCode?.trim() || undefined,
              country: customerInfo.customerAddress.country?.trim() || undefined
            }
          : null,
        title: finalTitle,
        description: quotationDetails.description?.trim() || null,
        validUntil: quotationDetails.validUntil || null,
        notes: quotationDetails.notes?.trim() || null,
        terms: quotationDetails.terms?.trim() || null,
        subtotal: totals.subtotal.toFixed(2),
        taxAmount: totals.taxAmount.toFixed(2),
        discountAmount: totals.discountAmount.toFixed(2),
        totalAmount: totals.totalAmount.toFixed(2),
        status: "draft" as const,
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant?.id || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2),
          totalPrice: item.totalPrice.toFixed(2),
          productName: item.product.name,
          productSku: item.product.sku || null,
          variantName: item.variant?.name || null,
          notes: item.notes?.trim() || null
        }))
      };

      console.log("Sending quotation data:", quotationData);

      // Save to database
      const savedQuotation =
        await createQuotationMutation.mutateAsync(quotationData);

      // Step 2: Generate PDF with saved quotation number
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text
      const addText = (
        text: string,
        x: number,
        y: number,
        options: any = {}
      ) => {
        pdf.setFontSize(options.fontSize || 10);
        pdf.setFont("helvetica", options.fontStyle || "normal");
        pdf.text(text, x, y);
        return y + (options.lineHeight || 6);
      };

      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, "F");

      yPosition += 8;
      addText("GAMEZONE TECH", margin + 5, yPosition, {
        fontSize: 16,
        fontStyle: "bold"
      });
      addText("Your Technology Partner", margin + 5, yPosition + 6, {
        fontSize: 10
      });

      addText("QUOTATION", pageWidth - 60, yPosition, {
        fontSize: 14,
        fontStyle: "bold"
      });
      addText(
        `#${savedQuotation.quotationNumber}`,
        pageWidth - 60,
        yPosition + 6,
        {
          fontSize: 10
        }
      );
      addText(
        `Date: ${new Date().toLocaleDateString()}`,
        pageWidth - 60,
        yPosition + 12,
        { fontSize: 10 }
      );

      yPosition += 30;

      // Quotation Details
      if (quotationDetails.title || quotationDetails.description) {
        checkNewPage(25);
        addText("QUOTATION DETAILS", margin, yPosition, {
          fontSize: 12,
          fontStyle: "bold"
        });
        yPosition += 8;

        if (quotationDetails.title) {
          addText(`Title: ${quotationDetails.title}`, margin, yPosition);
          yPosition += 6;
        }
        if (quotationDetails.description) {
          addText(
            `Description: ${quotationDetails.description}`,
            margin,
            yPosition
          );
          yPosition += 6;
        }
        yPosition += 10;
      }

      // Items Header
      checkNewPage(50);
      addText("ITEMS", margin, yPosition, { fontSize: 12, fontStyle: "bold" });
      yPosition += 10;

      // Table Header
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F");

      addText("#", margin + 2, yPosition + 5, {
        fontSize: 9,
        fontStyle: "bold"
      });
      addText("ITEM", margin + 15, yPosition + 5, {
        fontSize: 9,
        fontStyle: "bold"
      });
      addText("QTY", margin + 110, yPosition + 5, {
        fontSize: 9,
        fontStyle: "bold"
      });
      addText("UNIT PRICE", margin + 130, yPosition + 5, {
        fontSize: 9,
        fontStyle: "bold"
      });
      addText("TOTAL", margin + 160, yPosition + 5, {
        fontSize: 9,
        fontStyle: "bold"
      });

      yPosition += 12;

      // Items
      items.forEach((item, index) => {
        checkNewPage(15);

        // Alternate row background
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 12, "F");
        }

        addText((index + 1).toString(), margin + 2, yPosition + 3, {
          fontSize: 9
        });

        // Product name (truncate if too long)
        let productName = item.product.name;
        if (productName.length > 35) {
          productName = productName.substring(0, 32) + "...";
        }
        addText(productName, margin + 15, yPosition + 3, { fontSize: 9 });

        if (item.variant?.name) {
          addText(`(${item.variant.name})`, margin + 15, yPosition + 8, {
            fontSize: 8
          });
        }

        addText(item.quantity.toString(), margin + 115, yPosition + 3, {
          fontSize: 9
        });
        addText(formatCurrency(item.unitPrice), margin + 130, yPosition + 3, {
          fontSize: 9
        });
        addText(formatCurrency(item.totalPrice), margin + 160, yPosition + 3, {
          fontSize: 9,
          fontStyle: "bold"
        });

        yPosition += 15;
      });

      // Totals
      yPosition += 10;
      checkNewPage(25);

      pdf.setDrawColor(0, 0, 0);
      pdf.line(margin + 120, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      addText(`Total Items: ${totalItems}`, margin + 120, yPosition, {
        fontSize: 10
      });
      yPosition += 8;
      addText(
        `TOTAL AMOUNT: ${formatCurrency(totalPrice)}`,
        margin + 120,
        yPosition,
        { fontSize: 12, fontStyle: "bold" }
      );

      // Notes
      if (quotationDetails.notes) {
        yPosition += 20;
        checkNewPage(30);
        addText("NOTES", margin, yPosition, {
          fontSize: 12,
          fontStyle: "bold"
        });
        yPosition += 8;

        // Split notes into lines
        const notes = quotationDetails.notes;
        const maxWidth = pageWidth - 2 * margin;
        const splitNotes = pdf.splitTextToSize(notes, maxWidth);

        splitNotes.forEach((line: string) => {
          checkNewPage(6);
          addText(line, margin, yPosition, { fontSize: 9 });
          yPosition += 5;
        });
      }

      // Footer
      yPosition = pageHeight - 30;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      const footerText = "Thank you for your business!";
      const footerWidth = pdf.getTextWidth(footerText);
      addText(footerText, (pageWidth - footerWidth) / 2, yPosition, {
        fontSize: 10
      });
      yPosition += 5;

      const timestampText = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
      const timestampWidth = pdf.getTextWidth(timestampText);
      addText(timestampText, (pageWidth - timestampWidth) / 2, yPosition, {
        fontSize: 8
      });

      // Download the PDF
      pdf.save(`Quotation-${savedQuotation.quotationNumber}.pdf`);
      toast.success("Quotation saved and PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        "Failed to save quotation or generate PDF. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (items.length === 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("relative", className)}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Quotation</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-4 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              Your quotation is empty
            </p>
            <Link href="/shop">
              <Button size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("relative", className)}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Quotation</span>
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Quotation Items</h3>
            <Badge variant="secondary">{totalItems} items</Badge>
          </div>

          <ScrollArea className="max-h-64 mb-4">
            <div className="space-y-3">
              {items.map((item) => {
                const thumbnail = getProductThumbnail(item.product);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 border rounded-lg"
                  >
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                      {thumbnail && (
                        <Image
                          src={thumbnail}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <DropdownMenuSeparator />

          <div className="flex justify-between items-center font-semibold mb-4">
            <span>Total:</span>
            <span className="text-lg">{formatCurrency(totalPrice)}</span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Generating PDF..." : "Download Quotation"}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Link href="/quotations" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Quotation
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearQuotation();
                  toast.success("Quotation cleared");
                }}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
