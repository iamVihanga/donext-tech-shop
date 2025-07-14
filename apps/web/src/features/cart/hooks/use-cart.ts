import { getClient } from "@/lib/rpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AddCartItemT,
  CartWithItems,
  UpdateCartItemT
} from "../schemas/cart.zod";

const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  const queryClient = useQueryClient();

  // Get cart query
  const {
    data: cart,
    isLoading,
    error
  } = useQuery<CartWithItems>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.cart.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      return await response.json();
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: AddCartItemT) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.cart.items.$put({
        json: item
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Item added to cart");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: async ({
      itemId,
      data
    }: {
      itemId: string;
      data: UpdateCartItemT;
    }) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.cart.items[":id"].$patch({
        param: { id: itemId },
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update cart item");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Cart updated");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.cart.items[":id"].$delete({
        param: { id: itemId }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item from cart");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Item removed from cart");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Helper functions
  const getItemCount = () => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getTotalPrice = () => {
    return (
      cart?.items?.reduce(
        (total, item) => total + parseFloat(item.totalPrice),
        0
      ) || 0
    );
  };

  const isInCart = (productId: string, variantId?: string | null) => {
    return (
      cart?.items?.some(
        (item) => item.productId === productId && item.variantId === variantId
      ) || false
    );
  };

  const getCartItemQuantity = (
    productId: string,
    variantId?: string | null
  ) => {
    const item = cart?.items?.find(
      (item) => item.productId === productId && item.variantId === variantId
    );
    return item?.quantity || 0;
  };

  return {
    cart,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    updateCartItem: (itemId: string, data: UpdateCartItemT) =>
      updateCartItemMutation.mutate({ itemId, data }),
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartItemMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    getItemCount,
    getTotalPrice,
    isInCart,
    getCartItemQuantity
  };
};
