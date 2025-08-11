import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { InsertQuotation } from "@/features/quotations/schemas/quotations.zod";
import { getClient } from "@/lib/rpc/client";

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (data: InsertQuotation) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.quotations.$post({
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create quotation");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Creating quotation...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Quotation created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["my-quotations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create quotation", {
        id: toastId
      });
    }
  });

  return mutation;
};
