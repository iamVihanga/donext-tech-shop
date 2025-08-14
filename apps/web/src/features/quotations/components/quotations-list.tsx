"use client";

import { useGetQuotations } from "@/features/quotations/actions/use-get-quotations";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { formatDistanceToNow } from "date-fns";
import { Download, Edit, ExternalLink, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-red-100 text-red-800"
};

export function QuotationsList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: quotationsData, isLoading } = useGetQuotations({
    search: search || undefined,
    status: status !== "all" ? (status as any) : undefined,
    page: page.toString(),
    limit: "10"
  });

  const handlePrintQuotation = (quotationId: string) => {
    const printUrl = `/quotations/${quotationId}/print`;
    window.open(printUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search quotations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {quotationsData?.data?.map((quotation) => (
          <Card key={quotation.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{quotation.quotationNumber}</h3>
                  <Badge
                    className={
                      statusColors[
                        quotation.status as keyof typeof statusColors
                      ]
                    }
                    variant="secondary"
                  >
                    {quotation.status.charAt(0).toUpperCase() +
                      quotation.status.slice(1)}
                  </Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Customer:</strong> {quotation.customerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {quotation.customerEmail}
                  </p>
                  {quotation.customerCompany && (
                    <p>
                      <strong>Company:</strong> {quotation.customerCompany}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <strong>Total:</strong>{" "}
                    {formatCurrency(parseFloat(quotation.totalAmount))}
                  </span>
                  <span>
                    <strong>Items:</strong> {quotation.items?.length || 0}
                  </span>
                  <span>
                    <strong>Created:</strong>{" "}
                    {formatDistanceToNow(new Date(quotation.createdAt))} ago
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="sm" title="View Details">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePrintQuotation(quotation.id)}
                  title="View & Print"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Download PDF">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" title="Edit">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {quotationsData?.data?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No quotations found</p>
            {search && (
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {quotationsData?.meta && quotationsData.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm">
            Page {quotationsData.meta.currentPage} of{" "}
            {quotationsData.meta.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page >= quotationsData.meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
