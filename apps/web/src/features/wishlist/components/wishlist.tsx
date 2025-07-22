"use client";

import { formatPrice } from "@/components/price";
import { cn } from "@/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlistStore } from "../store";
import { WishlistDialog } from "./wishlist-dialog";

type Props = {};

export function Wishlist({}: Props) {
  const { products, removeItem, clearWishlist } = useWishlistStore();
  const itemCount = products.length;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "relative",
              "border-amber-200 hover:border-amber-300 dark:border-amber-700 dark:hover:border-amber-600",
              "hover:bg-amber-50 dark:hover:bg-amber-950/20",
              "transition-all duration-200"
            )}
          >
            <Heart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-amber-500 hover:bg-amber-600"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-80 p-0",
            "bg-popover dark:bg-popover",
            "border-amber-200 dark:border-amber-700",
            "shadow-lg dark:shadow-amber-900/20"
          )}
          align="end"
          sideOffset={8}
        >
          <div className="p-4 border-b border-amber-100 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Wishlist ({itemCount})
              </h3>
              {itemCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {itemCount === 0 ? (
            <div className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-1">
                Your wishlist is empty
              </p>
              <p className="text-sm text-muted-foreground/70">
                Save items you love for later
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-80">
              <div className="p-2">
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
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/10 transition-colors duration-200">
                        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg overflow-hidden">
                          {thumbnail ? (
                            <Image
                              width={48}
                              height={48}
                              src={thumbnail!}
                              alt={altText!}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${product.id}`}
                            className="text-sm font-medium text-foreground truncate"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mt-1">
                            {/* LKR {product.price} */}
                            {formatPrice(parseFloat(product.price), "LKR")}
                          </p>
                          {product.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(product.id)}
                          className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {index < products.length - 1 && (
                        <Separator className="mx-3 bg-amber-100 dark:bg-amber-800" />
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
              <div className="p-4">
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => setDialogOpen(true)}
                >
                  View All Wishlist Items
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      <WishlistDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
