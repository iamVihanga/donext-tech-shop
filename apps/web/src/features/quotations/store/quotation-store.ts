import { Product } from "@/features/products/schemas/products.zod";
import { create } from "zustand";

export interface QuotationItem {
  id: string;
  product: Product;
  variant?: Product["variants"][0];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface QuotationStore {
  // Customer information
  customerInfo: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCompany: string;
    customerAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };

  // Quotation details
  quotationDetails: {
    title: string;
    description: string;
    validUntil: string;
    notes: string;
    terms: string;
  };

  // Items in quotation
  items: QuotationItem[];

  // Totals
  totals: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
  };

  // Actions
  setCustomerInfo: (info: Partial<QuotationStore["customerInfo"]>) => void;
  setQuotationDetails: (
    details: Partial<QuotationStore["quotationDetails"]>
  ) => void;

  addItem: (
    product: Product,
    variant?: Product["variants"][0],
    quantity?: number
  ) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  updateItemNotes: (itemId: string, notes: string) => void;

  setDiscount: (amount: number) => void;
  calculateTotals: () => void;
  clearQuotation: () => void;
}

const initialCustomerInfo = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerCompany: "",
  customerAddress: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  }
};

const initialQuotationDetails = {
  title: "Product Quotation Request",
  description: "",
  validUntil: "",
  notes: "",
  terms: ""
};

export const useQuotationStore = create<QuotationStore>((set, get) => ({
  customerInfo: initialCustomerInfo,
  quotationDetails: initialQuotationDetails,
  items: [],
  totals: {
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0
  },

  setCustomerInfo: (info) =>
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info }
    })),

  setQuotationDetails: (details) =>
    set((state) => ({
      quotationDetails: { ...state.quotationDetails, ...details }
    })),

  addItem: (product, variant, quantity = 1) => {
    const { items } = get();
    const existingItemIndex = items.findIndex(
      (item) =>
        item.product.id === product.id && item.variant?.id === variant?.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...items];
      const existingItem = updatedItems[existingItemIndex];
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice =
          existingItem.unitPrice * existingItem.quantity;
        set({ items: updatedItems });
      }
    } else {
      // Add new item
      const unitPrice = variant
        ? parseFloat(variant.price || "0")
        : parseFloat(product.price);
      const newItem: QuotationItem = {
        id: `${product.id}-${variant?.id || "default"}-${Date.now()}`,
        product,
        variant,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        notes: ""
      };

      set((state) => ({
        items: [...state.items, newItem]
      }));
    }

    get().calculateTotals();
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId)
    }));
    get().calculateTotals();
  },

  updateItemQuantity: (itemId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    }));
    get().calculateTotals();
  },

  updateItemNotes: (itemId, notes) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, notes } : item
      )
    }));
  },

  setDiscount: (amount) => {
    set((state) => ({
      totals: { ...state.totals, discountAmount: amount }
    }));
    get().calculateTotals();
  },

  calculateTotals: () => {
    const { items, totals } = get();
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + taxAmount - totals.discountAmount;

    set({
      totals: {
        ...totals,
        subtotal,
        taxAmount,
        totalAmount: Math.max(0, totalAmount) // Ensure total is not negative
      }
    });
  },

  clearQuotation: () => {
    set({
      customerInfo: initialCustomerInfo,
      quotationDetails: initialQuotationDetails,
      items: [],
      totals: {
        subtotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0
      }
    });
  }
}));
