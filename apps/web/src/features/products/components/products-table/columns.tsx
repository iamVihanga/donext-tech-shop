"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Product } from "@/features/products/schemas/products.zod";
import { Badge } from "@repo/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(price);
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      let thumbnail = row.original.images.filter((img) => img.isThumbnail)[0];
      if (!thumbnail) {
        thumbnail = row.original.images[0];
      }

      return (
        <div className="flex items-center gap-2 sm:gap-3 pl-1">
          <Image
            alt={thumbnail?.altText!}
            src={thumbnail?.imageUrl!}
            width={40}
            height={40}
            className="rounded-md object-cover w-8 h-8 sm:w-10 sm:h-10"
          />

          <Link
            href={`/admin/products/${row.original.id}`}
            className="hover:underline hover:font-semibold text-sm sm:text-base truncate"
          >
            {row.original.name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "shortDescription",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="max-w-[120px] sm:max-w-[300px] truncate text-sm">
          {row.original.shortDescription || "No description available"}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      if (row.original.variants.length > 0) {
        return (
          <Badge variant={"outline"}>
            From{" "}
            {formatPrice(parseFloat(row.original?.variants[0]?.price!), "LKR")}
          </Badge>
        );
      }

      return (
        <Badge variant={"outline"}>
          {formatPrice(parseFloat(row.original.price), "LKR")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
