import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface FilterParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc" | null;
  search?: string | null;
}

export const useGetProducts = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["products", { page, limit, search, sort }],
    queryFn: async () => {
      const queryParams = {
        page: page.toString(),
        limit: limit.toString(),
        sort: sort || "desc",
        ...(search && { search })
      };

      const rpcClient = await getClient();

      const response = await rpcClient.api.products.$get({
        query: queryParams
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
