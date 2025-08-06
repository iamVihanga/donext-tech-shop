"use client";

import { useCreateQuotation } from "@/features/quotations/actions/use-create-quotation";
import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Download, FileText, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuotationActionsProps {
  onTabChangeAction: (tab: string) => void;
}

export function QuotationActions({ onTabChangeAction }: QuotationActionsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const { items, customerInfo, quotationDetails, totals, clearQuotation } =
    useQuotationStore();

  const { mutate: createQuotation, isPending } = useCreateQuotation();

  const validateQuotation = () => {
    const errors: string[] = [];

    if (items.length === 0) {
      errors.push("At least one product must be added");
    }

    if (!customerInfo.customerName.trim()) {
      errors.push("Customer name is required");
    }

    if (!customerInfo.customerEmail.trim()) {
      errors.push("Customer email is required");
    }

    if (
      customerInfo.customerEmail &&
      !/\S+@\S+\.\S+/.test(customerInfo.customerEmail)
    ) {
      errors.push("Valid customer email is required");
    }

    return errors;
  };

  const handleSaveQuotation = async () => {
    const validationErrors = validateQuotation();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setIsSaving(true);

    try {
      // Prepare quotation data for API
      const quotationData = {
        // Customer information
        customerName: customerInfo.customerName,
        customerEmail: customerInfo.customerEmail,
        customerPhone: customerInfo.customerPhone || undefined,
        customerCompany: customerInfo.customerCompany || undefined,
        customerAddress: Object.values(customerInfo.customerAddress).some((v) =>
          v.trim()
        )
          ? customerInfo.customerAddress
          : undefined,

        // Quotation details
        title:
          quotationDetails.title ||
          `Quotation for ${customerInfo.customerName}`,
        description: quotationDetails.description || undefined,
        validUntil: quotationDetails.validUntil || undefined,
        notes: quotationDetails.notes || undefined,
        terms: quotationDetails.terms || undefined,

        // Totals
        subtotal: totals.subtotal.toFixed(2),
        taxAmount: totals.taxAmount.toFixed(2),
        discountAmount: totals.discountAmount.toFixed(2),
        totalAmount: totals.totalAmount.toFixed(2),

        // Status
        status: "draft" as const,

        // Items
        items: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant?.id || undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2),
          totalPrice: item.totalPrice.toFixed(2),
          productName: item.product.name,
          productSku: item.product.sku || undefined,
          variantName: item.variant?.name || undefined,
          notes: item.notes || undefined
        }))
      };

      createQuotation(quotationData, {
        onSuccess: (data) => {
          toast.success("Quotation saved successfully!");
          clearQuotation();
          // Could redirect to quotation view page
          // router.push(`/quotations/${data.id}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save quotation");
        }
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    toast.info("PDF download will be implemented soon");
  };

  const handleClearQuotation = () => {
    if (
      window.confirm(
        "Are you sure you want to clear this quotation? This action cannot be undone."
      )
    ) {
      clearQuotation();
      toast.success("Quotation cleared");
    }
  };

  const validationErrors = validateQuotation();
  const hasValidationErrors = validationErrors.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Errors */}
        {hasValidationErrors && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-sm">
              <div className="font-medium mb-1">Please complete:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-xs">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleSaveQuotation}
            disabled={hasValidationErrors || isPending || isSaving}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending || isSaving ? "Saving..." : "Save Quotation"}
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={hasValidationErrors}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>

          <Button
            variant="outline"
            onClick={() => onTabChangeAction("summary")}
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Add Details
          </Button>

          <Button
            variant="outline"
            onClick={handleClearQuotation}
            disabled={items.length === 0}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Quotation
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Items: {items.length}</div>
            <div>Total: ${totals.totalAmount.toFixed(2)}</div>
            <div>Status: Draft</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
