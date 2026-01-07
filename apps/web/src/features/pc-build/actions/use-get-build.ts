import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetBuild = (id?: string) => {
  const query = useQuery({
    queryKey: ["pc-build", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) throw new Error("Missing build id");
      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].builds[":id"].$get({
        path: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PC build");
      }

      const data = await response.json();

      return data;
    },
    keepPreviousData: true,
  });

  return query;
};
