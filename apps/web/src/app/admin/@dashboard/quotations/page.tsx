import { QuotationsList } from "@/features/quotations/components/quotations-list";

export default function AdminQuotationsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quotations Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all customer quotations
        </p>
      </div>

      <QuotationsList />
    </div>
  );
}
