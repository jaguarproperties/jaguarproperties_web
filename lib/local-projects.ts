import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { demoProjects } from "@/lib/demo-data";

export type LocalProjectRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  city: string;
  location: string;
  country: string;
  priceRange: string;
  areaSqFt: number | null;
  areaLabel: string | null;
  tags: string[];
  status: "UPCOMING" | "LAUNCHING" | "COMPLETED";
  completionDate: Date | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  coverImage: string;
  gallery: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  properties: unknown[];
  media?: Array<{ id: string; url: string; alt: string | null; createdAt: Date }>;
};

type SerializedLocalProjectRecord = Omit<LocalProjectRecord, "createdAt" | "updatedAt" | "media"> & {
  createdAt: string;
  updatedAt: string;
  media?: Array<{ id: string; url: string; alt: string | null; createdAt: string }>;
};

const storageDir = path.join(process.cwd(), "data");
const storageFile = path.join(storageDir, "projects.json");

function normalizeLocalProject(project: SerializedLocalProjectRecord | LocalProjectRecord): LocalProjectRecord {
  return {
    ...demoProjects[0],
    ...project,
    id: String(project.id),
    title: String(project.title ?? ""),
    slug: String(project.slug ?? ""),
    summary: String(project.summary ?? ""),
    description: String(project.description ?? ""),
    city: String(project.city ?? ""),
    location: String(project.location ?? ""),
    country: String(project.country ?? ""),
    priceRange: String(project.priceRange ?? ""),
    areaSqFt: typeof project.areaSqFt === "number" ? project.areaSqFt : project.areaSqFt ? Number(project.areaSqFt) : null,
    areaLabel: project.areaLabel ? String(project.areaLabel) : null,
    tags: Array.isArray(project.tags) ? project.tags.map((tag) => String(tag)) : [],
    featured: Boolean(project.featured),
    visible: Boolean(project.visible),
    sortOrder: typeof project.sortOrder === "number" ? project.sortOrder : Number(project.sortOrder ?? 0),
    gallery: Array.isArray(project.gallery) ? project.gallery.map((image) => String(image)) : [],
    properties: Array.isArray(project.properties) ? project.properties : [],
    media: Array.isArray(project.media)
      ? project.media.map((item) => ({
          id: String(item.id),
          url: String(item.url),
          alt: item.alt ? String(item.alt) : null,
          createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt)
        }))
      : [],
    createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt)
  };
}

async function ensureLocalProjectsFile() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(storageFile, "utf8");
  } catch {
    await writeLocalProjects(demoProjects.map((project) => normalizeLocalProject(project)));
  }
}

async function readLocalProjectsFile() {
  await ensureLocalProjectsFile();
  const raw = await readFile(storageFile, "utf8");
  const parsed = JSON.parse(raw) as SerializedLocalProjectRecord[];
  return parsed.map((project) => normalizeLocalProject(project));
}

async function writeLocalProjects(projects: LocalProjectRecord[]) {
  await mkdir(storageDir, { recursive: true });
  const serialized: SerializedLocalProjectRecord[] = projects.map((project) => ({
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    media: (project.media ?? []).map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }))
  }));
  await writeFile(storageFile, `${JSON.stringify(serialized, null, 2)}\n`, "utf8");
}

function sortProjects(projects: LocalProjectRecord[]) {
  return [...projects].sort((left, right) => {
    const orderDifference = (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
    if (orderDifference !== 0) return orderDifference;
    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });
}

export async function listLocalProjects() {
  return sortProjects(await readLocalProjectsFile());
}

export async function getLocalProjectBySlug(slug: string) {
  const projects = await listLocalProjects();
  return projects.find((project) => project.slug === slug && project.visible) ?? null;
}

export async function upsertLocalProject(project: LocalProjectRecord) {
  const projects = await readLocalProjectsFile();
  const index = projects.findIndex((item) => item.id === project.id || item.slug === project.slug);
  const nextProject = normalizeLocalProject(project);

  if (index === -1) {
    projects.unshift(nextProject);
  } else {
    projects[index] = nextProject;
  }

  await writeLocalProjects(projects);
  return nextProject;
}

export async function deleteLocalProject(id: string) {
  const projects = await readLocalProjectsFile();
  const nextProjects = projects.filter((project) => project.id !== id);
  await writeLocalProjects(nextProjects);
}
