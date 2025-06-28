"use client";

import { useCreateProductStore } from "@/features/products/store/create-product-store";
import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import Image from "next/image";
import { useState } from "react";

export function MediaForm() {
  const [showGallery, setShowGallery] = useState(false);
  const { media, setMedia } = useCreateProductStore();

  return (
    <div>
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={(selectedFiles) => {
            setMedia({
              ...media,
              images: selectedFiles.map((file, index) => ({
                url: file.url,
                orderIndex: index,
                isThumbnail: false
              }))
            });

            setShowGallery(false);
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}

      <Button onClick={() => setShowGallery(true)}>Open Gallery</Button>

      <div className="grid grid-cols-4 gap-3">
        {media.images.length > 0 &&
          media.images.map((image, index) => (
            <Image
              src={image.url}
              alt={`Image ${index}`}
              width={300}
              height={300}
              className="size-72 object-cover"
            />
          ))}
      </div>
    </div>
  );
}
