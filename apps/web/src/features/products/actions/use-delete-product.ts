import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.products[":id"].$delete({
        param: { id }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting product...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Product deleted successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product", {
        id: toastId
      });
    }
  });

  return mutation;
};
