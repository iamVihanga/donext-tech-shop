"use client";

import { ProductImage } from "@/features/products/schemas/products.zod";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: ProductImage[];
  productName: string;
  thumbnailImage: string | undefined;
}

export function ProductImageGallery({
  images,
  productName,
  thumbnailImage
}: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use thumbnailImage as fallback if no images exist
  const displayImages = images?.length > 0 ? images : [];
  const currentImage =
    displayImages[selectedImageIndex]?.imageUrl || thumbnailImage;

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-800 border border-neutral-700">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={displayImages[selectedImageIndex]?.altText || productName}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg">No Image Available</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                selectedImageIndex === index
                  ? "border-amber-500 ring-2 ring-amber-500/30"
                  : "border-neutral-600 hover:border-amber-500"
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || `${productName} - Image ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
