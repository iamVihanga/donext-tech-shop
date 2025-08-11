import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetQuotation = (quotationId: string) => {
  return useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.quotations[":id"].$get({
        param: { id: quotationId }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quotation");
      }

      return response.json();
    },
    enabled: !!quotationId
  });
};
