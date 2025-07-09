import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import InventoryListing from "@/features/products/components/inventory/inventory-listing";
import { InventoryTableActions } from "@/features/products/components/inventory/inventory-table/inventory-table-actions";

export default function InventoryPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Inventory Management"
          description="Manage stock quantities for all products and variants."
          actionComponent={undefined}
        />

        <Separator />

        <InventoryTableActions />

        <InventoryListing />
      </div>
    </PageContainer>
  );
}
