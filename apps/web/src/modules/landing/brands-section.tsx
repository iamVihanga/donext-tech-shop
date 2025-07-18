"use client";

import { useGetBrands } from "@/features/brands/actions/use-brands";
import { Skeleton } from "@repo/ui/components/skeleton";
import Image from "next/image";

export function BrandsSection() {
  const {
    data: brandsData,
    isLoading,
    error
  } = useGetBrands({
    page: "1",
    limit: "4", // Show at most 4 brands
    sort: "asc",
    search: ""
  });

  const brands = brandsData?.data?.filter((brand) => brand.isActive) || [];

  if (isLoading) {
    return (
      <div className="mx-auto my-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-full aspect-square rounded-md"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || brands.length === 0) {
    return null; // Don't show the section if there are no brands
  }

  return (
    <div className="mx-auto my-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="w-full h-full group aspect-square rounded-md overflow-hidden relative"
          >
            <Image
              src={brand.imageUrl || "/placeholder.png"}
              alt={brand.name}
              width={200}
              height={200}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />

            <div className="hidden group-hover:flex absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-muted to-transparent">
              <div className="w-full flex flex-col items-center justify-end gap-1 pb-3">
                <h2 className="font-heading text-sm font-extrabold uppercase group-hover:text-amber-500">
                  {brand.name}
                </h2>

                <p className="text-xs text-muted-foreground">
                  {brand.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
