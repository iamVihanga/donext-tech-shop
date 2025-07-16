"use client";

import { useGetCategoryTree } from "@/features/categories/actions/use-get-category-tree";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@repo/ui/components/collapsible";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ChevronDownIcon, ChevronRightIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  path?: string | null;
  children?: CategoryNode[];
}

interface MobileCategoryItemProps {
  category: CategoryNode;
  level?: number;
  onCategoryClick?: () => void;
}

function MobileCategoryItem({
  category,
  level = 0,
  onCategoryClick
}: MobileCategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const categoryUrl = `/products?category=${category.id}`;

  return (
    <div
      className={cn(
        "border-l-2 border-zinc-200 dark:border-zinc-700",
        level > 0 && "ml-4"
      )}
    >
      <div className="flex items-center space-x-2 py-2">
        {hasChildren ? (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto w-auto">
                {isOpen ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        ) : (
          <div className="w-4" />
        )}

        <Link
          href={categoryUrl}
          onClick={onCategoryClick}
          className={cn(
            "flex items-center space-x-2 flex-1 px-3 py-2 rounded-md transition-colors",
            "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
            "text-sm font-medium"
          )}
        >
          <FolderIcon className="h-4 w-4" />
          <span className="truncate">{category.name}</span>
        </Link>
      </div>

      {hasChildren && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="ml-4">
            {category.children!.map((child) => (
              <MobileCategoryItem
                key={child.id}
                category={child}
                level={level + 1}
                onCategoryClick={onCategoryClick}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

interface MobileCategoryMenuProps {
  onCategoryClick?: () => void;
}

export function MobileCategoryMenu({
  onCategoryClick
}: MobileCategoryMenuProps) {
  const { data: categories, isLoading, error } = useGetCategoryTree();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FolderIcon className="h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-2" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No categories available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 px-2 py-1">
        <FolderIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Categories</span>
      </div>

      <div className="space-y-1">
        {categories.map((category) => (
          <MobileCategoryItem
            key={category.id}
            category={category}
            onCategoryClick={onCategoryClick}
          />
        ))}
      </div>

      {/* View All Categories Link */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-3">
        <Link
          href="/categories"
          onClick={onCategoryClick}
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
        >
          View All Categories
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
