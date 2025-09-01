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
import { useState } from "react";
import { toast } from "sonner";
import { useCreateProductStore } from "../store/create-product-store";
import { getActiveTab, Tabs } from "../store/helpers";
import { validateProductDetails, ValidatorResponseT } from "../store/validator";

import { useCreateProduct } from "@/features/products/actions/use-create-product";
import { useUpdateProduct } from "@/features/products/actions/use-update-product";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [showValidationErrorsDialog, setShowValidationErrorsDialog] =
    useState<boolean>(false);
  const [validatorResponse, setValidatorResponse] =
    useState<ValidatorResponseT | null>(null);

  const isUpdateMode = state.isUpdateMode;
  const isLoading = isCreating || isUpdating;

  // Handle success for navigation
  const handleSuccess = () => {
    state.clearForm();
    router.push("/admin/products");
  };

  if (activeTab !== Tabs.SUMMARY) {
    return <></>;
  }

  const prepareDataForAPI = () => {
    const {
      basicInformation,
      categories,
      media,
      inventory,
      pricing,
      additional
    } = state;

    // Convert images to the expected API format
    const images = media.images.map((image) => ({
      imageUrl: image.url,
      sortOrder: image.orderIndex,
      isThumbnail: image.isThumbnail
    }));

    // Convert variants to the expected API format
    const variants: Array<{
      name: string;
      sku: string;
      stockQuantity: number;
      price: string;
      comparePrice: string;
      attributes: string;
      isActive: boolean;
    }> = [];

    if (inventory.hasVariants && inventory.variantTypes.length > 0) {
      inventory.variantTypes.forEach((variantType) => {
        variantType.values.forEach((value) => {
          variants.push({
            name: `${variantType.name} - ${value.name}`,
            sku: value.sku,
            stockQuantity: value.quantity,
            price: value.price.toString(),
            comparePrice: value.comparePrice.toString(),
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
      name: basicInformation.name,
      slug: basicInformation.slug,
      shortDescription: basicInformation.shortDescription || undefined,
      description: basicInformation.description || undefined,
      brandId: basicInformation.brandId,
      categoryId: categories.selectedCategoryId,
      price: inventory.hasVariants ? "0" : pricing.basePrice.toString(),
      sku: inventory.mainSku,
      stockQuantity: inventory.hasVariants ? 0 : inventory.quantity,
      reservedQuantity: inventory.reservedQuantity || undefined,
      minStockLevel: inventory.minStockLevel || undefined,
      weight: additional.weight ? additional.weight.toString() : undefined,
      dimensions: additional.dimensions || undefined,
      requiresShipping: additional.requiresShipping,
      metaTitle: additional.metaTitle || undefined,
      metaDescription: additional.metaDescription || undefined,
      tags: additional.tags || undefined,
      isActive: basicInformation.isActive,
      isFeatured: basicInformation.isFeatured,
      images,
      ...(variants.length > 0 ? { variants } : { variants: [] })
    };
  };

  const handlePublish = async () => {
    try {
      // Step 1: Validate all data
      const validation = validateProductDetails();

      setValidatorResponse(validation);

      if (!validation.isValid) {
        toast.error(`Product validation failed!`);
        setShowValidationErrorsDialog(true);
        return;
      }

      // Step 2: Prepare data for API
      const productData = prepareDataForAPI();
      const { images, variants, ...restProductData } = productData;

      if (isUpdateMode && state.productId) {
        // Update existing product
        updateProduct(
          {
            id: state.productId,
            data: {
              images,
              variants,
              ...restProductData
            }
          },
          {
            onSuccess: handleSuccess
          }
        );
      } else {
        // Create new product
        createProduct(
          {
            images,
            variants,
            ...restProductData
          } as any,
          {
            onSuccess: handleSuccess
          }
        );
      }
    } catch (error) {
      console.error("Error processing product:", error);
      toast.error("Failed to process product. Please try again.");
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
        loading={isLoading}
        disabled={isLoading}
      >
        {isUpdateMode ? "Update Product" : "Publish Product"}
      </Button>
    </div>
  );
}
