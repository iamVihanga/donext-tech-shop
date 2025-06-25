import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { Separator } from "@repo/ui/components/separator";

import { AddNewCategory } from "@/features/categories/components/add-new-category";
import { CategoriesTableActions } from "@/features/categories/components/categories-table/categories-table-actions";
import CategoriesListing from "@/features/categories/components/category-listing";

export default function ProductCategoriesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Product Categories"
          description="Manage your product categories here."
          actionComponent={<AddNewCategory />}
        />

        <Separator />

        <CategoriesTableActions />

        <CategoriesListing />
      </div>
    </PageContainer>
  );
}
