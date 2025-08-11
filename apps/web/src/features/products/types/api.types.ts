// Re-export Zod-derived types for API requests and responses
// This ensures tight coupling between frontend and backend types

import type {
  Product,
  ProductImage,
  ProductVariant,
  InsertProduct,
  InsertProductImage,
  InsertProductVariant,
  UpdateProduct
} from "@/features/products/schemas/products.zod";

export type {
  Product,
  ProductImage,
  ProductVariant,
  InsertProduct,
  InsertProductImage,
  InsertProductVariant,
  UpdateProduct
};

// Additional utility types for API operations
export interface CreateProductRequest extends InsertProduct {}

export interface UpdateProductRequest {
  id: string;
  data: UpdateProduct;
}

// Type guards and validation helpers can be added here as needed
export const isProduct = (obj: any): obj is Product => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};
