import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { NewSubcategoryT } from "../schemas/categories.zod";

import { getClient } from "@/lib/rpc/client";

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: NewSubcategoryT & { parentId: string }) => {
      const { parentId, ...subcategoryData } = values;
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories[":id"].subcategory.$post({
        param: { id: parentId },
        json: subcategoryData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create subcategory");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Creating subcategory...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Subcategory created successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category", {
        id: toastId
      });
    }
  });

  return mutation;
};
