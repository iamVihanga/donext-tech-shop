import { getClient } from "@/lib/rpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDownloadQuotationPDF() {
  return useMutation({
    mutationFn: async (quotationId: string) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.quotations[":id"].pdf.$get({
        param: { id: quotationId }
      });

      if (!response.ok) {
        throw new Error("Failed to download quotation PDF");
      }

      // Get the blob from response
      const blob = await response.blob();

      // Get filename from Content-Disposition header or create a default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `quotation-${quotationId}.pdf`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      return { filename, blob };
    },
    onSuccess: (data) => {
      toast.success(`PDF downloaded: ${data.filename}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to download PDF");
    }
  });
}
