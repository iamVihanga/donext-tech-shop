import { Product } from "@/features/products/schemas/products.zod";

export function getProductThumbnail(product: Product): string | undefined {
  if (product.images && product.images.length > 0) {
    let thumbnail = product.images.find((image) => image.isThumbnail);
    if (!thumbnail) {
      thumbnail = product.images[0]; // Fallback to the first image if no thumbnail is found
    }

    return thumbnail?.imageUrl;
  } else return undefined;
}

type GetProductPriceReturnT =
  | {
      price: { min: number; max: number };
      hasVariants: true;
    }
  | {
      price: number;
      hasVariants: false;
    };

export function getProductPrice(product: Product): GetProductPriceReturnT {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((variant) =>
      variant.price ? parseInt(variant.price) : 0
    );
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      price: { min: minPrice, max: maxPrice },
      hasVariants: true
    };
  } else
    return {
      price: parseInt(product.price || "0"),
      hasVariants: false
    };
}

type StockStatus = "in-stock" | "out-of-stock" | "low";

export function getStockStatus(product: Product): StockStatus {
  // If has variants,
  if (product.variants && product.variants.length > 0) {
    const hasInStockVariant = product.variants.some(
      (variant) => variant.stockQuantity && variant.stockQuantity > 0
    );

    if (hasInStockVariant) {
      return "in-stock";
    } else {
      return "out-of-stock";
    }
  }

  // If no variants, check stock quantity
  const minStockLevel = product?.minStockLevel || 3;

  if (product.stockQuantity && product.stockQuantity > 0) {
    if (product.stockQuantity < minStockLevel) {
      return "low";
    }

    return "in-stock";
  }

  return "out-of-stock";
}
