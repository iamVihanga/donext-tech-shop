import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface FilterParams {
  page?: number;
  limit?: number;
  componentType?: string | null;
  socketType?: string | null;
  memoryType?: string | null;
  formFactor?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export const useGetSpecifications = (params: FilterParams) => {
  const {
    page = 1,
    limit = 20,
    componentType = null,
    socketType = null,
    memoryType = null,
    formFactor = null,
    minPrice = null,
    maxPrice = null,
  } = params;

  const query = useQuery({
    queryKey: [
      "component-specifications",
      {
        page,
        limit,
        componentType,
        socketType,
        memoryType,
        formFactor,
        minPrice,
        maxPrice,
      },
    ],
    queryFn: async () => {
      const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };

      if (componentType) queryParams.componentType = componentType;
      if (socketType) queryParams.socketType = socketType;
      if (memoryType) queryParams.memoryType = memoryType;
      if (formFactor) queryParams.formFactor = formFactor;
      if (minPrice !== null && minPrice !== undefined)
        queryParams.minPrice = minPrice.toString();
      if (maxPrice !== null && maxPrice !== undefined)
        queryParams.maxPrice = maxPrice.toString();

      const rpcClient = await getClient();

      const response = await rpcClient.api["pc-builder"].components.$get({
        query: queryParams,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch component specifications");
      }

      const data = await response.json();

      return data;
    },
    keepPreviousData: true,
  });

  return query;
};
