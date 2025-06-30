import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import { ProductsSection } from "@/features/categories/components/products-section";
import { SubcategorySection } from "@/features/categories/components/subcategory-section";
import { getClient } from "@/lib/rpc/server";
import { Separator } from "@repo/ui/components/separator";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SingleCategoryPage(props: Props) {
  const params = await props.params;

  const rpcClient = await getClient();

  const res = await rpcClient.api.categories[":id"].$get({
    param: { id: params.id }
  });

  if (!res.ok) {
    const errorData = await res.json();

    return (
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <AppPageShell
            title="Something went wrong"
            description={`Error: ${errorData.message}`}
            actionComponent={``}
          />

          <Separator />
        </div>
      </PageContainer>
    );
  }

  const category = await res.json();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={`${category.name} Category`}
          description={`Manage the ${category.name} category here.`}
          actionComponent={``}
        />

        <Separator />

        <SubcategorySection id={category.id} />

        <Separator />

        <ProductsSection id={category.id} categoryName={category.name} />
      </div>
    </PageContainer>
  );
}
