"use client";

import { formatPrice } from "@/components/price";
import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { getProductThumbnail } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@repo/ui/components/popover";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import { FileText, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  className?: string;
}

export function QuotationDropdown({ className }: Props) {
  const { items, updateItemQuantity, removeItem, totals } = useQuotationStore();

  const itemCount = items.length;
  const totalPrice = totals.totalAmount;

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateItemQuantity(itemId, newQuantity);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
        >
          <FileText className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Quotation</h4>
            <Badge variant="secondary">{itemCount} items</Badge>
          </div>

          <Separator />

          {items.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your quotation is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add some products to get started
              </p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {items.map((item) => {
                    const thumbnail = getProductThumbnail(item.product);

                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                          {thumbnail && (
                            <Image
                              src={thumbnail}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-sm font-medium text-foreground hover:text-primary truncate block"
                          >
                            {item.product.name}
                          </Link>

                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm font-semibold text-primary">
                              {formatPrice(item.totalPrice, "LKR")}
                            </p>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-xs min-w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    {formatPrice(totalPrice, "LKR")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/quotations">View Quotation</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/quotations">Request Quote</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
