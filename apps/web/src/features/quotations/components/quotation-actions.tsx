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
import { ExternalLink, FileText, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface QuotationActionsProps {
  onTabChangeAction: (tab: string) => void;
}

export function QuotationActions({ onTabChangeAction }: QuotationActionsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedQuotationId, setSavedQuotationId] = useState<string | null>(null);
  const router = useRouter();

  const { items, customerInfo, quotationDetails, totals, clearQuotation } =
    useQuotationStore();

  const { mutate: createQuotation, isPending } = useCreateQuotation();

  const validateQuotation = () => {
    const errors: string[] = [];

    if (items.length === 0) {
      errors.push("At least one product must be added");
    }

    // Customer details are now optional for guest users
    // Only validate email format if email is provided
    if (
      customerInfo.customerEmail &&
      customerInfo.customerEmail.trim() &&
      !/\S+@\S+\.\S+/.test(customerInfo.customerEmail)
    ) {
      errors.push("Valid customer email format is required");
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
      // Prepare quotation data for API with proper defaults
      const finalCustomerName =
        customerInfo.customerName?.trim() || "Guest Customer";
      const finalCustomerEmail =
        customerInfo.customerEmail?.trim() || "guest@gamezonetech.com";
      const finalTitle =
        quotationDetails.title?.trim() || `Quotation for ${finalCustomerName}`;

      const quotationData = {
        // Customer information (with proper defaults)
        customerName: finalCustomerName,
        customerEmail: finalCustomerEmail,
        customerPhone: customerInfo.customerPhone?.trim() || null,
        customerCompany: customerInfo.customerCompany?.trim() || null,
        customerAddress: Object.values(customerInfo.customerAddress).some((v) =>
          v?.trim()
        )
          ? {
              street: customerInfo.customerAddress.street?.trim() || "",
              city: customerInfo.customerAddress.city?.trim() || "",
              state: customerInfo.customerAddress.state?.trim() || "",
              postalCode: customerInfo.customerAddress.postalCode?.trim() || "",
              country: customerInfo.customerAddress.country?.trim() || ""
            }
          : null,

        // Quotation details
        title: finalTitle,
        description: quotationDetails.description?.trim() || null,
        validUntil: quotationDetails.validUntil || null,
        notes: quotationDetails.notes?.trim() || null,
        terms: quotationDetails.terms?.trim() || null,

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

      console.log("Saving quotation with data:", quotationData);

      createQuotation(quotationData, {
        onSuccess: (data) => {
          toast.success("Quotation saved successfully!");
          setSavedQuotationId(data.id);
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

  const handleViewAndPrint = () => {
    if (!savedQuotationId) {
      toast.error(
        "Please save the quotation first before viewing and printing"
      );
      return;
    }

    // Open print page in new window/tab
    const printUrl = `/quotations/${savedQuotationId}/print`;
    window.open(printUrl, "_blank");
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
            onClick={handleViewAndPrint}
            disabled={!savedQuotationId}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View & Print
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
