import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: { reason?: string; orderId: string }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.orders[":id"].cancel.$patch({
        param: { id: values.orderId },
        json: { reason: values.reason }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Cancelling order...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Order cancelled successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel order", {
        id: toastId
      });
    }
  });

  return mutation;
};
