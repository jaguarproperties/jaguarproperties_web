import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function currencyLabel(value: string) {
  return value || "Price on request";
}

export function safeSplitGallery(gallery: string | string[]) {
  if (Array.isArray(gallery)) return gallery.filter(Boolean);
  return gallery
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
