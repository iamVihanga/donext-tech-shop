import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type MoveCategoryRequest = InferRequestType<
  (typeof client.api.categories.move)["$post"]
>;
type MoveCategoryResponse = InferResponseType<
  (typeof client.api.categories.move)["$post"]
>;

export const useMoveCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    MoveCategoryResponse,
    Error,
    MoveCategoryRequest
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.categories.move["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to move category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to move category");
    }
  });

  return mutation;
};
