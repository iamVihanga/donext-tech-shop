import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import OrdersListing from "@/features/orders/components/orders-listing";
import { OrdersTableActions } from "@/features/orders/components/orders-table/orders-table-actions";
import { Separator } from "@repo/ui/components/separator";

export default function OrdersPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Orders"
          description="Manage your store orders here."
          actionComponent={undefined}
        />

        <Separator />

        <OrdersTableActions />

        <OrdersListing />
      </div>
    </PageContainer>
  );
}
