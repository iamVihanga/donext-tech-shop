"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryCellAction } from "./inventory-cell-action";

import { Product } from "@/features/products/schemas/products.zod";
import { getStockStatus } from "@/lib/helpers";
import { Badge } from "@repo/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

export const inventoryColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      let thumbnail = row.original.images.filter((img) => img.isThumbnail)[0];
      if (!thumbnail) {
        thumbnail = row.original.images[0];
      }

      return (
        <div className="flex items-center gap-3 pl-1">
          <Image
            alt={thumbnail?.altText!}
            src={thumbnail?.imageUrl!}
            width={40}
            height={40}
            className="rounded-md object-cover w-10 h-10"
          />

          <div>
            <Link
              href={`/admin/products/${row.original.id}`}
              className="hover:underline hover:font-semibold font-medium"
            >
              {row.original.name}
            </Link>
            <div className="text-sm text-muted-foreground">
              SKU: {row.original.sku || "N/A"}
            </div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.original.variants;

      if (!variants || variants.length === 0) {
        return <Badge variant="secondary">No Variants</Badge>;
      }

      return (
        <Badge variant="outline">
          {variants.length} Variant{variants.length > 1 ? "s" : ""}
        </Badge>
      );
    }
  },
  {
    accessorKey: "stockQuantity",
    header: "Main Stock",
    cell: ({ row }) => {
      const product = row.original;
      const stockStatus = getStockStatus(product);

      let badgeVariant: "default" | "destructive" | "secondary" | "outline" =
        "default";

      if (stockStatus === "out-of-stock") {
        badgeVariant = "destructive";
      } else if (stockStatus === "low") {
        badgeVariant = "secondary";
      } else {
        badgeVariant = "outline";
      }

      return (
        <div className="space-y-1">
          <Badge variant={badgeVariant}>
            {product.stockQuantity || 0} Units
          </Badge>
          {product.minStockLevel && (
            <div className="text-xs text-muted-foreground">
              Min: {product.minStockLevel}
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "variantStock",
    header: "Variant Stock",
    cell: ({ row }) => {
      const variants = row.original.variants;

      if (!variants || variants.length === 0) {
        return <span className="text-muted-foreground">N/A</span>;
      }

      const totalVariantStock = variants.reduce(
        (sum, variant) => sum + (variant.stockQuantity || 0),
        0
      );

      const lowStockVariants = variants.filter(
        (variant) => (variant.stockQuantity || 0) <= 5
      ).length;

      return (
        <div className="space-y-1">
          <Badge variant="outline">{totalVariantStock} Total</Badge>
          {lowStockVariants > 0 && (
            <Badge variant="destructive" className="text-xs">
              {lowStockVariants} Low
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "reservedQuantity",
    header: "Reserved",
    cell: ({ row }) => {
      const reserved = row.original.reservedQuantity || 0;

      return (
        <Badge variant={reserved > 0 ? "secondary" : "outline"}>
          {reserved} Units
        </Badge>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      const stockStatus = getStockStatus(product);

      let badgeVariant: "default" | "destructive" | "secondary" | "outline" =
        "default";
      let statusText = "";

      switch (stockStatus) {
        case "out-of-stock":
          badgeVariant = "destructive";
          statusText = "Out of Stock";
          break;
        case "low":
          badgeVariant = "secondary";
          statusText = "Low Stock";
          break;
        case "in-stock":
          badgeVariant = "default";
          statusText = "In Stock";
          break;
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <InventoryCellAction data={row.original} />
  }
];
