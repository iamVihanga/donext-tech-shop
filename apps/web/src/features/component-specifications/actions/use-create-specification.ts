import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useCreateSpecification = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].components.$post({
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create specification");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Creating specification...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Specification created successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["component-specifications"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create specification", {
        id: toastId,
      });
    },
  });

  return mutation;
};
