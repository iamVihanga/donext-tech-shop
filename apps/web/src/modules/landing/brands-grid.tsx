"use client";

import { useGetBrands } from "@/features/brands/actions/use-brands";
import { Building2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function BrandsGrid() {
  const {
    data: brandsData,
    isLoading,
    error
  } = useGetBrands({
    page: "1",
    limit: "50", // Show more brands on the brands page
    sort: "asc",
    search: ""
  });

  const brands = brandsData?.data?.filter((brand) => brand.isActive) || [];

  if (isLoading) {
    return (
      <div className="bg-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-zinc-800 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-zinc-800 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="group">
                <div className="bg-zinc-800 rounded-xl p-8 text-center space-y-4 animate-pulse">
                  <div className="w-20 h-20 bg-zinc-700 rounded-full mx-auto"></div>
                  <div className="h-5 bg-zinc-700 rounded w-24 mx-auto"></div>
                  <div className="h-3 bg-zinc-700 rounded w-32 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || brands.length === 0) {
    return (
      <div className="bg-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-800 rounded-full mb-6">
              <Building2Icon className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No brands found
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              Brands will appear here once they are added to the system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.id}`}
            className="group"
          >
            <div className="relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300 hover:bg-zinc-800/70 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 border border-zinc-700/50 hover:border-amber-500/30">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Brand Logo */}
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {brand.imageUrl ? (
                    <Image
                      src={brand.imageUrl}
                      alt={`${brand.name} logo`}
                      width={60}
                      height={60}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement!;
                        parent.innerHTML = `
                            <div class="w-8 h-8 text-zinc-400">
                              <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            </div>
                          `;
                      }}
                    />
                  ) : (
                    <Building2Icon className="w-8 h-8 text-zinc-400" />
                  )}
                </div>
              </div>

              {/* Brand Info */}
              <div className="space-y-2 relative z-10">
                <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors duration-300">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2 group-hover:text-zinc-300 transition-colors duration-300">
                    {brand.description}
                  </p>
                )}
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 group-hover:w-12 transition-all duration-300"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-16">
        <Link
          href="/brands"
          className="inline-flex items-center px-8 py-3 border border-amber-500/30 text-amber-400 hover:text-amber-300 hover:border-amber-400/50 rounded-lg font-medium transition-all duration-300 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20"
        >
          View All Brands
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
