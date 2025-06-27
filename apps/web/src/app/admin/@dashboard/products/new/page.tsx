import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { NewProductFormLayout } from "@/features/products/components/new-product-form-layout";

import NewProductTabBar from "@/features/products/components/new-product-tab-bar";
import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Setup New Product"
          description="Fill all following forms to setup your new product."
          actionComponent={
            <Button
              variant={"outline"}
              asChild
              icon={<ArrowLeft className="size-4" />}
            >
              <Link href="/admin/products">Back to Products</Link>
            </Button>
          }
        />

        <NewProductTabBar />

        <NewProductFormLayout />
      </div>
    </PageContainer>
  );
}
