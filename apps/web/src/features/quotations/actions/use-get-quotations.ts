import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

// Match the exact API query parameters
interface GetQuotationsParams {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
  status?: "draft" | "pending" | "approved" | "rejected" | "expired";
  userId?: string;
}

export const useGetQuotations = (params: GetQuotationsParams = {}) => {
  return useQuery({
    queryKey: ["quotations", params],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.quotations.$get({
        query: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch quotations");
      }

      return response.json();
    }
  });
};

export const useGetQuotation = (id: string) => {
  return useQuery({
    queryKey: ["quotation", id],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.quotations[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch quotation");
      }

      return response.json();
    },
    enabled: !!id
  });
};

export const useGetMyQuotations = (
  params: Omit<GetQuotationsParams, "userId"> = {}
) => {
  return useQuery({
    queryKey: ["my-quotations", params],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.quotations["my-quotations"].$get({
        query: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch quotations");
      }

      return response.json();
    }
  });
};
