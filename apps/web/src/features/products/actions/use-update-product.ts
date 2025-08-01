import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

interface UpdateProductParams {
  productId: string;
  data: Record<string, any>;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (params: UpdateProductParams) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.products[":id"].$patch({
        param: { id: params.productId },
        json: params.data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const data = await response.json();
      return data;
    },
    onMutate: (params) => {
      toast.loading("Updating product...", { id: toastId });
    },
    onSuccess: (data, params) => {
      toast.success("Product updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["products", params.productId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product", { id: toastId });
    },
  });

  return mutation;
};
