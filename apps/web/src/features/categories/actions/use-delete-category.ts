import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories[":id"].$delete({
        param: { id }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting category...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Category deleted successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category", {
        id: toastId
      });
    }
  });

  return mutation;
};
