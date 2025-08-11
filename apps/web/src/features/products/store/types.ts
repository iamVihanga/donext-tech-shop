import type { BasicInformationsFormSchemaT } from "@/features/products/schemas/forms/basic-informations-form";
import type {
  CtxImageT,
  ImagesFormSchemaT
} from "@/features/products/schemas/forms/images-form";
import type { InventoryFormSchemaT } from "@/features/products/schemas/forms/inventory-form";
import type { PricingFormSchemaT } from "@/features/products/schemas/forms/pricing-form";
import { AdditionalInfoFormSchemaT } from "../schemas/forms/additional-info-form";
import { Product } from "../types/api.types";

export interface CategoriesFormSchemaT {
  selectedCategoryId: string;
  categoryPath: Array<{ id: string; name: string; slug: string }>;
  status: "pending" | "valid" | "invalid";
}

export interface CreateProductStore_FormTypes {
  // Form control
  activeTab: number;
  isSubmitting: boolean;
  isUpdateMode: boolean;
  productId?: string;

  validationErrors: Record<string, string[]>;

  // Form 01 -> Basic Information Form
  basicInformation: BasicInformationsFormSchemaT;

  // Form 02 -> Categories Form
  categories: CategoriesFormSchemaT;

  // Form 03 -> Media Form
  media: ImagesFormSchemaT;

  // Form 04 -> Inventory
  inventory: InventoryFormSchemaT;

  // Form 05 -> Pricing
  pricing: PricingFormSchemaT;

  // Form 06 -> Additional Details
  additional: AdditionalInfoFormSchemaT;
}

export interface CreateProductStore_Actions {
  setBasicInformation: (
    data: CreateProductStore_FormTypes["basicInformation"]
  ) => void;
  setCategories: (data: CreateProductStore_FormTypes["categories"]) => void;
  setMedia: (data: CreateProductStore_FormTypes["media"]) => void;
  setInventory: (data: CreateProductStore_FormTypes["inventory"]) => void;
  setPricing: (data: CreateProductStore_FormTypes["pricing"]) => void;
  setAdditional: (data: CreateProductStore_FormTypes["additional"]) => void;
  setActiveTab: (tabIndex: number) => void;

  // Update mode actions
  setUpdateMode: (isUpdate: boolean, productId?: string) => void;
  populateFromProduct: (product: Product) => void;

  // Media actions
  addUploadedImage: (image: CtxImageT) => void;
  removeUploadedImage: (imageUrl: string) => void;

  // Variant-specific actions
  toggleHasVariants: (hasVariants: boolean) => void;
  addNewVariant: (name: string, values: string[]) => void; // values are comma seperated
  removeVariant: (name: string) => void;
  updateVariantValuePrice: (
    variantName: string,
    valueName: string,
    body: {
      price?: number;
      comparePrice?: number;
    }
  ) => void;

  // Form Actions
  clearForm: () => void;
  validateStep: (activeTab: number) => boolean;
}
