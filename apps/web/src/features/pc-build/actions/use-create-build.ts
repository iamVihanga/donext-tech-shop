import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useCreateBuild = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].builds.$post({
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create build");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Creating PC build...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("PC build created!", { id: toastId });
      // refresh build lists
      queryClient.invalidateQueries({ queryKey: ["pc-builds"] });
      queryClient.invalidateQueries({ queryKey: ["builds"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create PC build", {
        id: toastId,
      });
    },
  });

  return mutation;
};
