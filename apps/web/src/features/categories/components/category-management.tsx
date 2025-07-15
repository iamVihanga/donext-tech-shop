"use client";

import { useCreateCategory } from "@/features/categories/actions/use-create-category";
import { useDeleteCategory } from "@/features/categories/actions/use-delete-category";
import { useGetCategories } from "@/features/categories/actions/use-get-category";
import { useMoveCategory } from "@/features/categories/actions/use-move-category";
import { useUpdateCategory } from "@/features/categories/actions/use-update-category";
import { AddNewCategory } from "@/features/categories/components/add-new-category";
import { UpdateCategory } from "@/features/categories/components/update-category";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  FolderIcon,
  GripVerticalIcon,
  PlusIcon,
  TrashIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  children?: CategoryTreeNode[];
  parentId?: string | null;
  path?: string | null;
  level?: number | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: string;
  updatedAt?: string | null;
}

interface SortableCategoryItemProps {
  node: CategoryTreeNode;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onEdit: (node: CategoryTreeNode) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

const SortableCategoryItem: React.FC<SortableCategoryItemProps> = ({
  node,
  level,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddChild
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-background border border-border rounded-lg p-3 mb-2 hover:bg-muted/50 transition-colors",
        isDragging && "shadow-lg",
        level > 0 && "ml-6"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
          >
            <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Expand/Collapse button */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(node.id)}
              className="p-0 h-auto w-auto"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-4" />
          )}

          {/* Category icon and name */}
          <div className="flex items-center space-x-2">
            <FolderIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">{node.name}</span>
            {!node.isActive && (
              <span className="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddChild(node.id)}
            className="h-8 w-8 p-0"
            title="Add subcategory"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(node)}
            className="h-8 w-8 p-0"
            title="Edit category"
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(node.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            title="Delete category"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
      {node.description && (
        <p className="text-sm text-muted-foreground mt-2 ml-8">
          {node.description}
        </p>
      )}
    </div>
  );
};

interface CategoryListProps {
  categories: CategoryTreeNode[];
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  onEdit: (node: CategoryTreeNode) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  expandedItems,
  onToggle,
  onEdit,
  onDelete,
  onAddChild
}) => {
  const renderCategory = (node: CategoryTreeNode, level: number = 0) => {
    const isExpanded = expandedItems.has(node.id);

    return (
      <div key={node.id}>
        <SortableCategoryItem
          node={node}
          level={level}
          isExpanded={isExpanded}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
        {isExpanded && node.children && node.children.length > 0 && (
          <div className="ml-6">
            {node.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {categories.map((category) => renderCategory(category))}
    </div>
  );
};

export default function CategoryManagement() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] =
    useState<CategoryTreeNode | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    data: categoriesData,
    isLoading,
    refetch
  } = useGetCategories({
    page: 1,
    limit: 1000
  });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { mutate: moveCategory, isPending: isMoving } = useMoveCategory();

  const handleToggle = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleEdit = (node: CategoryTreeNode) => {
    setEditingCategory(node);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      deleteCategory(id, {
        onSuccess: () => {
          toast.success("Category deleted successfully");
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to delete category");
        }
      });
    }
  };

  const handleAddChild = (parentId: string) => {
    setAddingChildTo(parentId);
    setShowAddCategory(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const draggedCategoryId = active.id as string;
    const droppedOverCategoryId = over.id as string;

    // Find the dragged category and the category it's being dropped over
    const findCategoryInTree = (
      categories: CategoryTreeNode[],
      id: string
    ): CategoryTreeNode | null => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.children) {
          const found = findCategoryInTree(category.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const categoryTree = categoriesData?.data || [];
    const draggedCategory = findCategoryInTree(categoryTree, draggedCategoryId);
    const droppedOverCategory = findCategoryInTree(
      categoryTree,
      droppedOverCategoryId
    );

    if (!draggedCategory || !droppedOverCategory) {
      return;
    }

    // Prevent dropping a category onto itself or its children
    if (draggedCategory.id === droppedOverCategory.id) {
      return;
    }

    // Get the new parent - if dropping over a category, make it the parent
    const newParentId = droppedOverCategory.id;

    // Calculate new sort order (add to the end of the new parent's children)
    const siblingCategories = droppedOverCategory.children || [];
    const newSortOrder = siblingCategories.length;

    // Move the category
    moveCategory(
      {
        json: {
          categoryId: draggedCategoryId,
          newParentId,
          newSortOrder
        }
      },
      {
        onSuccess: () => {
          toast.success("Category moved successfully");
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to move category");
        }
      }
    );
  };

  // Auto-expand root level categories
  useEffect(() => {
    if (categoriesData?.data) {
      const rootCategories = categoriesData.data.filter(
        (cat: any) => !cat.parentId
      );
      setExpandedItems(new Set(rootCategories.map((cat: any) => cat.id)));
    }
  }, [categoriesData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get all category IDs for sortable context
  const getAllCategoryIds = (categories: CategoryTreeNode[]): string[] => {
    const ids: string[] = [];
    const traverse = (cats: CategoryTreeNode[]) => {
      cats.forEach((cat) => {
        ids.push(cat.id);
        if (cat.children) {
          traverse(cat.children);
        }
      });
    };
    traverse(categories);
    return ids;
  };

  const findCategoryInTree = (
    categories: CategoryTreeNode[],
    id: string
  ): CategoryTreeNode | null => {
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children) {
        const found = findCategoryInTree(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const categoryTree = categoriesData?.data || [];
  const allCategoryIds = getAllCategoryIds(categoryTree);
  const activeCategory = activeId
    ? findCategoryInTree(categoryTree, activeId)
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Category Management</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your product categories with drag and drop functionality
            </p>
          </div>
          <Button onClick={() => setShowAddCategory(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allCategoryIds}
            strategy={verticalListSortingStrategy}
          >
            {categoryTree && categoryTree.length > 0 ? (
              <CategoryList
                categories={categoryTree}
                expandedItems={expandedItems}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddChild}
              />
            ) : (
              <div className="text-center py-8">
                <FolderIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">
                  No categories found
                </h3>
                <p className="text-muted-foreground">
                  Get started by creating your first category.
                </p>
                <Button
                  onClick={() => setShowAddCategory(true)}
                  className="mt-4"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </div>
            )}
          </SortableContext>

          <DragOverlay>
            {activeCategory && (
              <div className="bg-background border border-border rounded-lg p-3 shadow-lg opacity-90">
                <div className="flex items-center space-x-3">
                  <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
                  <FolderIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{activeCategory.name}</span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* Add Category Modal */}
        <AddNewCategory
          open={showAddCategory}
          setOpen={setShowAddCategory}
          parentId={addingChildTo}
        />

        {/* Edit Category Modal */}
        {editingCategory && (
          <UpdateCategory
            open={!!editingCategory}
            setOpen={(open) => !open && setEditingCategory(null)}
            updateCategoryId={editingCategory.id}
          />
        )}
      </CardContent>
    </Card>
  );
}
