"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
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
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
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

        <Separator className="bg-amber-100 dark:bg-amber-800" />

        {itemCount === 0 ? (
          <div className="p-12 text-center">
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
        ) : (
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="p-6 space-y-4">
              {products.map((product, index) => {
                let thumbnail = product.images.filter(
                  (img) => img.isThumbnail
                )[0]?.imageUrl;
                let altText = product.images.filter((img) => img.isThumbnail)[0]
                  ?.altText;

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
                          className="text-base font-medium text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2"
                          onClick={() => onOpenChange(false)}
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                            ${product.price}
                          </span>
                          {product.variants && product.variants.length > 0 && (
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
                            product?.stockQuantity === 0 ||
                            product?.stockQuantity === undefined
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
        )}

        {itemCount > 0 && (
          <>
            <Separator className="bg-amber-100 dark:bg-amber-800" />
            <div className="p-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in your
                  wishlist
                </div>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
