import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteBuild = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].builds[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete build");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting PC build...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("PC build deleted", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["pc-builds"] });
      queryClient.invalidateQueries({ queryKey: ["builds"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete PC build", {
        id: toastId,
      });
    },
  });

  return mutation;
};
