"use client";

import { useGetCategories } from "../actions/use-get-category";

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
  value: string;
  onChange: (value: string) => void;
};

export function CategorySelector({ value, onChange }: Props) {
  const {
    data: categories,
    error: categoryError,
    isFetching
  } = useGetCategories({ page: 1, limit: 100 });

  return (
    <Select value={value} onValueChange={(val) => onChange(val)}>
      <SelectTrigger type="button" className="w-full" disabled={isFetching}>
        <SelectValue
          placeholder={
            isFetching ? "Categories Loading..." : "Select a Category"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {!categoryError && (
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories?.data?.map((category) => (
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
