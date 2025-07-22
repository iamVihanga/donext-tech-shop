import { cn } from "@/lib/utils";
import { CategoryWithChildren } from "@repo/database";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Button } from "@repo/ui/components/button";

interface CategoryFilterProps {
  categories: CategoryWithChildren[];
  isLoading?: boolean;
  onSelect: (categoryId: string) => void;
  selectedCategoryId: string | null;
}

export function CategoryFilter({
  categories,
  isLoading,
  onSelect,
  selectedCategoryId,
}: CategoryFilterProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-8 bg-muted/30 rounded-md animate-pulse mb-1"
            />
          ))}
      </div>
    );
  }

  const renderCategory = (category: CategoryWithChildren) => {
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategoryId === category.id;

    return (
      <AccordionItem key={category.id} value={category.id}>
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start h-8 px-2 font-normal text-left",
              isSelected &&
                "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            )}
            onClick={() => onSelect(category.id)}
          >
            <span className="flex-grow text-left">{category.name}</span>
            {hasChildren && category.children && (
              <span className="ml-auto text-xs text-muted-foreground">
                ({category.children.length})
              </span>
            )}
          </Button>
          {hasChildren && <AccordionTrigger className="h-8 px-0" />}
        </div>

        {hasChildren && category.children && (
          <AccordionContent className="pl-2">
            <div className="space-y-1 border-l border-border pl-2">
              {category.children.map((subcat) => (
                <Button
                  key={subcat.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start h-8 px-2 font-normal text-left",
                    selectedCategoryId === subcat.id &&
                      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  )}
                  onClick={() => onSelect(subcat.id)}
                >
                  {subcat.name}
                </Button>
              ))}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">Categories</h3>
      <Accordion type="multiple" className="w-full space-y-1">
        {categories.map((category) => renderCategory(category))}
      </Accordion>
    </div>
  );
}
