import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Product } from "@/features/products/schemas/products.zod";
import type { WishlistActions, WishlistState } from "./types";

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      userId: null,
      products: [],

      // Add item to wishlist
      addItem: (product: Product) => {
        const { products } = get();
        const existingItem = products.find((item) => item.id === product.id);

        if (!existingItem) {
          set({ products: [...products, product] });
        }
      },

      // Remove item from wishlist
      removeItem: (productId: string) => {
        set((state) => ({
          products: state.products.filter((item) => item.id !== productId)
        }));
      },

      clearWishlist: () => {
        set({ products: [] });
      },

      isInWishlist: (productId: string) => {
        const { products } = get();
        return products.some((item) => item.id === productId);
      },

      getItemCount: () => {
        const { products } = get();
        return products.length;
      },

      setUserId: (userId: string | null) => {
        set({ userId });
      }
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
