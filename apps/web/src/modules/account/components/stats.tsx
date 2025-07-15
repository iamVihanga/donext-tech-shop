"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  PackageIcon
} from "lucide-react";
import Link from "next/link";
import { useGetUserStats } from "../actions/use-get-stats";

type Props = {};

export function UserStats({}: Props) {
  const session = authClient.useSession();
  const {
    data: stats,
    error: stats_error,
    isFetching
  } = useGetUserStats(session.data?.user.id || null);

  if (session.isPending || isFetching) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="p-0 hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <PackageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="w-full">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-1 h-6 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (session.error || stats_error || !stats) {
    return <div>Error loading user stats</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-0 hover:shadow-md transition-shadow cursor-pointer">
        <Link href="/account/orders">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <PackageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>

      <Card className="p-0 hover:shadow-md transition-shadow cursor-pointer">
        <Link href="/account/orders?status=pending">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>

      <Card className="p-0 hover:shadow-md transition-shadow cursor-pointer">
        <Link href="/account/addresses">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Completed Orders
                </p>
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>

      <Card className="p-0 hover:shadow-md transition-shadow cursor-pointer">
        <Link href="/account/wishlist">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <HeartIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Wishlist Items
                </p>
                <p className="text-2xl font-bold">{stats.wishlistItems}</p>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
