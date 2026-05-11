import { readFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { createOrUpdateSiteContent } from "@/lib/site-content-persistence";

const prisma = new PrismaClient();

type RawSiteContent = Record<string, unknown> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

type RawTestimonial = {
  id: string;
  name: string;
  message: string;
  image: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(process.cwd(), relativePath);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function syncSiteContent() {
  const rawSiteContent = await readJsonFile<RawSiteContent>("data/site-content.json");
  const {
    id = "default-site-content",
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...data
  } = rawSiteContent;

  await createOrUpdateSiteContent(id, data as any);

  console.log(`Synced site content: ${id}`);
}

async function syncTestimonials() {
  const testimonials = await readJsonFile<RawTestimonial[]>("data/testimonials.json");

  for (const testimonial of testimonials) {
    const {
      id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...data
    } = testimonial;

    await prisma.testimonial.upsert({
      where: { id },
      update: data,
      create: {
        id,
        ...data
      }
    });
  }

  console.log(`Synced testimonials: ${testimonials.length}`);
}

async function main() {
  await syncSiteContent();
  await syncTestimonials();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
