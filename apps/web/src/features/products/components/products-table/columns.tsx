"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Product } from "@/features/products/schemas/products.zod";
import { Badge } from "@repo/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

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
        <div className="flex items-center gap-3 pl-1">
          <Image
            alt={thumbnail?.altText!}
            src={thumbnail?.imageUrl!}
            width={40}
            height={40}
            className="rounded-md object-cover w-10 h-10"
          />

          <Link
            href={`/admin/products/${row.original.id}`}
            className="hover:underline hover:font-semibold"
          >
            {row.original.name}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "shortDescription",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px] truncate">
          {row.original.shortDescription || "No description available"}
        </div>
      );
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      if (row.original.variants.length > 0) {
        return (
          <Badge variant={"outline"}>
            From LKR {parseInt(row.original?.variants[0]?.price!).toFixed(2)}
          </Badge>
        );
      }

      return (
        <Badge variant={"outline"}>
          LKR {parseInt(row.original.price).toFixed(2)}
        </Badge>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
