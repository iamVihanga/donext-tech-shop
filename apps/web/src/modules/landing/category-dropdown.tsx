"use client";

import { useGetCategoryTree } from "@/features/categories/actions/use-get-category-tree";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ChevronDownIcon, ChevronRightIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import { forwardRef, useEffect, useRef, useState } from "react";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  path?: string | null;
  children?: CategoryNode[];
}

interface CategoryItemProps {
  category: CategoryNode;
  isSubmenu?: boolean;
  onCategoryClick?: () => void;
}

const CategoryItem = forwardRef<HTMLAnchorElement, CategoryItemProps>(
  ({ category, isSubmenu = false, onCategoryClick }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const categoryUrl = `/products?category=${category.id}`;

    return (
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          ref={ref}
          href={categoryUrl}
          onClick={onCategoryClick}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
            "focus:bg-zinc-100 focus:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-zinc-100",
            "rounded-md",
            isSubmenu
              ? "text-zinc-600 dark:text-zinc-400"
              : "text-zinc-900 dark:text-zinc-100"
          )}
        >
          <div className="flex items-center space-x-2">
            <FolderIcon className="h-4 w-4" />
            <span className="truncate">{category.name}</span>
          </div>
          {hasChildren && (
            <ChevronRightIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          )}
        </Link>

        {/* Submenu - only show when this specific item is hovered */}
        {hasChildren && isHovered && (
          <div className="absolute left-full top-0 z-50 min-w-[200px] opacity-100 visible transition-all duration-200 ml-1">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg p-1">
              {category.children!.map((child) => (
                <CategoryItem
                  key={child.id}
                  category={child}
                  isSubmenu={true}
                  onCategoryClick={onCategoryClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CategoryItem.displayName = "CategoryItem";

export function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: categories, isLoading, error } = useGetCategoryTree();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-24" />
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <Button
        variant="ghost"
        className="h-9 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <div className="flex items-center space-x-2">
          <FolderIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Categories</span>
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 w-[300px] md:w-[350px]">
            {categories.length > 0 ? (
              <div className="flex flex-col space-y-1">
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    onCategoryClick={handleCategoryClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderIcon className="h-12 w-12 text-zinc-400 dark:text-zinc-500 mb-2" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No categories available
                </p>
              </div>
            )}

            {/* View All Categories Link */}
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-3">
              <Link
                href="/categories"
                onClick={handleCategoryClick}
                className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              >
                View All Categories
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
