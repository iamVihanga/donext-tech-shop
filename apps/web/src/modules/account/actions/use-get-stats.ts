import { useQuery } from "@tanstack/react-query";

import { useWishlistStore } from "@/features/wishlist/store";
import { getClient } from "@/lib/rpc/client";

export const useGetUserStats = (userId: string | null) => {
  const query = useQuery({
    queryKey: ["stats", { userId }],
    queryFn: async () => {
      if (!userId) {
        return {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          wishlistItems: 0
        };
      }

      const rpcClient = await getClient();

      const allOrdersRes = await rpcClient.api.orders["my-orders"].$get({
        query: {
          limit: (100 * 100 * 100).toString(),
          page: "1"
        }
      });

      if (!allOrdersRes.ok) {
        throw new Error(`Failed to fetch orders: ${allOrdersRes.statusText}`);
      }

      const allOrdersData = await allOrdersRes.json();

      const allOrders = allOrdersData.data;
      const pendingOrders = allOrdersData.data.filter(
        (order) => order.orderStatus === "pending"
      );
      const completedOrders = allOrdersData.data.filter(
        (order) => order.orderStatus === "completed"
      );

      const wishlistItems = useWishlistStore.getState().products.length;

      return {
        totalOrders: allOrders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        wishlistItems
      };
    }
  });

  return query;
};
