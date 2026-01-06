import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteRule = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].rules[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete rule");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting compatibility rule...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Compatibility rule deleted", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["compatibility-rules"] });
      queryClient.invalidateQueries({ queryKey: ["rules"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete compatibility rule", {
        id: toastId,
      });
    },
  });

  return mutation;
};
