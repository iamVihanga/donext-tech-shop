"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { Loader, PlusIcon } from "lucide-react";
import { useGetCategoryById } from "../actions/use-get-category-by-id";

import { AddNewSubcategory } from "./add-new-subcategory";

type Props = {
  id: string;
};

export function SubcategorySection({ id }: Props) {
  const { data, error, isFetching } = useGetCategoryById(id);

  if (isFetching) {
    return (
      <Card className="w-full h-[320px] bg-card/60 border-card flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-2 rounded-full bg-card">
            <Loader className="size-6 animate-spin" />
          </div>
          <p className="text-xs text-foreground/50">Loading Subcategories</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">
          Failed to load subcategories. Please try again.
        </p>
      </div>
    );
  }

  if (!data?.children || data.children.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Subcategories</h3>
          <AddNewSubcategory
            parentId={id}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Subcategory
              </Button>
            }
          />
        </div>

        {/* Empty State */}
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            No subcategories found for "{data?.name}".
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Add Subcategory" to create the first one.
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
          Subcategories ({data.children.length})
        </h3>

        <AddNewSubcategory
          parentId={id}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add Subcategory
            </Button>
          }
        />
      </div>

      {/* Subcategories Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Slug</th>
              <th className="text-left p-3 font-medium">Description</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.children.map((subcategory, index) => (
              <tr
                key={subcategory.id}
                className={index % 2 === 0 ? "bg-muted/25" : ""}
              >
                <td className="p-3 font-medium">{subcategory.name}</td>
                <td className="p-3 text-sm text-muted-foreground font-mono">
                  {subcategory.slug}
                </td>
                <td className="p-3 text-sm text-muted-foreground max-w-xs">
                  {subcategory.description ? (
                    <span className="line-clamp-2">
                      {subcategory.description}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50 italic">
                      No description
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <Badge
                    variant={subcategory.isActive ? "default" : "secondary"}
                    className={
                      subcategory.isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {subcategory.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  {new Date(subcategory.createdAt).toLocaleDateString("en-US", {
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

      {/* Footer Info */}
      <p className="text-sm text-muted-foreground">
        Showing {data.children.length} subcategories for category "{data.name}".
      </p>
    </div>
  );
}
