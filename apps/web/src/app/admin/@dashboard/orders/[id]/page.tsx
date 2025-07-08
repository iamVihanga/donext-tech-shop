import PageContainer from "@/components/dashboard/page-container";
import { AppPageShell } from "@/components/dashboard/page-shell";
import SingleOrderView from "@/features/orders/components/single-order-view";
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

  const res = await rpcClient.api.orders[":id"].$get({
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

  const order = await res.json();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={`Order: #${order.id.slice(0, 12)}...`}
          description={`Manage the selected order here.`}
          actionComponent={``}
        />

        <Separator />

        <SingleOrderView order={order} />
      </div>
    </PageContainer>
  );
}
