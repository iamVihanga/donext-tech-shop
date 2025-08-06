import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { UpdateProductRequest } from "@/features/products/types/api.types";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: UpdateProductRequest) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.products[":id"].$patch({
        param: { id },
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Updating product...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Product updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product", {
        id: toastId
      });
    }
  });

  return mutation;
};
