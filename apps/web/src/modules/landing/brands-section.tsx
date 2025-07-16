"use client";

import { useGetBrands } from "@/features/brands/actions/use-brands";
import { Building2Icon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
      <section className="py-24 bg-zinc-900">
        <div className="content-container mx-auto">
          <div className="text-center mb-20">
            <div className="h-12 w-64 bg-zinc-800 rounded-lg mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 w-96 bg-zinc-800 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="group">
                <div className="bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-10 border border-zinc-700/30">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-28 h-28 bg-zinc-700 rounded-2xl animate-pulse"></div>
                    <div className="h-6 w-24 bg-zinc-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || brands.length === 0) {
    return null; // Don't show the section if there are no brands
  }

  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Advanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(251,191,36,0.15),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(251,191,36,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(251,191,36,0.03)_50%,transparent_52%)]"></div>
      </div>

      <div className="content-container mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-300 bg-clip-text text-transparent leading-tight">
            Trusted Brands
          </h2>
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
            We partner with leading technology brands to bring you the highest
            quality products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.id}`}
              className="group"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="relative bg-zinc-800/30 backdrop-blur-sm rounded-3xl p-10 border border-zinc-700/30 hover:border-amber-500/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 hover:bg-zinc-800/50">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Brand Content */}
                <div className="relative z-10 flex flex-col items-center space-y-6">
                  {/* Brand Logo Container */}
                  <div className="relative">
                    <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                      {/* Inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {brand.imageUrl ? (
                        <Image
                          src={brand.imageUrl}
                          alt={`${brand.name} logo`}
                          width={80}
                          height={80}
                          className="object-contain relative z-10 filter brightness-100 group-hover:brightness-110 transition-all duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement!;
                            parent.innerHTML = `
                              <div class="w-12 h-12 text-zinc-400 group-hover:text-amber-500 transition-colors duration-500 relative z-10">
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <Building2Icon className="w-12 h-12 text-zinc-400 group-hover:text-amber-500 transition-colors duration-500 relative z-10" />
                      )}
                    </div>

                    {/* Outer ring on hover */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-500/0 group-hover:ring-amber-500/30 transition-all duration-500 scale-110"></div>
                  </div>

                  {/* Brand Name */}
                  <h3 className="font-semibold text-white text-xl group-hover:text-amber-400 transition-colors duration-500 text-center tracking-wide">
                    {brand.name}
                  </h3>

                  {/* Brand description if available */}
                  {brand.description && (
                    <p className="text-zinc-500 text-sm text-center line-clamp-2 group-hover:text-zinc-400 transition-colors duration-500">
                      {brand.description}
                    </p>
                  )}
                </div>

                {/* Bottom highlight bar */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 group-hover:w-20 transition-all duration-500 rounded-t-full"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Brands Link */}
        <div className="text-center mt-20">
          <Link
            href="/brands"
            className="group inline-flex items-center px-10 py-5 text-lg font-semibold text-amber-400 border-2 border-amber-400/40 rounded-2xl hover:text-zinc-900 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/30 backdrop-blur-sm bg-zinc-800/20 hover:bg-amber-400"
          >
            <span className="relative z-10">View All Brands</span>
            <ChevronRightIcon className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />

            {/* Button glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-400/30 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-amber-500/15 rounded-full animate-pulse animation-delay-2000"></div>
      </div>
    </section>
  );
}
