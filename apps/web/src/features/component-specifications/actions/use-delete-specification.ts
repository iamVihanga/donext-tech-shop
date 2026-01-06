import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteSpecification = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].components[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete specification");
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting specification...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Specification deleted successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["component-specifications"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete specification", {
        id: toastId,
      });
    },
  });

  return mutation;
};
