import type {
  AddCartItemT,
  CartWithItems,
  UpdateCartItemT
} from "../schemas/cart.zod";

export interface CartState {
  cart: CartWithItems | null;
  isLoading: boolean;
  error: string | null;
}

export interface CartActions {
  addToCart: (item: AddCartItemT) => Promise<void>;
  updateCartItem: (itemId: string, data: UpdateCartItemT) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
  getCart: () => Promise<void>;
  getItemCount: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string, variantId?: string | null) => boolean;
  getCartItemQuantity: (productId: string, variantId?: string | null) => number;
}
