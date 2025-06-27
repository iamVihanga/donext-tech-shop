import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetCategoryById = (id?: string) => {
  const query = useQuery({
    queryKey: ["categories", { id }],
    queryFn: async () => {
      if (!id) throw new Error("Category ID is required");

      const rpcClient = await getClient();

      const response = await rpcClient.api.categories[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
