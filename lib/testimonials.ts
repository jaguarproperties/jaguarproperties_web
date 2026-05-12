import { randomUUID } from "crypto";

import { deleteStoredTestimonialImageByUrl } from "@/lib/testimonial-images";
import { prisma } from "@/lib/prisma";

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

function normalizeTestimonialDocument(document: {
  id: string;
  name: string;
  message: string;
  image: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}): TestimonialRecord {
  return {
    id: document.id,
    name: document.name,
    message: document.message,
    image: document.image,
    published: document.published,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  };
}

export async function listPublishedTestimonials() {
  const documents = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
  });

  return documents.map((document) => normalizeTestimonialDocument(document));
}

export async function listAllTestimonials() {
  const documents = await prisma.testimonial.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
  });

  return documents.map((document) => normalizeTestimonialDocument(document));
}

export async function createTestimonial(data: TestimonialInput) {
  const now = new Date();
  const id = randomUUID();

  await prisma.testimonial.create({
    data: {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    }
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
  const existingDocument = await prisma.testimonial.findUnique({
    where: { id }
  });

  if (!existingDocument) {
    throw new Error("Testimonial not found.");
  }

  const previousImage = existingDocument.image;

  await prisma.testimonial.update({
    where: { id },
    data: {
      ...data,
      updatedAt
    }
  });

  const result = {
    id,
    ...data,
    createdAt: existingDocument.createdAt,
    updatedAt
  };

  if (previousImage && previousImage !== data.image) {
    await deleteStoredTestimonialImageByUrl(previousImage);
  }

  return result;
}

export async function deleteTestimonialById(id: string) {
  const existingDocument = await prisma.testimonial.findUnique({
    where: { id }
  });

  await prisma.testimonial.delete({
    where: { id }
  });

  await deleteStoredTestimonialImageByUrl(existingDocument?.image ?? "");
}
