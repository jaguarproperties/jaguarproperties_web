import { SITE_MEDIA_BASE_PATH, SITE_MEDIA_LEGACY_BASE_PATH, SITE_MEDIA_PUBLIC_BASE_PATH } from "@/lib/site-media";

export function shouldBypassImageOptimization(src: string | null | undefined) {
  if (!src) return false;

  const normalizedSrc = src.trim();

  return (
    normalizedSrc.startsWith("blob:") ||
    normalizedSrc.startsWith("data:") ||
    normalizedSrc.startsWith("/uploads/") ||
    normalizedSrc.startsWith("/media/")
  );
}

export function resolveImageSrc(src: string | null | undefined) {
  if (!src) return "";

  const normalizedSrc = src.trim();

  if (normalizedSrc.startsWith("/uploads/")) {
    return normalizedSrc;
  }

  if (normalizedSrc.startsWith("uploads/")) {
    return `/${normalizedSrc}`;
  }

  if (normalizedSrc.startsWith(`${SITE_MEDIA_LEGACY_BASE_PATH}/`)) {
    return `${SITE_MEDIA_BASE_PATH}/${normalizedSrc.slice(`${SITE_MEDIA_LEGACY_BASE_PATH}/`.length)}`;
  }

  if (!normalizedSrc.startsWith("/") && !normalizedSrc.includes("://") && /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(normalizedSrc)) {
    return `${SITE_MEDIA_PUBLIC_BASE_PATH}/${normalizedSrc}`;
  }

  return normalizedSrc;
}
