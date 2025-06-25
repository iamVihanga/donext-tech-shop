import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { UpdateCategoryT } from "../schemas/categories.zod";

import { getClient } from "@/lib/rpc/client";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (params: { values: UpdateCategoryT; id: string }) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories[":id"].$patch({
        param: { id: params.id },
        json: params.values
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Updating category...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Category updated successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category", {
        id: toastId
      });
    }
  });

  return mutation;
};
