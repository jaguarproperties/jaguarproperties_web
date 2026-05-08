import { randomUUID } from "crypto";

import { getMongoDb } from "@/lib/mongo";

const TESTIMONIAL_MEDIA_PREFIX = "/media/testimonials/";

type StoredTestimonialImageDocument = {
  _id: string;
  entityType: "TESTIMONIAL";
  filename: string;
  contentType: string;
  size: number;
  data: Buffer | Uint8Array | { buffer?: Buffer | Uint8Array };
  createdAt: Date;
  updatedAt: Date;
};

function getTestimonialImageCollection() {
  return getMongoDb().then((db) => db.collection<StoredTestimonialImageDocument>("UploadedMedia"));
}

function toBuffer(value: StoredTestimonialImageDocument["data"]) {
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

export function getStoredTestimonialImageUrl(id: string) {
  return `${TESTIMONIAL_MEDIA_PREFIX}${id}`;
}

export function getStoredTestimonialImageIdFromUrl(url: string | null | undefined) {
  if (!url) return null;
  const normalized = url.trim();
  return normalized.startsWith(TESTIMONIAL_MEDIA_PREFIX)
    ? normalized.slice(TESTIMONIAL_MEDIA_PREFIX.length)
    : null;
}

export async function saveTestimonialImageToMongo(file: File) {
  const id = randomUUID();
  const data = Buffer.from(await file.arrayBuffer());
  const collection = await getTestimonialImageCollection();
  const now = new Date();

  await collection.insertOne({
    _id: id,
    entityType: "TESTIMONIAL",
    filename: file.name || `testimonial-${id}`,
    contentType: file.type || "application/octet-stream",
    size: data.byteLength,
    data,
    createdAt: now,
    updatedAt: now
  });

  return getStoredTestimonialImageUrl(id);
}

export async function getStoredTestimonialImageById(id: string) {
  const collection = await getTestimonialImageCollection();
  const document = (await collection.findOne({
    _id: id,
    entityType: "TESTIMONIAL"
  })) as StoredTestimonialImageDocument | null;

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

export async function deleteStoredTestimonialImageByUrl(url: string | null | undefined) {
  const id = getStoredTestimonialImageIdFromUrl(url);

  if (!id) {
    return;
  }

  const collection = await getTestimonialImageCollection();
  await collection.deleteOne({
    _id: id,
    entityType: "TESTIMONIAL"
  });
}
