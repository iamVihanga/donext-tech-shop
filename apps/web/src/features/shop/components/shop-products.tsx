"use client";

import { useGetBrands } from "@/features/brands/actions/use-brands";
import { useGetCategoryTree } from "@/features/categories/actions/use-get-category-tree";

import { useGetProductsByCategory } from "@/features/products/actions/use-get-products-by-category";
import { useGetProducts } from "@/features/products/actions/use-get-products";

import { ProductCard } from "@/features/products/components/product-card";
import { Product } from "@/features/products/schemas/products.zod";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Filter,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useShopFilters } from "../hooks/use-shop-filters";
import { ShopPagination } from "./shop-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@repo/ui/components/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@repo/ui/components/sheet";
import { Badge } from "@repo/ui/components/badge";

export default function ShopProducts() {
  const {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
    categoryId,
    setCategoryId,
    brandId,
    setBrandId,
    resetFilters,
    isAnyFilterActive
  } = useShopFilters();

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery || "");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoryTree();

  // Fetch brands
  const { data: brandsData, isLoading: brandsLoading } = useGetBrands({
    limit: "100", // Get a reasonable number of brands
    sort: "asc"
  });

  // Fetch products (by category or all)
  const {
    data: productsData,
    isLoading: productsLoading,
    error
  } = categoryId
    ? useGetProductsByCategory(categoryId, {
        page,
        limit
      })
    : useGetProducts({
        page,
        limit,
        search: searchQuery || undefined,
        sort
      });

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearch(e.target.value);
  };

  // Update the search query parameter after debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(debouncedSearch);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(handler);
  }, [debouncedSearch, setSearchQuery, setPage]);

  // Filter products by brand if brandId is set
  const products = productsData?.data || [];
  const filteredProducts = brandId
    ? products.filter((product: any) => product.brandId === brandId)
    : products;

  // Find active category and brand for displaying names
  const activeCategoryName =
    categoryId && categories ? findCategoryName(categories, categoryId) : null;

  const activeBrand =
    brandId && brandsData
      ? brandsData.data.find((brand) => brand.id === brandId)
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Desktop Filters Sidebar */}
      <div className="hidden md:block">
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              {isAnyFilterActive && (
                <Button
                  onClick={resetFilters}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
            <CardDescription>Narrow down your search results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Categories</h3>
              <Accordion type="single" collapsible className="w-full">
                {!categoriesLoading && categories
                  ? categories.map((category) => (
                      <AccordionItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "flex-grow justify-start h-8 px-2 text-left font-normal",
                              categoryId === category.id &&
                                "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                            )}
                            onClick={() => {
                              setCategoryId(category.id);
                              setPage(1); // Reset to first page
                            }}
                          >
                            {category.name}
                          </Button>
                          {category.children &&
                            category.children.length > 0 && (
                              <AccordionTrigger className="h-8 px-0" />
                            )}
                        </div>
                        {category.children && category.children.length > 0 && (
                          <AccordionContent className="ml-4 border-l border-border pl-2">
                            {category.children.map((subcat) => (
                              <Button
                                key={subcat.id}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "w-full justify-start h-8 mb-1 font-normal",
                                  categoryId === subcat.id &&
                                    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                )}
                                onClick={() => {
                                  setCategoryId(subcat.id);
                                  setPage(1); // Reset to first page
                                }}
                              >
                                {subcat.name}
                              </Button>
                            ))}
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    ))
                  : Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-8 bg-muted/30 rounded-md animate-pulse mb-1"
                        />
                      ))}
              </Accordion>
            </div>

            <Separator />

            {/* Brands Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Brands</h3>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {!brandsLoading && brandsData
                  ? brandsData.data.map((brand) => (
                      <Button
                        key={brand.id}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start h-8 font-normal",
                          brandId === brand.id &&
                            "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        )}
                        onClick={() => {
                          setBrandId(brand.id === brandId ? null : brand.id);
                          setPage(1); // Reset to first page
                        }}
                      >
                        {brand.name}
                      </Button>
                    ))
                  : Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-8 bg-muted/30 rounded-md animate-pulse mb-1"
                        />
                      ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters Button */}
      <div className="md:hidden">
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {isAnyFilterActive && (
                <Badge variant="secondary" className="ml-2">
                  {countActiveFilters(searchQuery, categoryId, brandId)}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="pb-4">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Narrow down your search results
              </SheetDescription>
              {isAnyFilterActive && (
                <Button
                  onClick={() => {
                    resetFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </SheetHeader>

            <div className="space-y-6 mt-4">
              {/* Categories Filter - Mobile */}
              <div className="space-y-2">
                <h3 className="font-medium">Categories</h3>
                <Accordion type="single" collapsible className="w-full">
                  {!categoriesLoading && categories
                    ? categories.map((category) => (
                        <AccordionItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "flex-grow justify-start h-8 px-2 text-left font-normal",
                                categoryId === category.id &&
                                  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                              )}
                              onClick={() => {
                                setCategoryId(category.id);
                                setPage(1); // Reset to first page
                              }}
                            >
                              {category.name}
                            </Button>
                            {category.children &&
                              category.children.length > 0 && (
                                <AccordionTrigger className="h-8 px-0" />
                              )}
                          </div>
                          {category.children &&
                            category.children.length > 0 && (
                              <AccordionContent className="ml-4 border-l border-border pl-2">
                                {category.children.map((subcat) => (
                                  <Button
                                    key={subcat.id}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                      "w-full justify-start h-8 mb-1 font-normal",
                                      categoryId === subcat.id &&
                                        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                    )}
                                    onClick={() => {
                                      setCategoryId(subcat.id);
                                      setPage(1); // Reset to first page
                                    }}
                                  >
                                    {subcat.name}
                                  </Button>
                                ))}
                              </AccordionContent>
                            )}
                        </AccordionItem>
                      ))
                    : Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="h-8 bg-muted/30 rounded-md animate-pulse mb-1"
                          />
                        ))}
                </Accordion>
              </div>

              <Separator />

              {/* Brands Filter - Mobile */}
              <div className="space-y-2">
                <h3 className="font-medium">Brands</h3>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {!brandsLoading && brandsData
                    ? brandsData.data.map((brand) => (
                        <Button
                          key={brand.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-8 font-normal",
                            brandId === brand.id &&
                              "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          )}
                          onClick={() => {
                            setBrandId(brand.id === brandId ? null : brand.id);
                            setPage(1); // Reset to first page
                          }}
                        >
                          {brand.name}
                        </Button>
                      ))
                    : Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="h-8 bg-muted/30 rounded-md animate-pulse mb-1"
                          />
                        ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <Button
                className="w-full"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                View {filteredProducts.length} Products
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Products Section */}
      <div className="md:col-span-3 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={debouncedSearch}
              onChange={handleSearchChange}
            />
          </div>

          {/* Sort and View Options */}
          <div className="flex gap-2">
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value as any);
                setPage(1); // Reset to first page when changing sort
              }}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center">
                    <ArrowDownAZ className="h-4 w-4 mr-2" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center">
                    <ArrowUpAZ className="h-4 w-4 mr-2" />
                    Oldest First
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(parseInt(value));
                setPage(1); // Reset to first page when changing limit
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 per page</SelectItem>
                <SelectItem value="24">24 per page</SelectItem>
                <SelectItem value="36">36 per page</SelectItem>
                <SelectItem value="48">48 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {isAnyFilterActive && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>

            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setPage(1);
                  }}
                />
              </Badge>
            )}

            {activeCategoryName && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {activeCategoryName}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCategoryId(null);
                    setPage(1);
                  }}
                />
              </Badge>
            )}

            {activeBrand && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Brand: {activeBrand.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setBrandId(null);
                    setPage(1);
                  }}
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(Number(limit))
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-muted/30 h-96 rounded-lg animate-pulse"
                />
              ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-4">
            <p className="text-destructive">Error loading products.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-4 border border-border rounded-lg bg-muted/20">
            <p className="text-xl font-medium">No products found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters or search term to find what you're
              looking for.
            </p>
            <Button onClick={resetFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {productsData && (
          <ShopPagination
            currentPage={Number(page)}
            totalPages={productsData.meta.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

// Helper function to find category name by ID
function findCategoryName(categories: any[], id: string): string | null {
  for (const category of categories) {
    if (category.id === id) {
      return category.name;
    }

    if (category.children && category.children.length > 0) {
      const nameInChildren = findCategoryName(category.children, id);
      if (nameInChildren) return nameInChildren;
    }
  }

  return null;
}

// Helper function to count active filters
function countActiveFilters(
  searchQuery: string | null | undefined,
  categoryId: string | null | undefined,
  brandId: string | null | undefined
): number {
  let count = 0;
  if (searchQuery) count++;
  if (categoryId) count++;
  if (brandId) count++;
  return count;
}
