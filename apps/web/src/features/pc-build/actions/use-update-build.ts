import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

interface UpdateBuildRequest {
  id: string;
  data: any;
}

export const useUpdateBuild = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: UpdateBuildRequest) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].builds[":id"].$patch({
        path: { id },
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update build");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Updating PC build...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("PC build updated!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["pc-builds"] });
      queryClient.invalidateQueries({ queryKey: ["builds"] });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["pc-build", data.id],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update PC build", {
        id: toastId,
      });
    },
  });

  return mutation;
};
