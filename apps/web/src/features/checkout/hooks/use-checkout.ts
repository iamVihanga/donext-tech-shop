import { getClient } from "@/lib/rpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CheckoutInput, OrderSummary } from "../schemas/checkout.zod";

// Get order totals from current cart
export function useOrderTotals() {
  return useQuery({
    queryKey: ["order", "totals"],
    queryFn: async (): Promise<OrderSummary> => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.orders["calculate-totals"].$get();

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to calculate order totals");
      }

      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false
  });
}

// Checkout mutation
export function useCheckout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (checkoutData: CheckoutInput) => {
      // Transform data for API
      const payload = {
        customerName: checkoutData.customerName,
        customerEmail: checkoutData.customerEmail,
        customerPhone: checkoutData.customerPhone,
        shippingAddress: checkoutData.shippingAddress,
        billingAddress: checkoutData.useShippingAsBilling
          ? checkoutData.shippingAddress
          : checkoutData.billingAddress,
        paymentMethod: checkoutData.paymentMethod,
        notes: checkoutData.notes
      };

      const rpcClient = await getClient();
      const response = await rpcClient.api.orders.checkout.$post({
        json: payload
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error(error.message || "Failed to create order");
      }

      return response.json();
    },
    onSuccess: (order) => {
      toast.success("Order placed successfully!");

      // Invalidate cart and order queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Redirect to order confirmation page
      router.push(`/orders/${order.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order");
    }
  });
}
