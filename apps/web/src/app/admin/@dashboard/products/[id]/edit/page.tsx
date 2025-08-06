import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { NewProductFormLayout } from "@/features/products/components/new-product-form-layout";
import NewProductTabBar from "@/features/products/components/new-product-tab-bar";
import { ProductEditWrapper } from "@/features/products/components/product-edit-wrapper";
import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Update Product"
          description="Edit and update your product information."
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

        <ProductEditWrapper productId={id}>
          <NewProductTabBar />
          <NewProductFormLayout />
        </ProductEditWrapper>
      </div>
    </PageContainer>
  );
}
