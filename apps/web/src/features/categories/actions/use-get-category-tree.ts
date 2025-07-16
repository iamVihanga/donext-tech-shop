import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetCategoryTree = () => {
  const query = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories.tree.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch category tree");
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
