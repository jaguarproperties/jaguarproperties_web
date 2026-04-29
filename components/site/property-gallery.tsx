"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resolveImageSrc, shouldBypassImageOptimization } from "@/lib/image";

function dedupeImages(images: string[]) {
  return Array.from(new Set(images.map((image) => image.trim()).filter(Boolean)));
}

export function PropertyGallery({
  images,
  title
}: {
  images: string[];
  title: string;
}) {
  const gallery = useMemo(() => dedupeImages(images), [images]);
  const resolvedGallery = useMemo(() => gallery.map((image) => resolveImageSrc(image)), [gallery]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!resolvedGallery.length) return null;

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? resolvedGallery.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current === resolvedGallery.length - 1 ? 0 : current + 1));
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) goToNext();
      else goToPrevious();
    }

    setTouchStartX(null);
  }

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/5"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={resolvedGallery[activeIndex]}
          alt={`${title} image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
          unoptimized={shouldBypassImageOptimization(resolvedGallery[activeIndex])}
        />

        {resolvedGallery.length > 1 ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full p-0"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full p-0"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/55 px-3 py-2">
              {resolvedGallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === activeIndex ? "bg-white" : "bg-white/40"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {resolvedGallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {resolvedGallery.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-[16px] border transition ${
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-black/10 dark:border-white/10"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                sizes="160px"
                className="object-cover"
                unoptimized={shouldBypassImageOptimization(image)}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
