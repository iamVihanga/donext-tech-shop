import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import ProductsListing from "@/features/products/components/products-listing";
import { ProductsTableActions } from "@/features/products/components/products-table/products-table-actions";
import { Button } from "@repo/ui/components/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="All Products"
          description="Manage your products here."
          actionComponent={
            <Button asChild icon={<PlusIcon className="size-4" />}>
              <Link href="/admin/products/new">Add New Product</Link>
            </Button>
          }
        />

        <Separator />

        <ProductsTableActions />

        <ProductsListing />
      </div>
    </PageContainer>
  );
}
