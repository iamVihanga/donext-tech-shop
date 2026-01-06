import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface FilterParams {
  page?: number;
  limit?: number;
}

export const useGetRules = (params: FilterParams = {}) => {
  const { page = 1, limit = 20 } = params;

  const query = useQuery({
    queryKey: ["compatibility-rules", { page, limit }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].rules.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch compatibility rules");
      }

      const data = await response.json();

      return data;
    },
    keepPreviousData: true,
  });

  return query;
};
