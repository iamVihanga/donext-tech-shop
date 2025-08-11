import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetProduct = (id: string) => {
  const query = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.products[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!id
  });

  return query;
};
