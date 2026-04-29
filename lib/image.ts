export function shouldBypassImageOptimization(src: string | null | undefined) {
  if (!src) return false;

  return src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("/uploads/") || src.startsWith("/media/");
}

export function resolveImageSrc(src: string | null | undefined) {
  if (!src) return "";

  if (src.startsWith("/uploads/")) {
    return `/media/${src.slice("/uploads/".length)}`;
  }

  if (src.startsWith("uploads/")) {
    return `/media/${src.slice("uploads/".length)}`;
  }

  if (!src.startsWith("/") && !src.includes("://") && /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(src)) {
    return `/media/properties/${src}`;
  }

  return src;
}
