import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

interface UpdateProductStockParams {
  productId: string;
  adjustmentType: "increase" | "decrease";
  quantity: number;
  reason?: string;
}

export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (params: UpdateProductStockParams) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.products[":id"]["stock"].$patch({
        param: { id: params.productId },
        json: {
          adjustmentType: params.adjustmentType,
          quantity: params.quantity,
          reason: params.reason
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product stock");
      }

      const data = await response.json();
      return data;
    },
    onMutate: (params) => {
      toast.loading(
        `${params.adjustmentType === "increase" ? "Increasing" : "Decreasing"} stock by ${params.quantity} units...`,
        { id: toastId }
      );
    },
    onSuccess: (data, params) => {
      toast.success(
        `Stock ${params.adjustmentType === "increase" ? "increased" : "decreased"} successfully!`,
        { id: toastId }
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["products", params.productId]
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update stock", {
        id: toastId
      });
    }
  });

  return mutation;
};
