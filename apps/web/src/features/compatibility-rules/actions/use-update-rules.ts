import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

interface UpdateRuleRequest {
  id: string;
  data: any;
}

export const useUpdateRule = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: UpdateRuleRequest) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].rules[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update rule");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Updating compatibility rule...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Compatibility rule updated!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["compatibility-rules"] });
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["compatibility-rule", data.id],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update compatibility rule", {
        id: toastId,
      });
    },
  });

  return mutation;
};
