"use client";
import { Loader, SearchIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useGetProducts } from "@/features/products/actions/use-get-products";
import { getProductThumbnail } from "@/lib/helpers";
import { Card } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import Image from "next/image";
import Link from "next/link";

type Props = {};

export function SearchBar({}: Props) {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [open, setOpen] = useState(false);
  const { data, error, isPending } = useGetProducts({
    search: search || "no-product"
  });

  useEffect(() => {
    if (search && data && data.data.length > 0) {
      setOpen(true);
    }
  }, [data, error, isPending]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearch(e.target.value);

    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      setSearch(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="relative h-11 mx-4 hidden md:block">
        {/* Search Icon */}
        <div className="absolute h-full flex items-center left-2">
          <SearchIcon className="size-5 text-muted-foreground" />
        </div>
        {isPending && (
          <div className="absolute h-full flex items-center right-2">
            <Loader className="size-5 text-muted-foreground animate-spin" />
          </div>
        )}
        {(search || debouncedSearch) && data && !isPending && (
          <div
            onClick={() => {
              setOpen(false);
              setSearch("");
              setDebouncedSearch("");
            }}
            className="absolute h-full flex items-center right-2 cursor-pointer"
          >
            <XCircleIcon className="size-5 text-muted-foreground" />
          </div>
        )}

        <Input
          className="h-full pl-10"
          placeholder="iPhone 14 Pro Max, Gaming Laptop..."
          onChange={handleSearchChange}
          value={debouncedSearch}
        />
      </div>

      {open && (
        <div className="flex flex-col gap-3 bg-background border border-foreground/20 p-3 absolute z-50 top-full mt-2 rounded-md left-0 w-full">
          {data?.data.map((product) => (
            <Card
              className="p-2 flex items-center gap-2 flex-row overflow-hidden"
              key={product.id}
            >
              <Image
                src={getProductThumbnail(product) || "/assets/no-image.png"}
                alt={product.name}
                width={60}
                height={60}
                className="size-16 object-cover rounded-md"
              />

              <div className="flex flex-col space-y-1">
                <Link
                  className="text-sm font-medium hover:underline cursor-pointer"
                  href={`/products/${product.id}`}
                >
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground truncate w-full max-w-full">
                  {product.shortDescription || "No description available"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
