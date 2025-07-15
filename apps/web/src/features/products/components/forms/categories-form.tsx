"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetCategories } from "@/features/categories/actions/use-get-category";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateProductStore } from "../../store/create-product-store";

interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  children?: CategoryTreeNode[];
  path?: string;
  level?: number;
}

interface CategoryNodeProps {
  node: CategoryTreeNode;
  selectedId: string;
  onSelect: (node: CategoryTreeNode) => void;
  level?: number;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  node,
  selectedId,
  onSelect,
  level = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className={cn("border-l-2 border-muted", level > 0 && "ml-4")}>
      <div className="flex items-center space-x-2 py-2 px-3 hover:bg-muted/50 rounded-sm">
        {hasChildren ? (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto w-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
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

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 justify-start h-auto p-2 font-normal",
            isSelected && "bg-primary text-primary-foreground"
          )}
          onClick={() => onSelect(node)}
        >
          <div className="flex items-center space-x-2">
            {isSelected && <CheckIcon className="h-4 w-4" />}
            <span>{node.name}</span>
          </div>
        </Button>
      </div>

      {hasChildren && isOpen && (
        <div className="ml-4">
          {node.children!.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryBreadcrumbProps {
  path: Array<{ id: string; name: string; slug: string }>;
}

const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({ path }) => {
  if (path.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
      <span className="text-xs font-medium">Selected:</span>
      {path.map((item, index) => (
        <span key={item.id} className="flex items-center">
          {index > 0 && <ChevronRightIcon className="h-3 w-3 mx-1" />}
          <span
            className={cn(
              "font-medium",
              index === path.length - 1 && "text-foreground"
            )}
          >
            {item.name}
          </span>
        </span>
      ))}
    </div>
  );
};

export default function CategoriesForm() {
  const { categories, setCategories } = useCreateProductStore();
  const { data: categoriesData, isLoading } = useGetCategories({
    page: 1,
    limit: 1000
  });

  // Build category path for breadcrumb
  const buildCategoryPath = (
    categoryId: string,
    categoriesTree: CategoryTreeNode[]
  ): Array<{ id: string; name: string; slug: string }> => {
    const findPath = (
      nodes: CategoryTreeNode[],
      targetId: string,
      currentPath: Array<{ id: string; name: string; slug: string }> = []
    ): Array<{ id: string; name: string; slug: string }> | null => {
      for (const node of nodes) {
        const newPath = [
          ...currentPath,
          { id: node.id, name: node.name, slug: node.slug }
        ];

        if (node.id === targetId) {
          return newPath;
        }

        if (node.children && node.children.length > 0) {
          const found = findPath(node.children, targetId, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findPath(categoriesTree, categoryId) || [];
  };

  const handleCategorySelect = (node: CategoryTreeNode) => {
    const categoryPath = buildCategoryPath(node.id, categoriesData?.data || []);

    setCategories({
      selectedCategoryId: node.id,
      categoryPath,
      status: "valid"
    });
  };

  const validateSelection = () => {
    if (!categories.selectedCategoryId) {
      setCategories({
        ...categories,
        status: "invalid"
      });
      return;
    }

    setCategories({
      ...categories,
      status: "valid"
    });
  };

  // Validate on mount and when selection changes
  useEffect(() => {
    validateSelection();
  }, [categories.selectedCategoryId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Categories</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select the category for your product. You can choose from any level of
          the category hierarchy.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Breadcrumb */}
        <CategoryBreadcrumb path={categories.categoryPath} />

        {/* Category Tree */}
        <div className="border rounded-lg">
          <ScrollArea className="h-96">
            <div className="p-4">
              {categoriesData?.data && categoriesData.data.length > 0 ? (
                categoriesData.data.map((node) => (
                  <CategoryNode
                    key={node.id}
                    node={node}
                    selectedId={categories.selectedCategoryId}
                    onSelect={handleCategorySelect}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No categories found</p>
                  <p className="text-sm">
                    Create categories in the admin panel first
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Validation Status */}
        {categories.status === "invalid" && (
          <div className="text-sm text-destructive">
            Please select a category for your product.
          </div>
        )}

        {categories.status === "valid" && categories.selectedCategoryId && (
          <div className="text-sm text-green-600">
            ✓ Category selected successfully
          </div>
        )}
      </CardContent>
    </Card>
  );
}
