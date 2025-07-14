"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";
import { Eye, MoreHorizontal, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Product } from "@/features/products/schemas/products.zod";
import { StockAdjustmentDialog } from "./stock-adjustment-dialog";
import { VariantStockDialog } from "./variant-stock-dialog";

interface InventoryCellActionProps {
  data: Product;
}

export const InventoryCellAction: React.FC<InventoryCellActionProps> = ({
  data
}) => {
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [showVariantDialog, setShowVariantDialog] = useState(false);

  const hasVariants = data.variants && data.variants.length > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/products/${data.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Product
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowStockDialog(true)}>
            <Package className="mr-2 h-4 w-4" />
            Adjust Main Stock
          </DropdownMenuItem>

          {hasVariants && (
            <DropdownMenuItem onClick={() => setShowVariantDialog(true)}>
              <Package className="mr-2 h-4 w-4" />
              Manage Variant Stock
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <StockAdjustmentDialog
        product={data}
        open={showStockDialog}
        onClose={() => setShowStockDialog(false)}
      />

      {hasVariants && (
        <VariantStockDialog
          product={data}
          open={showVariantDialog}
          onClose={() => setShowVariantDialog(false)}
        />
      )}
    </>
  );
};
