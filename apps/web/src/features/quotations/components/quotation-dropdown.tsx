"use client";

import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { getProductThumbnail } from "@/lib/helpers";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import html2canvas from "html2canvas";
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

    setIsDownloading(true);
    try {
      // Create a temporary div for PDF content
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.style.backgroundColor = "white";
      tempDiv.style.padding = "40px";
      tempDiv.style.fontFamily = "Arial, sans-serif";

      // Create PDF content HTML
      const currentDate = new Date().toLocaleDateString();
      const quotationNumber = `QT-${Date.now()}`;

      tempDiv.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; background: white; padding: 40px;">
          <!-- Header -->
          <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h1 style="font-size: 28px; font-weight: bold; color: #1a202c; margin: 0 0 8px 0;">GameZone Tech</h1>
                <p style="color: #6b7280; margin: 0 0 8px 0;">Your Technology Partner</p>
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">Email: info@gamezonetech.com | Phone: +94 XXX XXX XXX</p>
              </div>
              <div style="text-align: right;">
                <h2 style="font-size: 24px; font-weight: bold; color: #2563eb; margin: 0 0 8px 0;">QUOTATION</h2>
                <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">#${quotationNumber}</p>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">Date: ${currentDate}</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #1a202c;">Customer Information:</h3>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
              <p style="margin: 0 0 4px 0;"><strong>Name:</strong> ${customerInfo.customerName || "Guest User"}</p>
              <p style="margin: 0 0 4px 0;"><strong>Email:</strong> ${customerInfo.customerEmail || "guest@example.com"}</p>
              ${customerInfo.customerPhone ? `<p style="margin: 0 0 4px 0;"><strong>Phone:</strong> ${customerInfo.customerPhone}</p>` : ""}
              ${customerInfo.customerCompany ? `<p style="margin: 0;"><strong>Company:</strong> ${customerInfo.customerCompany}</p>` : ""}
            </div>
          </div>

          <!-- Quotation Details -->
          ${
            quotationDetails.title || quotationDetails.description
              ? `
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #1a202c;">Quotation Details:</h3>
            ${quotationDetails.title ? `<p style="margin: 0 0 8px 0;"><strong>Title:</strong> ${quotationDetails.title}</p>` : ""}
            ${quotationDetails.description ? `<p style="margin: 0; color: #6b7280;">${quotationDetails.description}</p>` : ""}
          </div>
          `
              : ""
          }

          <!-- Items Table -->
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #1a202c;">Items:</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280;">#</th>
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280;">ITEM</th>
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280;">QTY</th>
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280;">UNIT PRICE</th>
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item, index) => `
                  <tr style="${index % 2 === 0 ? "background: white;" : "background: #f8fafc;"}">
                    <td style="border: 1px solid #e2e8f0; padding: 12px; font-size: 14px;">${index + 1}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px;">
                      <div>
                        <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1a202c;">${item.product.name}</p>
                        ${item.product.sku ? `<p style="margin: 0 0 2px 0; font-size: 11px; color: #9ca3af;">SKU: ${item.product.sku}</p>` : ""}
                        ${item.variant?.name ? `<p style="margin: 0; font-size: 12px; color: #6b7280;">Variant: ${item.variant.name}</p>` : ""}
                      </div>
                    </td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; font-size: 14px;">${item.quantity}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; font-size: 14px;">${formatCurrency(item.unitPrice)}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; font-size: 14px; font-weight: 600;">${formatCurrency(item.totalPrice)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div style="margin-bottom: 30px;">
            <div style="max-width: 300px; margin-left: auto;">
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="font-size: 14px;">Total Items:</span>
                  <span style="font-size: 14px; font-weight: 600;">${items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div style="border-top: 1px solid #e2e8f0; padding-top: 12px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 16px; font-weight: bold;">Total Amount:</span>
                    <span style="font-size: 16px; font-weight: bold; color: #2563eb;">${formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          ${
            quotationDetails.notes
              ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #1a202c;">Notes:</h3>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
              <p style="margin: 0; color: #6b7280; white-space: pre-wrap;">${quotationDetails.notes}</p>
            </div>
          </div>
          `
              : ""
          }

          <!-- Footer -->
          <div style="border-top: 2px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">Thank you for your business!</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 12px;">This is a computer-generated quotation and does not require a signature.</p>
            <p style="margin: 0; color: #9ca3af; font-size: 11px;">Generated on ${currentDate} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Generate PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 800,
        height: tempDiv.scrollHeight
      });

      document.body.removeChild(tempDiv);

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
      pdf.save(`Quotation-${quotationNumber}.pdf`);
      toast.success("Quotation PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
        >
          <FileText className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Quotation</h4>
            <Badge variant="secondary">{itemCount} items</Badge>
          </div>

          <Separator />

          {items.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your quotation is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add some products to get started
              </p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {items.map((item) => {
                    const thumbnail = getProductThumbnail(item.product);

                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                          {thumbnail && (
                            <Image
                              src={thumbnail}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-sm font-medium text-foreground hover:text-primary truncate block"
                          >
                            {item.product.name}
                          </Link>

                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm font-semibold text-primary">
                              {formatCurrency(item.totalPrice)}
                            </p>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-xs min-w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(totalPrice)}
                  </span>
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
                    <Button variant="outline" asChild>
                      <Link href="/quotations">Manage Quotation</Link>
                    </Button>
                    <Button
                      variant="outline"
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
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
