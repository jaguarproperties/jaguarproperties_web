import { readFile } from "fs/promises";
import path from "path";

import { formatSiteMediaLookupError, getStoredSiteMediaByFilename } from "@/lib/site-media-storage";
import { formatTestimonialImageLookupError, getStoredTestimonialImageById } from "@/lib/testimonial-images";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function resolveCandidateMediaPaths(segments: string[]) {
  const storageRoot = path.join(process.cwd(), "storage");
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  const storagePath = path.resolve(storageRoot, ...segments);
  const uploadsPath = path.resolve(uploadsRoot, ...segments);

  const candidates: string[] = [];

  if (storagePath.startsWith(storageRoot)) {
    candidates.push(storagePath);
  }

  if (uploadsPath.startsWith(uploadsRoot)) {
    candidates.push(uploadsPath);
  }

  return candidates;
}

export async function GET(
  _request: Request,
  { params }: { params: { segments: string[] } }
) {
  const segments = params.segments ?? [];

  if (segments[0] === "testimonials" && segments[1]) {
    try {
      const image = await getStoredTestimonialImageById(segments[1]);

      if (!image) {
        return new Response("File not found", { status: 404 });
      }

      return new Response(new Uint8Array(image.data), {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": image.contentType,
          "Content-Disposition": `inline; filename="${image.filename}"`
        }
      });
    } catch (error) {
      return new Response(formatTestimonialImageLookupError(error), { status: 503 });
    }
  }

  if (segments[0] === "site-media" && segments[1]) {
    try {
      const image = await getStoredSiteMediaByFilename(segments[1]);

      if (image) {
        return new Response(new Uint8Array(image.data), {
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable",
            "Content-Type": image.contentType,
            "Content-Disposition": `inline; filename="${image.filename}"`
          }
        });
      }
    } catch (error) {
      return new Response(formatSiteMediaLookupError(error), { status: 503 });
    }
  }

  const filePaths = resolveCandidateMediaPaths(segments);

  if (!filePaths.length) {
    return new Response("Invalid path", { status: 400 });
  }

  for (const filePath of filePaths) {
    try {
      const file = await readFile(filePath);
      const extension = path.extname(filePath).toLowerCase();
      const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

      return new Response(file, {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": contentType
        }
      });
    } catch {
      // Try the next candidate location.
    }
  }

  return new Response("File not found", { status: 404 });
}
