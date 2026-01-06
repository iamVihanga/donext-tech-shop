import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

interface UpdateSpecificationRequest {
  id: string;
  data: any;
}

export const useUpdateSpecification = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: UpdateSpecificationRequest) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].components[
        ":id"
      ].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update specification");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Updating specification...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Specification updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["component-specifications"] });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: ["component-specification", data.id],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update specification", {
        id: toastId,
      });
    },
  });

  return mutation;
};
