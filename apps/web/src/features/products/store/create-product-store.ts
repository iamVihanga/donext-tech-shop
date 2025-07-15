import { additionalInfoFormSchema } from "@/features/products/schemas/forms/additional-info-form";
import { basicInformationsFormSchema } from "@/features/products/schemas/forms/basic-informations-form";
import { imagesFormSchema } from "@/features/products/schemas/forms/images-form";
import { inventoryFormSchema } from "@/features/products/schemas/forms/inventory-form";
import { pricingFormSchema } from "@/features/products/schemas/forms/pricing-form";
import { create } from "zustand";

import type {
  CreateProductStore_Actions as Actions,
  CreateProductStore_FormTypes as Types
} from "./types";

export const useCreateProductStore = create<Types & Actions>((set, get) => ({
  activeTab: 0,
  validationErrors: {},
  isSubmitting: false,

  basicInformation: {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    isActive: true,
    isFeatured: false,
    status: "pending"
  },

  categories: {
    selectedCategoryId: "",
    categoryPath: [],
    status: "pending"
  },

  media: {
    images: [],
    status: "pending"
  },

  inventory: {
    hasVariants: false,
    mainSku: "",
    quantity: 0,
    reservedQuantity: 0,
    minStockLevel: 0,
    variantTypes: [],
    status: "pending"
  },

  pricing: {
    basePrice: 0,
    status: "pending"
  },

  additional: {
    weight: 0,
    dimensions: "",
    requiresShipping: false,
    metaTitle: "",
    metaDescription: "",
    tags: "",
    status: "pending"
  },

  setBasicInformation: (data) => {
    set({ basicInformation: { ...data } });
  },

  setCategories: (data) => {
    set({ categories: { ...data } });
  },

  setMedia: (data) => {
    set({ media: { ...data } });
  },

  setInventory: (data) => {
    set({ inventory: { ...data } });
  },

  setPricing: (data) => {
    set({ pricing: { ...data } });
  },

  setAdditional: (data) => {
    set({ additional: { ...data } });
  },

  setActiveTab: (tabIndex) => {
    set({ activeTab: tabIndex });
  },

  toggleHasVariants: (hasVariants) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        hasVariants
      }
    }));
  },

  addNewVariant: (name, values) => {
    set((state) => {
      const newVariantValues = values.map((value) => ({
        name: value.trim(),
        sku: "",
        quantity: 0,
        price: 0,
        comparePrice: 0
      }));

      const newVariant = {
        name,
        values: newVariantValues
      };

      return {
        inventory: {
          ...state.inventory,
          variantTypes: [...state.inventory.variantTypes, newVariant]
        }
      };
    });
  },

  removeVariant: (name) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        variantTypes: state.inventory.variantTypes.filter(
          (variant) => variant.name !== name
        )
      }
    }));
  },

  updateVariantValuePrice: (variantName, valueName, body) => {
    set((state) => {
      const updatedVariantTypes = state.inventory.variantTypes.map(
        (variant) => {
          if (variant.name === variantName) {
            return {
              ...variant,
              values: variant.values.map((value) => {
                if (value.name === valueName) {
                  return {
                    ...value,
                    ...(body.price !== undefined && { price: body.price }),
                    ...(body.comparePrice !== undefined && {
                      comparePrice: body.comparePrice
                    })
                  };
                }
                return value;
              })
            };
          }
          return variant;
        }
      );

      return {
        inventory: {
          ...state.inventory,
          variantTypes: updatedVariantTypes
        }
      };
    });
  },

  clearForm: () => {
    set({
      activeTab: 0,
      validationErrors: {},
      isSubmitting: false,
      basicInformation: {
        name: "",
        slug: "",
        shortDescription: "",
        description: "",
        isActive: true,
        isFeatured: false,
        status: "pending"
      },
      categories: {
        selectedCategoryId: "",
        categoryPath: [],
        status: "pending"
      },
      media: {
        images: [],
        status: "pending"
      },
      inventory: {
        hasVariants: false,
        mainSku: "",
        quantity: 0,
        reservedQuantity: 0,
        minStockLevel: 0,
        variantTypes: [],
        status: "pending"
      },
      pricing: {
        basePrice: 0,
        status: "pending"
      },
      additional: {
        weight: 0,
        dimensions: "",
        requiresShipping: false,
        metaTitle: "",
        metaDescription: "",
        tags: "",
        status: "pending"
      }
    });
  },

  validateStep: (activeTab) => {
    // Get current state
    const state = get();
    let isValid = false;
    let formData;
    let validationSchema;

    // Determine which form to validate based on active tab
    switch (activeTab) {
      case 0: // Basic Information
        formData = state.basicInformation;
        validationSchema = basicInformationsFormSchema;
        break;

      // case 1: // Categories
      //   // For categories, we'll do a simple validation
      //   isValid = !!state.categories.selectedCategoryId;
      //   if (isValid) {
      //     set({ categories: { ...state.categories, status: "valid" } });
      //   } else {
      //     set({ categories: { ...state.categories, status: "invalid" } });
      //   }
      //   return;
      case 1:
        break;

      case 2: // Media
        formData = state.media;
        validationSchema = imagesFormSchema;
        break;
      case 3: // Inventory
        formData = state.inventory;
        validationSchema = inventoryFormSchema;
        break;
      case 4: // Pricing
        formData = state.pricing;
        validationSchema = pricingFormSchema;
        break;
      case 5: // Additional
        formData = state.additional;
        validationSchema = additionalInfoFormSchema;
        break;
      default:
        return false;
    }

    try {
      // Validate against schema
      validationSchema!.parse(formData);

      // Update status to valid for the validated step
      switch (activeTab) {
        case 0:
          set({
            basicInformation: { ...state.basicInformation, status: "valid" }
          });
          break;
        case 1:
          set({ categories: { ...state.categories, status: "valid" } });
          break;
        case 2:
          set({ media: { ...state.media, status: "valid" } });
          break;
        case 3:
          set({ inventory: { ...state.inventory, status: "valid" } });
          break;
        case 4:
          set({ pricing: { ...state.pricing, status: "valid" } });
          break;
        case 5:
          set({ additional: { ...state.additional, status: "valid" } });
          break;
      }

      // Clear validation errors for this step
      set((state) => ({
        validationErrors: {}
      }));

      isValid = true;
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error) {
        const formattedErrors: Record<string, string[]> = {};

        if ("format" in error && typeof error.format === "function") {
          const formattedError = error.format();

          // Convert Zod errors format to our validation format
          Object.entries(formattedError).forEach(([field, fieldError]) => {
            if (
              field !== "_errors" &&
              fieldError &&
              typeof fieldError === "object" &&
              "_errors" in fieldError
            ) {
              const errors = fieldError._errors;
              if (Array.isArray(errors)) {
                formattedErrors[field] = errors;
              }
            }
          });
        }

        set({ validationErrors: formattedErrors });

        // Update status to invalid
        switch (activeTab) {
          case 0:
            set({
              basicInformation: { ...state.basicInformation, status: "invalid" }
            });
            break;
          // case 1:
          //   // Categories validation handled above
          //   break;
          case 2:
            set({ media: { ...state.media, status: "invalid" } });
            break;
          case 3:
            set({ inventory: { ...state.inventory, status: "invalid" } });
            break;
          case 4:
            set({ pricing: { ...state.pricing, status: "invalid" } });
            break;
          case 5:
            set({ additional: { ...state.additional, status: "invalid" } });
            break;
        }
      }
    }

    return isValid;
  },

  addUploadedImage: (image) => {
    set((state) => ({
      media: {
        ...state.media,
        images: [...state.media.images, image]
      }
    }));
  },

  removeUploadedImage: (url) => {
    set((state) => ({
      media: {
        ...state.media,
        images: state.media.images.filter((image) => image.url !== url)
      }
    }));
  }
}));
