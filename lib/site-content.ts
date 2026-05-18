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

export type InlineTextSegment = {
  text: string;
  bold: boolean;
};

export function parseInlineTextSegments(value: string | null | undefined) {
  const input = String(value ?? "");
  const segments: InlineTextSegment[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, match.index), bold: false });
    }

    segments.push({ text: match[1] ?? "", bold: true });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex), bold: false });
  }

  return segments.filter((segment) => segment.text.length > 0);
}

export function parseOfficeBranches(value: string | null | undefined) {
  return String(value ?? "")
    .split(/\n\s*\n/)
    .map((branch) => branch.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((branch) => branch.length > 0);
}
