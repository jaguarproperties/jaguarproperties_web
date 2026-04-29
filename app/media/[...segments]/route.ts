import { readFile } from "fs/promises";
import path from "path";

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

function resolveMediaPath(segments: string[]) {
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  const resolvedPath = path.resolve(uploadsRoot, ...segments);

  if (!resolvedPath.startsWith(uploadsRoot)) {
    return null;
  }

  return resolvedPath;
}

export async function GET(
  _request: Request,
  { params }: { params: { segments: string[] } }
) {
  const filePath = resolveMediaPath(params.segments ?? []);

  if (!filePath) {
    return new Response("Invalid path", { status: 400 });
  }

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
    return new Response("File not found", { status: 404 });
  }
}
