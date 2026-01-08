import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

interface CurrentComponents {
  processorId?: string;
  motherboardId?: string;
  memoryId?: string;
  graphicCardId?: string;
  pcCaseId?: string;
  powerSupplyId?: string;
}

interface GetCompatibleComponentsParams {
  componentType: string;
  buildId?: string;
  currentComponents?: CurrentComponents;
}

export const useGetCompatibleComponents = (
  params: GetCompatibleComponentsParams
) => {
  const { componentType, buildId, currentComponents } = params;

  return useQuery({
    queryKey: [
      "compatible-components",
      componentType,
      buildId,
      currentComponents,
    ],
    queryFn: async () => {
      const rpcClient = await getClient();

      const queryParams: any = {
        componentType,
      };

      if (buildId) {
        queryParams.buildId = buildId;
      }

      if (currentComponents) {
        queryParams.currentComponents = JSON.stringify(currentComponents);
      }

      const response = await rpcClient.api[
        "pc-builder"
      ].compatibility.components.$get({
        query: queryParams,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch compatible components");
      }

      const data = await response.json();
      return data;
    },
    enabled: !!componentType,
  });
};
