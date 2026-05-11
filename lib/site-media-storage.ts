import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { formatDatabaseConnectionError } from "@/lib/database-url";
import { getMongoDb } from "@/lib/mongo";
import { SITE_MEDIA_BASE_PATH } from "@/lib/site-media";

const SITE_MEDIA_ENTITY_TYPE = "SITE_MEDIA";

type StoredSiteMediaDocument = {
  _id: string;
  id?: string;
  entityType?: typeof SITE_MEDIA_ENTITY_TYPE;
  filename: string;
  contentType: string;
  size: number;
  data: Buffer | Uint8Array | { buffer?: Buffer | Uint8Array };
  createdAt: Date;
  updatedAt: Date;
};

function getSiteMediaCollection() {
  return getMongoDb().then((db) => db.collection<StoredSiteMediaDocument>("UploadedMedia"));
}

function toBuffer(value: StoredSiteMediaDocument["data"]) {
  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }

  if (value && "buffer" in value && value.buffer) {
    return Buffer.isBuffer(value.buffer) ? value.buffer : Buffer.from(value.buffer);
  }

  return null;
}

function sanitizeFilenameSegment(value: string) {
  const trimmed = value.trim().toLowerCase();
  const sanitized = trimmed.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || "site-media";
}

function getPublicSiteMediaDir() {
  return path.join(process.cwd(), "public", "uploads", "site-media");
}

export function buildStoredSiteMediaUrl(filename: string) {
  return `${SITE_MEDIA_BASE_PATH}/${filename}`;
}

export function getStoredSiteMediaFilenameFromUrl(url: string | null | undefined) {
  if (!url) return null;
  const normalized = url.trim();

  if (!normalized) {
    return null;
  }

  const pathOnly =
    normalized.startsWith("http://") || normalized.startsWith("https://")
      ? new URL(normalized).pathname
      : normalized;

  const sanitizedPath = pathOnly.replace(/[?#].*$/, "").replace(/\/+$/, "");

  return sanitizedPath.startsWith(`${SITE_MEDIA_BASE_PATH}/`)
    ? sanitizedPath.slice(`${SITE_MEDIA_BASE_PATH}/`.length)
    : null;
}

export async function saveSiteMediaToMongo(file: File, baseName: string) {
  const id = randomUUID();
  const extension = (file.name.match(/\.[a-z0-9]+$/i)?.[0] || ".jpg").toLowerCase();
  const filename = `${sanitizeFilenameSegment(baseName)}-${id}${extension}`;
  const data = Buffer.from(await file.arrayBuffer());
  const now = new Date();

  await mkdir(getPublicSiteMediaDir(), { recursive: true });
  await writeFile(path.join(getPublicSiteMediaDir(), filename), data);

  try {
    const collection = await getSiteMediaCollection();

    await collection.insertOne({
      _id: id,
      id,
      entityType: SITE_MEDIA_ENTITY_TYPE,
      filename,
      contentType: file.type || "application/octet-stream",
      size: data.byteLength,
      data,
      createdAt: now,
      updatedAt: now
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Site media saved to public uploads without Mongo mirror.", formatDatabaseConnectionError(error));
    }
  }

  return buildStoredSiteMediaUrl(filename);
}

export async function getStoredSiteMediaByFilename(filename: string) {
  const collection = await getSiteMediaCollection();
  const document = (await collection.findOne({
    filename,
    entityType: SITE_MEDIA_ENTITY_TYPE
  })) as StoredSiteMediaDocument | null;

  if (!document) {
    return null;
  }

  const data = toBuffer(document.data);

  if (!data) {
    return null;
  }

  return {
    contentType: document.contentType || "application/octet-stream",
    data,
    filename: document.filename
  };
}

export async function deleteStoredSiteMediaByUrl(url: string | null | undefined) {
  const filename = getStoredSiteMediaFilenameFromUrl(url);

  if (!filename) {
    return;
  }

  const collection = await getSiteMediaCollection();
  await collection.deleteOne({
    filename,
    entityType: SITE_MEDIA_ENTITY_TYPE
  });
}

export function formatSiteMediaLookupError(error: unknown) {
  return formatDatabaseConnectionError(error);
}
