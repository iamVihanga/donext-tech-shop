"use client";

import { useGetCategoryTree } from "@/features/categories/actions/use-get-category-tree";
import { cn } from "@/lib/utils";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ChevronRightIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  path?: string | null;
  level?: number | null;
  children?: CategoryNode[];
}

interface CategoryNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick?: () => void;
}

export function CategoryNavbar({
  isOpen,
  onClose,
  onCategoryClick
}: CategoryNavbarProps) {
  const { data: categories, isLoading, error } = useGetCategoryTree();
  const [hoveredCategory, setHoveredCategory] = useState<CategoryNode | null>(
    null
  );
  const [secondLevelCategory, setSecondLevelCategory] =
    useState<CategoryNode | null>(null);
  const [thirdLevelCategory, setThirdLevelCategory] =
    useState<CategoryNode | null>(null);
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/shop?category=${categoryId}`);
    onClose();
    onCategoryClick?.();
  };

  const handleMouseEnter = (category: CategoryNode, level: number) => {
    if (level === 1) {
      setHoveredCategory(category);
      setSecondLevelCategory(null);
      setThirdLevelCategory(null);
    } else if (level === 2) {
      setSecondLevelCategory(category);
      setThirdLevelCategory(null);
    } else if (level === 3) {
      setThirdLevelCategory(category);
    }
  };

  const handleMouseLeave = () => {
    // Don't reset on mouse leave to allow navigation between columns
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg w-full sm:min-w-[800px] sm:max-w-[1200px] max-w-[95vw]">
        <div className="hidden sm:block">
          <div className="grid grid-cols-4 gap-0 min-h-[400px]">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="border-r border-border p-2 overflow-y-auto last:border-r-0"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 mb-4" />
                  {Array.from({ length: 8 }).map((_, rowIndex) => (
                    <Skeleton key={rowIndex} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:hidden p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 mb-4" />
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <Skeleton key={rowIndex} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg w-full sm:min-w-[400px] max-w-[95vw] p-4">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FolderIcon className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No categories available
          </p>
        </div>
      </div>
    );
  }

  // Filter root categories (level 0 or no parent)
  const rootCategories = categories.filter(
    (category) => !category.parentId || category.level === 0
  );

  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-secondary/90 backdrop-blur-md border border-border rounded-md shadow-lg w-full sm:min-w-[800px] sm:max-w-[1200px] max-w-[95vw]">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="p-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground mb-3">
              Categories
            </div>
            {rootCategories.map((category) => (
              <div key={category.id} className="space-y-1">
                <button
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400",
                    "flex items-center justify-between group font-medium"
                  )}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="truncate">{category.name}</span>
                  {category.children && category.children.length > 0 && (
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {category.children && category.children.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {category.children.slice(0, 3).map((child) => (
                      <button
                        key={child.id}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                          "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400",
                          "text-muted-foreground"
                        )}
                        onClick={() => handleCategoryClick(child.id)}
                      >
                        <span className="truncate">{child.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-4 gap-0 min-h-[400px] max-h-[500px]">
          {/* First Column - Root Categories */}
          <div className="border-r border-border p-2 overflow-y-auto">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main Categories
              </div>
              {rootCategories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400",
                    "flex items-center justify-between group",
                    hoveredCategory?.id === category.id &&
                      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  )}
                  onMouseEnter={() => handleMouseEnter(category, 1)}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="truncate">{category.name}</span>
                  {category.children && category.children.length > 0 && (
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Second Column - First Level Children */}
          <div className="border-r border-border p-2 overflow-y-auto">
            <div className="space-y-1">
              {hoveredCategory && (
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {hoveredCategory.name}
                </div>
              )}
              {hoveredCategory?.children?.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400",
                    "flex items-center justify-between group",
                    secondLevelCategory?.id === category.id &&
                      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  )}
                  onMouseEnter={() => handleMouseEnter(category, 2)}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="truncate">{category.name}</span>
                  {category.children && category.children.length > 0 && (
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Third Column - Second Level Children */}
          <div className="border-r border-border p-2 overflow-y-auto">
            <div className="space-y-1">
              {secondLevelCategory && (
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {secondLevelCategory.name}
                </div>
              )}
              {secondLevelCategory?.children?.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400",
                    "flex items-center justify-between group",
                    thirdLevelCategory?.id === category.id &&
                      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  )}
                  onMouseEnter={() => handleMouseEnter(category, 3)}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="truncate">{category.name}</span>
                  {category.children && category.children.length > 0 && (
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-amber-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fourth Column - Third Level Children */}
          <div className="p-2 overflow-y-auto">
            <div className="space-y-1">
              {thirdLevelCategory && (
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {thirdLevelCategory.name}
                </div>
              )}
              {thirdLevelCategory?.children?.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400",
                    "flex items-center group"
                  )}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with View All Categories */}
      <div className="border-t border-border p-3">
        <Link
          href="/shop"
          onClick={() => {
            onClose();
            onCategoryClick?.();
          }}
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-md transition-colors"
        >
          View All Categories
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
