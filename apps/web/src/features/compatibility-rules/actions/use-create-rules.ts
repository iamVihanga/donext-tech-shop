import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useCreateRule = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].rules.$post({
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create rule");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Creating compatibility rule...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Compatibility rule created!", { id: toastId });
      // refresh rule lists
      queryClient.invalidateQueries({ queryKey: ["compatibility-rules"] });
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create compatibility rule", {
        id: toastId,
      });
    },
  });

  return mutation;
};
