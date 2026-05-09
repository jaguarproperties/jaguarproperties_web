import { randomUUID } from "crypto";

import { getMongoDb } from "@/lib/mongo";
import { deleteStoredTestimonialImageByUrl } from "@/lib/testimonial-images";

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

export async function listPublishedTestimonials() {
  const documents = (await (await getTestimonialCollection())
    .find({ published: true })
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray()) as Array<Record<string, any>>;

  return documents.map((document: Record<string, any>) => normalizeTestimonialDocument(document));
}

export async function listAllTestimonials() {
  const documents = (await (await getTestimonialCollection())
    .find({})
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray()) as Array<Record<string, any>>;

  return documents.map((document: Record<string, any>) => normalizeTestimonialDocument(document));
}

export async function createTestimonial(data: TestimonialInput) {
  const now = new Date();
  const id = randomUUID();

  await (await getTestimonialCollection()).insertOne({
    _id: id,
    id,
    ...data,
    createdAt: now,
    updatedAt: now
  });

  return {
    id,
    ...data,
    createdAt: now,
    updatedAt: now
  };
}

export async function updateTestimonial(id: string, data: TestimonialInput) {
  const updatedAt = new Date();

  const collection = await getTestimonialCollection();
  const existingDocument = await collection.findOne({
    $or: [{ _id: id }, { id }]
  });

  if (!existingDocument) {
    throw new Error("Testimonial not found.");
  }

  const previousImage = String(existingDocument.image ?? "");

  await collection.updateOne(
    { $or: [{ _id: id }, { id }] },
    {
      $set: {
        ...data,
        updatedAt
      }
    }
  );

  const result = {
    id,
    ...data,
    createdAt:
      existingDocument.createdAt instanceof Date
        ? existingDocument.createdAt
        : new Date(existingDocument.createdAt ?? updatedAt),
    updatedAt
  };

  if (previousImage && previousImage !== data.image) {
    await deleteStoredTestimonialImageByUrl(previousImage);
  }

  return result;
}

export async function deleteTestimonialById(id: string) {
  const collection = await getTestimonialCollection();
  const existingDocument = await collection.findOne({
    $or: [{ _id: id }, { id }]
  });

  await collection.deleteOne({
    $or: [{ _id: id }, { id }]
  });

  await deleteStoredTestimonialImageByUrl(String(existingDocument?.image ?? ""));
}
