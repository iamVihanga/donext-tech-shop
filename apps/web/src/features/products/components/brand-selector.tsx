"use client";

import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { useGetBrands } from "@/features/brands/actions/use-brands";
import { CreateBrandDialog } from "@/features/brands/components/brands-table/create-brand-dialog";

interface BrandSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function BrandSelector({
  value,
  onValueChange,
  placeholder = "Select a brand...",
  disabled = false,
  required = false
}: BrandSelectorProps) {
  const [createBrandOpen, setCreateBrandOpen] = useState(false);

  const { data: brandsData, isLoading } = useGetBrands({
    page: "1",
    limit: "100", // Get all brands for selector
    sort: "asc",
    search: ""
  });

  const brands = brandsData?.data || [];

  const handleBrandCreated = () => {
    // The brand list will automatically refresh due to React Query
    setCreateBrandOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select
            value={value}
            onValueChange={onValueChange}
            disabled={disabled || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {!required && (
                <SelectItem value="">
                  <span className="text-muted-foreground">
                    No brand selected
                  </span>
                </SelectItem>
              )}
              {brands.length === 0 && !isLoading ? (
                <SelectItem value="" disabled>
                  No brands available
                </SelectItem>
              ) : (
                brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCreateBrandOpen(true)}
          disabled={disabled}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <CreateBrandDialog
        open={createBrandOpen}
        onOpenChange={setCreateBrandOpen}
      />
    </>
  );
}
