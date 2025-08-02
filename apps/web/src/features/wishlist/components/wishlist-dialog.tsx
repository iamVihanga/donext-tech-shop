"use client";

import { generateWishlistPDF } from "@/lib/utils/pdf-generator";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import { FileText, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "../store";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WishlistDialog({ open, onOpenChange }: Props) {
  const { products, removeItem, clearWishlist } = useWishlistStore();
  const itemCount = products.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                My Wishlist
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"} saved for later
              </DialogDescription>
            </div>
            {itemCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearWishlist}
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 border-amber-200 hover:border-amber-300 dark:border-amber-700 dark:hover:border-amber-600"
              >
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        {itemCount === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Discover amazing products and save your favorites for later
                shopping.
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  {products.map((product, index) => {
                    let thumbnail = product.images.filter(
                      (img) => img.isThumbnail
                    )[0]?.imageUrl;
                    let altText = product.images.filter(
                      (img) => img.isThumbnail
                    )[0]?.altText;

                    if (!thumbnail && product.images.length > 0) {
                      thumbnail = product?.images[0]?.imageUrl!;
                      altText = product?.images[0]?.altText || product.name;
                    }

                    return (
                      <div key={product.id}>
                        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/10 transition-colors duration-200">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden">
                            {thumbnail ? (
                              <Image
                                width={80}
                                height={80}
                                src={thumbnail!}
                                alt={altText!}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <Link
                              href={`/products/${product.id}`}
                              className="text-base font-medium text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 block"
                              onClick={() => onOpenChange(false)}
                            >
                              {product.name}
                            </Link>

                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                                LKR {product.price}
                              </span>
                              {product.variants &&
                                product.variants.length > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    From
                                  </span>
                                )}
                            </div>

                            {product.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 text-xs">
                              {product?.stockQuantity &&
                              product?.stockQuantity > 0 ? (
                                <span className="text-green-600 dark:text-green-400">
                                  ✓ In Stock ({product.stockQuantity} available)
                                </span>
                              ) : (
                                <span className="text-red-500 dark:text-red-400">
                                  ✗ Out of Stock
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600 text-white min-w-[120px]"
                              disabled={
                                !product?.stockQuantity ||
                                product.stockQuantity <= 0
                              }
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(product.id)}
                              className="text-muted-foreground hover:text-destructive hover:border-destructive min-w-[120px]"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>

                        {index < products.length - 1 && (
                          <Separator className="my-2 bg-amber-100 dark:bg-amber-800" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t bg-background">
              <div className="p-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your
                    wishlist
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        generateWishlistPDF(
                          products.map((p) => ({
                            ...p,
                            description: p.description || undefined,
                            stockQuantity: p.stockQuantity || undefined,
                            images: p.images.map((img) => ({
                              imageUrl: img.imageUrl,
                              altText: img.altText || undefined,
                              isThumbnail: img.isThumbnail || false,
                            })),
                          }))
                        )
                      }
                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 border-amber-200 hover:border-amber-300 dark:border-amber-700 dark:hover:border-amber-600"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Get Quotation
                    </Button>
                    <Button
                      onClick={() => onOpenChange(false)}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
