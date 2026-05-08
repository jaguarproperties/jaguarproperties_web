import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { demoTestimonials } from "@/lib/demo-data";

export type LocalTestimonialRecord = {
  id: string;
  name: string;
  message: string;
  image: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type SerializedLocalTestimonialRecord = Omit<LocalTestimonialRecord, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

const storageDir = path.join(process.cwd(), "data");
const storageFile = path.join(storageDir, "testimonials.json");

function normalizeLocalTestimonialRecord(
  testimonial: SerializedLocalTestimonialRecord | LocalTestimonialRecord
): LocalTestimonialRecord {
  return {
    id: String(testimonial.id),
    name: String(testimonial.name ?? ""),
    message: String(testimonial.message ?? ""),
    image: String(testimonial.image ?? ""),
    published: Boolean(testimonial.published),
    createdAt: testimonial.createdAt instanceof Date ? testimonial.createdAt : new Date(testimonial.createdAt),
    updatedAt: testimonial.updatedAt instanceof Date ? testimonial.updatedAt : new Date(testimonial.updatedAt)
  };
}

async function ensureLocalTestimonialsFile() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(storageFile, "utf8");
  } catch {
    const initialTestimonials = demoTestimonials.map((testimonial) =>
      normalizeLocalTestimonialRecord(testimonial)
    );
    await writeLocalTestimonials(initialTestimonials);
  }
}

async function readLocalTestimonials() {
  await ensureLocalTestimonialsFile();
  const raw = await readFile(storageFile, "utf8");
  const parsed = JSON.parse(raw) as SerializedLocalTestimonialRecord[];
  return parsed.map((testimonial) => normalizeLocalTestimonialRecord(testimonial));
}

async function writeLocalTestimonials(testimonials: LocalTestimonialRecord[]) {
  await mkdir(storageDir, { recursive: true });
  const serialized = testimonials.map((testimonial) => ({
    ...testimonial,
    createdAt: testimonial.createdAt.toISOString(),
    updatedAt: testimonial.updatedAt.toISOString()
  }));
  await writeFile(storageFile, `${JSON.stringify(serialized, null, 2)}\n`, "utf8");
}

export async function listLocalTestimonials() {
  const testimonials = await readLocalTestimonials();
  return testimonials.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function listLocalPublishedTestimonials() {
  const testimonials = await listLocalTestimonials();
  return testimonials.filter((testimonial) => testimonial.published);
}

export async function createLocalTestimonial(testimonial: LocalTestimonialRecord) {
  const testimonials = await readLocalTestimonials();
  testimonials.unshift(testimonial);
  await writeLocalTestimonials(testimonials);
  return testimonial;
}

export async function updateLocalTestimonial(
  id: string,
  data: Pick<LocalTestimonialRecord, "name" | "message" | "image" | "published">
) {
  const testimonials = await readLocalTestimonials();
  const index = testimonials.findIndex((testimonial) => testimonial.id === id);

  if (index === -1) {
    throw new Error("Testimonial not found.");
  }

  const updated = {
    ...testimonials[index],
    ...data,
    updatedAt: new Date()
  };

  testimonials[index] = updated;
  await writeLocalTestimonials(testimonials);
  return updated;
}

export async function deleteLocalTestimonial(id: string) {
  const testimonials = await readLocalTestimonials();
  const nextTestimonials = testimonials.filter((testimonial) => testimonial.id !== id);
  await writeLocalTestimonials(nextTestimonials);
}
