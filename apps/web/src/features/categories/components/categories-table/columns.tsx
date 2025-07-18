"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { CategoryWithSubcategories } from "@/features/categories/schemas/categories.zod";
import { cn } from "@/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import Link from "next/link";

export const columns: ColumnDef<CategoryWithSubcategories>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 pl-2">
          <div
            className={cn(`size-2 rounded-full`, {
              "bg-green-500": row.original.isActive,
              "bg-yellow-500": !row.original.isActive
            })}
          />
          <Link
            href={`/admin/products/categories/${row.original.id}`}
            className="hover:underline hover:font-semibold"
          >
            {row.original.name}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    accessorKey: "children",
    header: "Sub Categories",
    cell: ({ row }) => {
      const childrenCount =
        row.original.children?.length ||
        row.original.subcategories?.length ||
        0;
      return <Badge variant={"outline"}>{childrenCount} Sub Categories</Badge>;
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
