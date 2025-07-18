"use client";

import { useGetCategories } from "@/features/categories/actions/use-get-category";
import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { FolderIcon } from "lucide-react";
import Link from "next/link";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  children?: CategoryNode[];
}

function CategoryCard({ category }: { category: CategoryNode }) {
  const childrenCount = category.children?.length || 0;
  const categoryUrl = `/products?category=${category.id}`;

  return (
    <Link href={categoryUrl}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FolderIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {category.description}
                </p>
              )}
              {childrenCount > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {childrenCount} subcategories
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CategoryGrid() {
  const {
    data: categories,
    isLoading,
    error
  } = useGetCategories({
    page: 1,
    limit: 100
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !categories?.data || categories.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">No categories found</h3>
        <p className="text-muted-foreground">
          Categories will appear here once they are created.
        </p>
      </div>
    );
  }

  // Filter only root categories for the main display
  const rootCategories = categories.data.filter(
    (category) => !category.parentId
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rootCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
