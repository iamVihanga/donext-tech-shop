"use client";

"use client";

import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import BrandsListing from "@/features/brands/components/brands-listing";
import { BrandsTableActions } from "@/features/brands/components/brands-table/brands-table-actions";
import { CreateBrandDialog } from "@/features/brands/components/brands-table/create-brand-dialog";
import { Button } from "@repo/ui/components/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function BrandsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Brands"
          description="Manage your product brands here."
          actionComponent={
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              icon={<PlusIcon className="size-4" />}
            >
              Add New Brand
            </Button>
          }
        />

        <Separator />

        <BrandsTableActions />

        <BrandsListing />

        <CreateBrandDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </PageContainer>
  );
}
