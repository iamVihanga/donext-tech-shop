import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { UpdateQuotation } from "@/features/quotations/schemas/quotations.zod";
import { getClient } from "@/lib/rpc/client";

interface UpdateQuotationParams {
  id: string;
  data: UpdateQuotation;
}

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: UpdateQuotationParams) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.quotations[":id"].$patch({
        param: { id },
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update quotation");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Updating quotation...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Quotation updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["quotation", data.id] });
      queryClient.invalidateQueries({ queryKey: ["my-quotations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update quotation", {
        id: toastId
      });
    }
  });

  return mutation;
};
