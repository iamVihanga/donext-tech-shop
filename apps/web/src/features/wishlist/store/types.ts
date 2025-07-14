import { Product } from "@/features/products/schemas/products.zod";

export interface WishlistState {
  userId: string | null;
  products: Product[];
}

export interface WishlistActions {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  setUserId: (userId: string | null) => void;
}
