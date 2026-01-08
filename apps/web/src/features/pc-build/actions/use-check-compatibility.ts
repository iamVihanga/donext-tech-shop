import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";

interface CompatibilityCheckInput {
  processorId?: string;
  motherboardId?: string;
  memoryId?: string;
  memoryQuantity?: number;
  graphicCardId?: string;
  ssdNvmeId?: string;
  hardDiskId?: string;
  powerSupplyId?: string;
  coolerId?: string;
  pcCaseId?: string;
  fanIds?: string[];
  extraSsdNvmeIds?: string[];
  extraHardDiskIds?: string[];
}

export interface CompatibilityIssue {
  severity: "error" | "warning" | "info";
  component: string;
  message: string;
}

interface CompatibilityCheckResponse {
  isCompatible: boolean;
  issues: CompatibilityIssue[];
  estimatedWattage: number;
}

export const useCheckCompatibility = () => {
  return useMutation({
    mutationFn: async (
      components: CompatibilityCheckInput
    ): Promise<CompatibilityCheckResponse> => {
      const rpcClient = await getClient();

      const response = await rpcClient.api[
        "pc-builder"
      ].compatibility.check.$post({
        json: components,
      });

      if (!response.ok) {
        throw new Error("Failed to check compatibility");
      }

      const data = await response.json();
      return data as CompatibilityCheckResponse;
    },
  });
};
