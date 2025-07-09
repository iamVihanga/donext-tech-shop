import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

interface UpdateVariantStockParams {
  variantId: string;
  adjustmentType: "increase" | "decrease";
  quantity: number;
  reason?: string;
}

export const useUpdateVariantStock = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (params: UpdateVariantStockParams) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.products.variants[":id"][
        "stock"
      ].$patch({
        param: { id: params.variantId },
        json: {
          adjustmentType: params.adjustmentType,
          quantity: params.quantity,
          reason: params.reason
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update variant stock");
      }

      const data = await response.json();
      return data;
    },
    onMutate: (params) => {
      toast.loading(
        `${params.adjustmentType === "increase" ? "Increasing" : "Decreasing"} variant stock by ${params.quantity} units...`,
        { id: toastId }
      );
    },
    onSuccess: (data, params) => {
      toast.success(
        `Variant stock ${params.adjustmentType === "increase" ? "increased" : "decreased"} successfully!`,
        { id: toastId }
      );

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update variant stock", {
        id: toastId
      });
    }
  });

  return mutation;
};
