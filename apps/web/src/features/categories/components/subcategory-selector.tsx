"use client";

import { useGetCategoryById } from "../actions/use-get-category-by-id";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";

type Props = {
  categoryId?: string;
  value: string;
  onChange: (value: string) => void;
};

export function SubcategorySelector({ categoryId, value, onChange }: Props) {
  const {
    data: category,
    error: categoryError,
    isFetching
  } = useGetCategoryById(categoryId);

  return (
    <Select value={value} onValueChange={(val) => onChange(val)}>
      <SelectTrigger
        type="button"
        className="w-full"
        disabled={isFetching || !categoryId}
      >
        <SelectValue
          placeholder={
            !categoryId
              ? "Select category first"
              : isFetching
                ? "Loading subcategories..."
                : "Select a subcategory"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {!categoryError && (
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {category?.subcategories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
