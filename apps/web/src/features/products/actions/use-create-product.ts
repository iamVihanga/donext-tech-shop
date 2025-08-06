import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { InsertProduct } from "@/features/products/types/api.types";
import { getClient } from "@/lib/rpc/client";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.products.$post({
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Creating product...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Product created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product", {
        id: toastId
      });
    }
  });

  return mutation;
};
