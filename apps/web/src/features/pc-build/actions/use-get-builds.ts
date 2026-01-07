import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface FilterParams {
  userId?: string;
  isPublic?: boolean;
  isTemplate?: boolean;
  page?: number;
  limit?: number;
}

export const useGetBuilds = (params: FilterParams = {}) => {
  const { userId, isPublic, isTemplate, page = 1, limit = 20 } = params;

  const queryKey = ["pc-builds", { userId, isPublic, isTemplate, page, limit }];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const rpcClient = await getClient();

      const query: Record<string, string> = {
        page: String(page),
        limit: String(limit),
      };

      if (userId) query.userId = userId;
      if (isPublic !== undefined) query.isPublic = String(isPublic);
      if (isTemplate !== undefined) query.isTemplate = String(isTemplate);

      const response = await rpcClient.api["pc-builder"].builds.$get({
        query,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch PC builds");
      }

      const data = await response.json();

      return data;
    },
    keepPreviousData: true,
  });

  return query;
};
