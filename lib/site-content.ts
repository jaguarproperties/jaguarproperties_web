import { demoSiteContent } from "@/lib/demo-data";

type SiteContentShape = typeof demoSiteContent & Record<string, unknown>;

export function resolveSiteContent(content?: Record<string, unknown> | null) {
  const normalizedContent = Object.fromEntries(
    Object.entries(content ?? {}).filter(([, value]) => value !== null && value !== undefined)
  );

  return {
    ...demoSiteContent,
    ...normalizedContent
  } as SiteContentShape;
}

function parseLines(value: string | null | undefined) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Admin textarea fields use pipe-separated rows so non-technical editors can manage lists without JSON.
export function parsePipeRows(value: string | null | undefined, size: number) {
  return parseLines(value)
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length >= size);
}

export function parseStatItems(value: string | null | undefined) {
  return parsePipeRows(value, 2).map(([valueText, label]) => ({
    value: valueText,
    label
  }));
}

export function parseHighlightItems(value: string | null | undefined) {
  return parsePipeRows(value, 2).map(([title, text]) => ({
    title,
    text
  }));
}

export function parsePortfolioItems(value: string | null | undefined) {
  return parsePipeRows(value, 3).map(([label, valueText, text]) => ({
    label,
    value: valueText,
    text
  }));
}

export function parseGalleryItems(value: string | null | undefined) {
  return parsePipeRows(value, 3).map(([image, title, text]) => ({
    image,
    title,
    text
  }));
}

export function parseLocationItems(value: string | null | undefined) {
  return parseLines(value);
}
