import { getStockStatus } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Product } from "../schemas/products.zod";

type Props = {
  product: Product;
  className?: string;
};

export function StockStatus({ product, className }: Props) {
  const textClassName = cn(
    "text-sm flex items-center justify-center gap-2",
    {
      "text-green-500": getStockStatus(product) === "in-stock",
      "text-red-500": getStockStatus(product) === "out-of-stock",
      "text-yellow-500": getStockStatus(product) === "low"
    },
    className
  );

  return (
    <div className={textClassName}>
      <div
        className={cn(`${textClassName} w-2 h-2 rounded-full`, {
          "bg-green-500": getStockStatus(product) === "in-stock",
          "bg-red-500": getStockStatus(product) === "out-of-stock",
          "bg-yellow-500": getStockStatus(product) === "low"
        })}
      />

      {getStockStatus(product) === "in-stock" && <span>In Stock</span>}
      {getStockStatus(product) === "out-of-stock" && <span>Out of Stock</span>}
      {getStockStatus(product) === "low" && <span>Low Stock</span>}
    </div>
  );
}
