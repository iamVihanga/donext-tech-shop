import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CheckoutInput } from "../schemas/checkout.zod";

interface CheckoutState {
  formData: Partial<CheckoutInput>;
  currentStep: number;
  isSubmitting: boolean;
}

interface CheckoutActions {
  updateFormData: (data: Partial<CheckoutInput>) => void;
  setCurrentStep: (step: number) => void;
  setIsSubmitting: (submitting: boolean) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set, get) => ({
      // State
      formData: {
        useShippingAsBilling: true,
        paymentMethod: "card"
      },
      currentStep: 1,
      isSubmitting: false,

      // Actions
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

      clearCheckout: () =>
        set({
          formData: {
            useShippingAsBilling: true,
            paymentMethod: "card"
          },
          currentStep: 1,
          isSubmitting: false
        })
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ formData: state.formData })
    }
  )
);
