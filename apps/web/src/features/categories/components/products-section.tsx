"use client";

import { Badge } from "@repo/ui/components/badge";
import { Card } from "@repo/ui/components/card";
import { Loader } from "lucide-react";

import { useGetProductsByCategory } from "@/features/products/actions/use-get-products-by-category";
import { Button } from "@repo/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  id: string;
  categoryName?: string;
};

export function ProductsSection({ id, categoryName }: Props) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { data, error, isFetching } = useGetProductsByCategory(id, {
    page,
    limit: 10,
    sort: "desc",
    search
  });

  if (isFetching) {
    return (
      <Card className="w-full h-[320px] bg-card/60 border-card flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-2 rounded-full bg-card">
            <Loader className="size-6 animate-spin" />
          </div>
          <p className="text-xs text-foreground/50">Loading Products</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Products</h3>
        </div>

        {/* Empty State */}
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            No products found for "{categoryName}".
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Add Product" to create the first one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {`Products (${data.data.length}/${data.meta.totalCount})`}
        </h3>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Description</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((product, index) => (
              <tr
                key={product.id}
                className={index % 2 === 0 ? "bg-muted/25" : ""}
              >
                <td className="p-3 font-medium flex items-center gap-2">
                  <Image
                    src={
                      product.images.filter((img) => img.isThumbnail)[0]
                        ?.imageUrl || product.images[0]?.imageUrl!
                    }
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </td>

                <td className="p-3 text-sm text-muted-foreground max-w-xs truncate">
                  {product.shortDescription}
                </td>
                <td className="p-3">
                  <Badge
                    variant={product.isActive ? "default" : "secondary"}
                    className={
                      product.isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Page navigation next and prev buttons */}
      <div className="flex items-center justify-between py-4">
        <Button
          variant="outline"
          disabled={data.meta.currentPage === 1}
          onClick={() => setPage(data.meta.currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={data.meta.currentPage === data.meta.totalPages}
          onClick={() => setPage(data.meta.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
