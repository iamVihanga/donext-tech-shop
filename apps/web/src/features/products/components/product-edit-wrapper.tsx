"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useEffect } from "react";
import { useGetProduct } from "../actions/use-get-product";
import { useCreateProductStore } from "../store/create-product-store";

interface Props {
  productId: string;
  children: React.ReactNode;
}

export function ProductEditWrapper({ productId, children }: Props) {
  const { data: product, isLoading, error } = useGetProduct(productId);
  const { populateFromProduct, setUpdateMode, clearForm } =
    useCreateProductStore();

  useEffect(() => {
    if (product && !isLoading) {
      // Set update mode and populate the store with product data
      setUpdateMode(true, productId);
      populateFromProduct(product);
    }

    // Cleanup function to clear form when component unmounts
    return () => {
      clearForm();
    };
  }, [
    product,
    isLoading,
    productId,
    populateFromProduct,
    setUpdateMode,
    clearForm
  ]);
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <Skeleton className="h-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600">
              Error Loading Product
            </h3>
            <p className="text-muted-foreground mt-2">
              {error.message ||
                "Failed to load product data. Please try again."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Product Not Found</h3>
            <p className="text-muted-foreground mt-2">
              The product you're trying to edit doesn't exist or has been
              deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
