import { randomUUID } from "crypto";

import {
  createLocalTestimonial,
  deleteLocalTestimonial,
  listLocalPublishedTestimonials,
  listLocalTestimonials,
  updateLocalTestimonial
} from "@/lib/local-testimonials";
import { getMongoDb } from "@/lib/mongo";

type TestimonialRecord = {
  id: string;
  name: string;
  message: string;
  image: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type TestimonialInput = {
  name: string;
  message: string;
  image: string;
  published: boolean;
};

function normalizeTestimonialDocument(document: Record<string, any>): TestimonialRecord {
  return {
    id: String(document.id ?? document._id),
    name: String(document.name ?? ""),
    message: String(document.message ?? ""),
    image: String(document.image ?? ""),
    published: Boolean(document.published),
    createdAt: document.createdAt instanceof Date ? document.createdAt : new Date(document.createdAt ?? Date.now()),
    updatedAt: document.updatedAt instanceof Date ? document.updatedAt : new Date(document.updatedAt ?? Date.now())
  };
}

async function getTestimonialCollection() {
  return (await getMongoDb()).collection("Testimonial") as any;
}

function shouldUseLocalFallback(error: unknown) {
  if (!(error instanceof Error)) return false;

  const normalizedMessage = error.message.toLowerCase();

  return (
    normalizedMessage.includes("querysrv") ||
    normalizedMessage.includes("econnrefused") ||
    normalizedMessage.includes("dns resolution") ||
    normalizedMessage.includes("no route to host") ||
    normalizedMessage.includes("error creating a database connection") ||
    normalizedMessage.includes("an error occurred during dns resolution") ||
    normalizedMessage.includes("server selection timed out") ||
    normalizedMessage.includes("replicasetnoprimary") ||
    normalizedMessage.includes("prisma client initialization error") ||
    normalizedMessage.includes("prisma.testimonial.") ||
    normalizedMessage.includes("can't reach database server") ||
    normalizedMessage.includes("database is currently unreachable")
  );
}

async function withLocalFallback<T>(operation: () => Promise<T>, fallback: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("MongoDB unavailable for testimonials, using local JSON fallback.", error);
    }

    return fallback();
  }
}

export async function listPublishedTestimonials() {
  const documents = await withLocalFallback(
    async () =>
      (await (await getTestimonialCollection())
        .find({ published: true })
        .sort({ updatedAt: -1, createdAt: -1 })
        .toArray()) as Record<string, any>[],
    () => listLocalPublishedTestimonials() as Promise<any>
  );

  return Array.isArray(documents) && documents[0]?.createdAt instanceof Date
    ? (documents as TestimonialRecord[])
    : (documents as Record<string, any>[]).map((document: Record<string, any>) => normalizeTestimonialDocument(document));
}

export async function listAllTestimonials() {
  const documents = await withLocalFallback(
    async () =>
      (await (await getTestimonialCollection())
        .find({})
        .sort({ updatedAt: -1, createdAt: -1 })
        .toArray()) as Record<string, any>[],
    () => listLocalTestimonials() as Promise<any>
  );

  return Array.isArray(documents) && documents[0]?.createdAt instanceof Date
    ? (documents as TestimonialRecord[])
    : (documents as Record<string, any>[]).map((document: Record<string, any>) => normalizeTestimonialDocument(document));
}

export async function createTestimonial(data: TestimonialInput) {
  const now = new Date();
  const id = randomUUID();

  await withLocalFallback(
    async () => {
      await (await getTestimonialCollection()).insertOne({
        _id: id,
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      });
    },
    () =>
      createLocalTestimonial({
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      }).then(() => undefined)
  );

  return {
    id,
    ...data,
    createdAt: now,
    updatedAt: now
  };
}

export async function updateTestimonial(id: string, data: TestimonialInput) {
  const updatedAt = new Date();

  return withLocalFallback(
    async () => {
      const collection = await getTestimonialCollection();
      const existingDocument = await collection.findOne({
        $or: [{ _id: id }, { id }]
      });

      if (!existingDocument) {
        throw new Error("Testimonial not found.");
      }

      await collection.updateOne(
        { $or: [{ _id: id }, { id }] },
        {
          $set: {
            ...data,
            updatedAt
          }
        }
      );

      return {
        id,
        ...data,
        createdAt:
          existingDocument.createdAt instanceof Date
            ? existingDocument.createdAt
            : new Date(existingDocument.createdAt ?? updatedAt),
        updatedAt
      };
    },
    () => updateLocalTestimonial(id, data)
  );
}

export async function deleteTestimonialById(id: string) {
  await withLocalFallback(
    async () =>
      (await getTestimonialCollection()).deleteOne({
        $or: [{ _id: id }, { id }]
      }),
    () => deleteLocalTestimonial(id)
  );
}
