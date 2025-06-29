"use client";

import { Alert, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { CheckCircle2Icon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useCreateProductStore } from "../store/create-product-store";
import { getActiveTab, Tabs } from "../store/helpers";
import { validateProductDetails, ValidatorResponseT } from "../store/validator";

interface PreparedProductData {
  // Main product data
  product: {
    name: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    price: string; // Decimal as string for database
    sku: string;
    reservedQuantity: number;
    stockQuantity: number;
    minStockLevel: number;
    weight: string | null; // Decimal as string
    dimensions: string | null;
    categoryId: string;
    subcategoryId: string | null;
    isActive: boolean;
    isFeatured: boolean;
    requiresShipping: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    tags: string | null;
  };

  // Product images data
  images: Array<{
    imageUrl: string;
    altText: string | null;
    sortOrder: number;
    isThumbnail: boolean;
  }>;

  // Product variants data (if any)
  variants: Array<{
    name: string;
    sku: string;
    stockQuantity: number;
    price: string; // Decimal as string
    comparePrice: string | null; // Decimal as string
    attributes: string; // JSON string
    isActive: boolean;
  }>;
}

export function PublishProductButton() {
  const activeTab = getActiveTab();
  const state = useCreateProductStore();
  const toastId = useId();

  const [showValidationErrorsDialog, setShowValidationErrorsDialog] =
    useState<boolean>(false);
  const [validatorResponse, setValidatorResponse] =
    useState<ValidatorResponseT | null>(null);

  if (activeTab !== Tabs.SUMMARY) {
    return <></>;
  }

  const prepareData = (): PreparedProductData => {
    const { basicInformation, media, inventory, pricing, additional } = state;

    // Prepare main product data
    const product = {
      name: basicInformation.name.trim(),
      slug: basicInformation.slug.trim(),
      description: basicInformation.description.trim() || null,
      shortDescription: basicInformation.shortDescription.trim() || null,
      price: inventory.hasVariants ? "0.00" : pricing.basePrice.toFixed(2),
      sku: inventory.mainSku.trim(),
      reservedQuantity: inventory.reservedQuantity,
      stockQuantity: inventory.hasVariants ? 0 : inventory.quantity, // 0 if has variants, use variant stock instead
      minStockLevel: inventory.minStockLevel,
      weight: additional.weight > 0 ? additional.weight.toFixed(2) : null,
      dimensions: additional.dimensions.trim() || null,
      categoryId: basicInformation.categoryId,
      subcategoryId: basicInformation.subcategoryId || null,
      isActive: basicInformation.isActive,
      isFeatured: basicInformation.isFeatured,
      requiresShipping: additional.requiresShipping,
      metaTitle: additional.metaTitle.trim() || null,
      metaDescription: additional.metaDescription.trim() || null,
      tags: additional.tags.trim() || null
    };

    // Prepare images data
    const images = media.images.map((image, index) => ({
      imageUrl: image.url,
      altText: basicInformation.name, // Use product name as alt text
      sortOrder: image.orderIndex,
      isThumbnail: image.isThumbnail
    }));

    // Prepare variants data
    const variants: PreparedProductData["variants"] = [];

    if (inventory.hasVariants && inventory.variantTypes.length > 0) {
      inventory.variantTypes.forEach((variantType) => {
        variantType.values.forEach((value) => {
          variants.push({
            name: value.name.trim(),
            sku: value.sku.trim(),
            stockQuantity: value.quantity,
            price: value.price.toFixed(2),
            comparePrice:
              value.comparePrice > 0 ? value.comparePrice.toFixed(2) : null,
            attributes: JSON.stringify({
              type: variantType.name,
              value: value.name
            }),
            isActive: true
          });
        });
      });
    }

    return {
      product,
      images,
      variants
    };
  };

  const handlePublish = async () => {
    try {
      toast.loading("Validating product details...", { id: toastId });

      // Step 1: Validate all data
      const validation = validateProductDetails();

      setValidatorResponse(validation);

      if (!validation.isValid) {
        toast.error(`Product validation failed !`, { id: toastId });
        setShowValidationErrorsDialog(true);
        return;
      }

      // Step 2: Prepare data for API
      const preparedData = prepareData();

      console.log("Prepared data for API:", preparedData);

      // Step 3: Here you would make the API call
      /*
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const result = await response.json();
      console.log('Product created successfully:', result);

      // Clear form and redirect
      state.clearForm();
      router.push('/admin/products');
      */
    } catch (error) {
      console.error("Error publishing product:", error);
      alert("Failed to publish product. Please try again.");
    }
  };

  return (
    <div>
      {showValidationErrorsDialog &&
        validatorResponse &&
        !validatorResponse?.isValid && (
          <Dialog
            open={showValidationErrorsDialog}
            onOpenChange={setShowValidationErrorsDialog}
          >
            <DialogContent className="flex flex-col gap-2">
              <DialogHeader>
                <DialogTitle>{`Your product has some errors.`}</DialogTitle>
                <DialogDescription>
                  {`Fix them before publish your product.`}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 flex flex-col gap-2">
                {validatorResponse.errors.map((error, index) => (
                  <Alert variant={"destructive"} key={index}>
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

      <Button
        className="h-12 rounded-none"
        icon={<CheckCircle2Icon />}
        onClick={handlePublish}
      >
        Publish Product
      </Button>
    </div>
  );
}
