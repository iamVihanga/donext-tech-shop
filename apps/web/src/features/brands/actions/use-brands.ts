import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

// List brands
export const useGetBrands = ({
  page = "1",
  limit = "10",
  sort = "desc",
  search = ""
}: {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
}) => {
  return useQuery({
    queryKey: ["brands", { page, limit, sort, search }],
    queryFn: async () => {
      const response = await client.api.brands.$get({
        query: {
          page,
          limit,
          sort,
          search
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      return response.json();
    }
  });
};

// Get single brand
export const useGetBrand = (id: string) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: async () => {
      const response = await client.api.brands[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch brand");
      }

      return response.json();
    },
    enabled: !!id
  });
};

// Create brand
type CreateBrandRequest = InferRequestType<
  typeof client.api.brands.$post
>["json"];
type CreateBrandResponse = InferResponseType<typeof client.api.brands.$post>;

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateBrandResponse, Error, CreateBrandRequest>({
    mutationFn: async (data) => {
      const response = await client.api.brands.$post({
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create brand");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create brand");
    }
  });
};

// Update brand
type UpdateBrandRequest = InferRequestType<
  typeof client.api.brands[":id"].$patch
>["json"];
type UpdateBrandResponse = InferResponseType<
  typeof client.api.brands[":id"].$patch
>;

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBrandResponse,
    Error,
    UpdateBrandRequest & { id: string }
  >({
    mutationFn: async ({ id, ...data }) => {
      const response = await client.api.brands[":id"].$patch({
        param: { id },
        json: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update brand");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update brand");
    }
  });
};

// Delete brand
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const response = await client.api.brands[":id"].$delete({
        param: { id }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete brand");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete brand");
    }
  });
};
