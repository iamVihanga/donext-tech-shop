import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import CategoryManagement from "@/features/categories/components/category-management";

export default function ProductCategoriesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Product Categories"
          description="Manage your product categories with drag and drop functionality."
        />

        <Separator />

        <CategoryManagement />
      </div>
    </PageContainer>
  );
}
