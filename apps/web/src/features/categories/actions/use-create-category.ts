import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";
import { NewCategoryT } from "../schemas/categories.zod";

import { getClient } from "@/lib/rpc/client";

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: NewCategoryT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories.$post({
        json: values
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Creating category...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Category created successfully !", { id: toastId });
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
