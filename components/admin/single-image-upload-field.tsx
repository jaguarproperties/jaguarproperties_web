"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resolveImageSrc, shouldBypassImageOptimization } from "@/lib/image";

type SingleImageUploadFieldProps = {
  existingImage?: string | null;
  existingInputName: string;
  fileInputName: string;
  label: string;
  description: string;
  emptyText: string;
  alt: string;
};

export function SingleImageUploadField({
  existingImage,
  existingInputName,
  fileInputName,
  label,
  description,
  emptyText,
  alt
}: SingleImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setPreviewName(null);
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setPreviewName(file.name);
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
  }

  const imageUrl = resolveImageSrc(previewUrl ?? existingImage ?? null);

  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-black/10 p-5">
      <input type="hidden" name={existingInputName} value={existingImage ?? ""} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild type="button" variant="secondary" size="sm">
            <label htmlFor={inputId} className="cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload
            </label>
          </Button>
          {previewName ? (
            <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
              <X className="h-4 w-4" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        name={fileInputName}
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
        {previewName
          ? `Ready to upload: ${previewName}`
          : existingImage
            ? "Keeping the current image until you choose a replacement."
            : "Choose an image before saving."}
      </p>
    </div>
  );
}
