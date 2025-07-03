import { getClient } from "@/lib/rpc/client";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AddCartItemT, UpdateCartItemT } from "../schemas/cart.zod";
import type { CartActions, CartState } from "./types";

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      // Get cart from server
      getCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const rpcClient = await getClient();
          const response = await rpcClient.api.cart.$get();

          if (!response.ok) {
            throw new Error("Failed to fetch cart");
          }

          const cart = await response.json();
          set({ cart, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch cart";
          set({ error: errorMessage, isLoading: false });
        }
      },

      // Add item to cart
      addToCart: async (item: AddCartItemT) => {
        try {
          set({ isLoading: true, error: null });
          const rpcClient = await getClient();

          const response = await rpcClient.api.cart.items.$put({
            json: item
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add item to cart");
          }

          // Refresh cart after adding item
          await get().getCart();
          toast.success("Item added to cart");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to add item to cart";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      // Update cart item quantity
      updateCartItem: async (itemId: string, data: UpdateCartItemT) => {
        try {
          set({ isLoading: true, error: null });
          const rpcClient = await getClient();

          const response = await rpcClient.api.cart.items[":id"].$patch({
            param: { id: itemId },
            json: data
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update cart item");
          }

          // Refresh cart after updating item
          await get().getCart();
          toast.success("Cart updated");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update cart item";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      // Remove item from cart
      removeFromCart: async (itemId: string) => {
        try {
          set({ isLoading: true, error: null });
          const rpcClient = await getClient();

          const response = await rpcClient.api.cart.items[":id"].$delete({
            param: { id: itemId }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to remove item from cart"
            );
          }

          // Refresh cart after removing item
          await get().getCart();
          toast.success("Item removed from cart");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to remove item from cart";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
        }
      },

      // Clear local cart state
      clearCart: () => {
        set({ cart: null, error: null });
      },

      // Get total item count
      getItemCount: () => {
        const { cart } = get();
        return (
          cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
        );
      },

      // Get total price
      getTotalPrice: () => {
        const { cart } = get();
        return (
          cart?.items?.reduce(
            (total, item) => total + parseFloat(item.totalPrice),
            0
          ) || 0
        );
      },

      // Check if product is in cart
      isInCart: (productId: string, variantId: string | null = null) => {
        const { cart } = get();
        return (
          cart?.items?.some(
            (item) =>
              item.productId === productId && item.variantId === variantId
          ) || false
        );
      },

      // Get cart item quantity for a specific product
      getCartItemQuantity: (
        productId: string,
        variantId: string | null = null
      ) => {
        const { cart } = get();
        const item = cart?.items?.find(
          (item) => item.productId === productId && item.variantId === variantId
        );
        return item?.quantity || 0;
      }
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart })
    }
  )
);
