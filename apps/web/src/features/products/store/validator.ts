import { useCreateProductStore } from "./create-product-store";

export type ValidatorResponseT = {
  isValid: boolean;
  errors: string[];
};

export const validateProductDetails = (): ValidatorResponseT => {
  const state = useCreateProductStore.getState();
  let isValid: boolean = true;
  const errors: string[] = [];
  const {
    basicInformation,
    categories,
    media,
    inventory,
    pricing,
    additional
  } = state;

  // 1. Check if all form steps are valid
  if (basicInformation.status !== "valid") {
    errors.push("Basic Information form is not valid");
  }

  if (categories.status !== "valid") {
    errors.push("Categories form is not valid");
  }

  if (media.status !== "valid") {
    errors.push("Media form is not valid");
  }

  if (inventory.status !== "valid") {
    errors.push("Inventory form is not valid");
  }

  if (pricing.status !== "valid") {
    errors.push("Pricing form is not valid");
  }

  if (additional.status !== "valid") {
    errors.push("Additional Information form is not valid");
  }

  // 2. Validate required fields for database constraints

  // Basic Information validation
  if (!basicInformation.name.trim()) {
    errors.push("Product name is required");
  }

  if (!basicInformation.slug.trim()) {
    errors.push("Product slug is required");
  }

  if (!categories.selectedCategoryId) {
    errors.push("Category is required");
  }

  // Media validation
  if (media.images.length === 0) {
    errors.push("At least one product image is required");
  }

  // Check if at least one image is marked as thumbnail
  const hasThumbnail = media.images.some((img) => img.isThumbnail);
  if (media.images.length > 0 && !hasThumbnail) {
    errors.push("One image must be marked as thumbnail");
  }

  // Inventory validation
  if (!inventory.mainSku.trim()) {
    errors.push("Main SKU is required");
  }

  if (inventory.quantity < 0) {
    errors.push("Stock quantity cannot be negative");
  }

  if (inventory.minStockLevel < 0) {
    errors.push("Minimum stock level cannot be negative");
  }

  // Pricing validation
  if (!inventory.hasVariants && pricing.basePrice <= 0) {
    errors.push(
      "Base price must be greater than 0 when product has no variants"
    );
  }

  // Variant validation (if has variants)
  if (inventory.hasVariants) {
    if (inventory.variantTypes.length === 0) {
      errors.push(
        "At least one variant type is required when variants are enabled"
      );
    }

    inventory.variantTypes.forEach((variantType, typeIndex) => {
      if (!variantType.name.trim()) {
        errors.push(`Variant type ${typeIndex + 1} name is required`);
      }

      if (variantType.values.length === 0) {
        errors.push(
          `Variant type "${variantType.name}" must have at least one value`
        );
      }

      variantType.values.forEach((value, valueIndex) => {
        if (!value.name.trim()) {
          errors.push(
            `Variant value ${valueIndex + 1} in "${variantType.name}" is required`
          );
        }

        if (!value.sku.trim()) {
          errors.push(
            `SKU for variant "${value.name}" in "${variantType.name}" is required`
          );
        }

        if (value.price <= 0) {
          errors.push(
            `Price for variant "${value.name}" in "${variantType.name}" must be greater than 0`
          );
        }

        if (value.quantity < 0) {
          errors.push(
            `Stock quantity for variant "${value.name}" in "${variantType.name}" cannot be negative`
          );
        }
      });
    });
  }

  // String length validation (based on database schema)
  if (basicInformation.name.length > 255) {
    errors.push("Product name cannot exceed 255 characters");
  }

  if (basicInformation.slug.length > 255) {
    errors.push("Product slug cannot exceed 255 characters");
  }

  if (inventory.mainSku.length > 100) {
    errors.push("Main SKU cannot exceed 100 characters");
  }

  if (additional.metaTitle && additional.metaTitle.length > 255) {
    errors.push("Meta title cannot exceed 255 characters");
  }

  if (additional.tags && additional.tags.length > 500) {
    errors.push("Tags cannot exceed 500 characters");
  }

  if (additional.dimensions && additional.dimensions.length > 50) {
    errors.push("Dimensions cannot exceed 50 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
