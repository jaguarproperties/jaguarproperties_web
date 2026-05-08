"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resolveImageSrc, shouldBypassImageOptimization } from "@/lib/image";
import { cn } from "@/lib/utils";

type SingleImageUploadFieldProps = {
  existingImage?: string | null;
  existingInputName: string;
  fileInputName: string;
  label: string;
  description: string;
  emptyText: string;
  alt: string;
  uploadEndpoint?: string;
  onUploadStateChange?: (isUploading: boolean) => void;
};

export function SingleImageUploadField({
  existingImage,
  existingInputName,
  fileInputName,
  label,
  description,
  emptyText,
  alt,
  uploadEndpoint,
  onUploadStateChange
}: SingleImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string>(existingImage ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentImage(existingImage ?? "");
  }, [existingImage]);

  useEffect(() => {
    onUploadStateChange?.(isUploading);
  }, [isUploading, onUploadStateChange]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setPreviewName(null);
      setUploadError(null);
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setPreviewName(file.name);
    setUploadError(null);

    if (!uploadEndpoint) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Could not upload the selected image.");
      }

      setCurrentImage(payload.url);
    } catch (error) {
      setCurrentImage(existingImage ?? "");
      setUploadError(error instanceof Error ? error.message : "Could not upload the selected image.");
    } finally {
      setIsUploading(false);
    }
  }

  function clearSelection() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPreviewName(null);
    setCurrentImage(existingImage ?? "");
    setUploadError(null);
  }

  const imageUrl = resolveImageSrc(previewUrl ?? currentImage ?? null);

  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-black/10 p-5">
      <input type="hidden" name={existingInputName} value={currentImage} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild type="button" variant="secondary" size="sm">
            <label htmlFor={inputId} className={cn("cursor-pointer", isUploading && "pointer-events-none opacity-70")}>
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload"}
            </label>
          </Button>
          {previewName ? (
            <Button type="button" variant="ghost" size="sm" onClick={clearSelection} disabled={isUploading}>
              <X className="h-4 w-4" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        name={uploadEndpoint ? undefined : fileInputName}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />

      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-white/10 bg-white/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            unoptimized={shouldBypassImageOptimization(imageUrl)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500">
            <div className="flex flex-col items-center gap-3 text-center">
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm">{emptyText}</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-400">
        {uploadError
          ? uploadError
          : isUploading
            ? "Uploading image to MongoDB..."
            : previewName
              ? uploadEndpoint
                ? `Uploaded: ${previewName}`
                : `Ready to upload: ${previewName}`
              : currentImage
                ? "Keeping the current image until you choose a replacement."
                : "Choose an image before saving."}
      </p>
    </div>
  );
}
