import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

interface CloneBuildRequest {
  id: string;
}

export const useCloneBuild = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ id }: CloneBuildRequest) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].builds[
        ":id"
      ].clone.$post({
        path: { id },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clone build");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Cloning PC build...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("PC build cloned!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["pc-builds"] });
      queryClient.invalidateQueries({ queryKey: ["builds"] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["pc-build", data.id] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clone PC build", {
        id: toastId,
      });
    },
  });

  return mutation;
};
