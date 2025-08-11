import { QuotationForm } from "@/features/quotations/components/quotation-form";

export default function QuotationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Quotation</h1>
        <p className="text-muted-foreground mt-2">
          Build a custom quotation for your computer parts requirements
        </p>
      </div>

      <QuotationForm />
    </div>
  );
}
