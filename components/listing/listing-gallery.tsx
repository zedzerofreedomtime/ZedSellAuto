"use client";

/* eslint-disable @next/next/no-img-element */
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ListingGalleryProps = {
  gallery: string[];
  image: string;
  name: string;
};

export function ListingGallery({ gallery, image, name }: ListingGalleryProps) {
  const galleryImages = gallery.length > 0 ? gallery.slice(0, 5) : [image];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const fallbackImage = image;

  function getImageSource(source: string) {
    return failedImages[source] ? fallbackImage : source;
  }

  function handleImageError(source: string) {
    setFailedImages((currentFailedImages) => ({
      ...currentFailedImages,
      [source]: true
    }));

    if (selectedImage === source) {
      setSelectedImage(fallbackImage);
    }
  }

  return (
    <section className="container pt-6">
      <div className="mb-3 flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" aria-label="บันทึกรถคันนี้">
          <Heart />
        </Button>
        <Button variant="ghost" size="icon" aria-label="แชร์รถคันนี้">
          <Share2 />
        </Button>
      </div>
      <div className="grid gap-2 overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 shadow-line lg:grid-cols-[0.82fr_1.4fr]">
        <div className="grid grid-cols-2 gap-2">
          {galleryImages.map((thumbnail, index) => {
            const isActive = thumbnail === selectedImage;

            return (
              <button
                aria-label={`ดูรูป ${name} รูปที่ ${index + 1}`}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-md bg-zinc-100 ring-offset-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950",
                  isActive ? "ring-2 ring-zinc-950" : "hover:opacity-86"
                )}
                key={`${thumbnail}-${index}`}
                onClick={() => setSelectedImage(thumbnail)}
                type="button"
              >
                <img
                  alt={`${name} รูปที่ ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={() => handleImageError(thumbnail)}
                  src={getImageSource(thumbnail)}
                />
              </button>
            );
          })}
        </div>
        <div className="relative min-h-[340px] overflow-hidden rounded-md bg-zinc-100 lg:min-h-[520px]">
          <img
            alt={name}
            className="h-full w-full object-cover"
            onError={() => handleImageError(selectedImage)}
            src={getImageSource(selectedImage)}
          />
        </div>
      </div>
    </section>
  );
}
