"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type BlogImageFieldsProps = {
  coverImage?: string | null;
  gallery?: string[] | null;
  title?: string | null;
};

type PreviewImage = {
  id: string;
  name: string;
  url: string;
};

function dedupeImages(images: string[]) {
  return Array.from(new Set(images.map((image) => image.trim()).filter(Boolean)));
}

export function BlogImageFields({
  coverImage,
  gallery,
  title
}: BlogImageFieldsProps) {
  const coverInputId = useId();
  const galleryInputId = useId();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const existingGallery = useMemo(
    () => dedupeImages((gallery ?? []).filter((image) => image !== coverImage)),
    [coverImage, gallery]
  );

  const [retainedGallery, setRetainedGallery] = useState(existingGallery);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverPreviewName, setCoverPreviewName] = useState<string | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<PreviewImage[]>([]);

  useEffect(() => {
    setRetainedGallery(existingGallery);
  }, [existingGallery]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  useEffect(() => {
    const nextPreviews = newGalleryFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    setNewGalleryPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newGalleryFiles]);

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      if (coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      setCoverPreviewUrl(null);
      setCoverPreviewName(null);
      return;
    }

    if (coverPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(objectUrl);
    setCoverPreviewName(file.name);
  }

  function handleGalleryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setNewGalleryFiles(files);
  }

  function clearCoverSelection() {
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
    if (coverPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverPreviewUrl(null);
    setCoverPreviewName(null);
  }

  function removeNewGalleryFile(targetFile: File) {
    const nextFiles = newGalleryFiles.filter(
      (file) => !(file.name === targetFile.name && file.lastModified === targetFile.lastModified)
    );
    setNewGalleryFiles(nextFiles);

    if (galleryInputRef.current) {
      const dataTransfer = new DataTransfer();
      nextFiles.forEach((file) => dataTransfer.items.add(file));
      galleryInputRef.current.files = dataTransfer.files;
    }
  }

  const mainImageUrl = coverPreviewUrl ?? coverImage ?? null;

  return (
    <div className="space-y-6 rounded-[28px] border border-white/10 bg-black/10 p-5">
      <input type="hidden" name="existingCoverImage" value={coverImage ?? ""} />
      <input type="hidden" name="existingGallery" value={retainedGallery.join(", ")} />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-white">Article images</p>
        <p className="text-xs leading-6 text-zinc-400">
          Upload one featured image and any optional gallery images for the article page.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Main image</p>
              <p className="text-xs text-zinc-400">Used as the lead image on listings and the article page.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild type="button" variant="secondary" size="sm">
                <label htmlFor={coverInputId} className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload
                </label>
              </Button>
              {coverPreviewName ? (
                <Button type="button" variant="ghost" size="sm" onClick={clearCoverSelection}>
                  <X className="h-4 w-4" />
                  Reset
                </Button>
              ) : null}
            </div>
          </div>

          <input
            ref={coverInputRef}
            id={coverInputId}
            name="mainImageFile"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="hidden"
            onChange={handleCoverChange}
            required={!coverImage}
          />

          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={title ? `${title} main image` : "Article main image"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                <div className="flex flex-col items-center gap-3 text-center">
                  <ImagePlus className="h-10 w-10" />
                  <span className="text-sm">No main image selected</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-400">
            {coverPreviewName
              ? `Ready to upload: ${coverPreviewName}`
              : coverImage
                ? "Keeping the current featured image until you choose a replacement."
                : "Choose a featured image before saving this article."}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Additional gallery</p>
              <p className="text-xs text-zinc-400">These images appear in the article gallery after the featured image.</p>
            </div>
            <Button asChild type="button" variant="secondary" size="sm">
              <label htmlFor={galleryInputId} className="cursor-pointer">
                <Upload className="h-4 w-4" />
                Add images
              </label>
            </Button>
          </div>

          <input
            ref={galleryInputRef}
            id={galleryInputId}
            name="galleryFiles"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleGalleryChange}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {retainedGallery.map((image) => (
              <div key={image} className="overflow-hidden rounded-[20px] border border-white/10 bg-white/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image}
                    alt={title ? `${title} gallery image` : "Article gallery image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                  <p className="truncate text-xs text-zinc-300">{image}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRetainedGallery((current) => current.filter((item) => item !== image))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {newGalleryPreviews.map((preview, index) => (
              <div key={preview.id} className="overflow-hidden rounded-[20px] border border-dashed border-primary/40 bg-primary/5">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={preview.url}
                    alt={preview.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                  <p className="truncate text-xs text-zinc-300">{preview.name}</p>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeNewGalleryFile(newGalleryFiles[index])}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {!retainedGallery.length && !newGalleryPreviews.length ? (
              <div className="flex min-h-40 items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-white/[0.03] px-4 text-center text-sm text-zinc-500 sm:col-span-2">
                No additional images selected yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
