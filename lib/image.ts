export function shouldBypassImageOptimization(src: string | null | undefined) {
  if (!src) return false;

  return src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("/uploads/");
}
