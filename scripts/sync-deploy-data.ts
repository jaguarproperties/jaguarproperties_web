import { readFile } from "fs/promises";
import path from "path";

import { loadEnvConfig } from "@next/env";
import { MediaEntityType, Prisma, PrismaClient, ProjectStatus } from "@prisma/client";
import { createOrUpdateSiteContent } from "@/lib/site-content-persistence";

loadEnvConfig(process.cwd());

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
};

type RawProject = {
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
  status: keyof typeof ProjectStatus;
  completionDate: string | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  coverImage: string;
  gallery: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt?: string;
};

type RawBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
};

async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(process.cwd(), relativePath);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function uniqueUrls(urls: Array<string | null | undefined>) {
  return Array.from(new Set(urls.filter((url): url is string => Boolean(url))));
}

async function syncSiteContent() {
  const rawSiteContent = await readJsonFile<RawSiteContent>("data/site-content.json");
  const {
    id: fileId = "default-site-content",
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...data
  } = rawSiteContent;
  const siteContentData = data as Prisma.SiteContentUncheckedCreateInput;

  const existingSiteContent = await prisma.siteContent.findFirst({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: { id: true }
  });

  const targetId = existingSiteContent?.id ?? fileId;

  await createOrUpdateSiteContent(targetId, siteContentData);

  console.log(`Synced site content -> ${targetId}`);
}

async function syncTestimonials() {
  const testimonials = await readJsonFile<RawTestimonial[]>("data/testimonials.json");

  for (const testimonial of testimonials) {
    const { id, createdAt: _createdAt, ...data } = testimonial;

    await prisma.testimonial.upsert({
      where: { id },
      update: data,
      create: {
        id,
        ...data
      }
    });
  }

  console.log(`Synced testimonials -> ${testimonials.length}`);
}

async function syncProjectMedia(projectId: string, coverImage: string, gallery: string[]) {
  await prisma.media.deleteMany({
    where: { projectId }
  });

  const urls = uniqueUrls([coverImage, ...gallery]);

  if (!urls.length) {
    return;
  }

  for (const [index, url] of urls.entries()) {
    await prisma.media.create({
      data: {
        url,
        alt: index === 0 ? "Featured project image" : "Project gallery image",
        entityType: MediaEntityType.PROJECT,
        projectId
      }
    });
  }
}

async function syncProjects() {
  const projects = await readJsonFile<RawProject[]>("data/projects.json");

  for (const project of projects) {
    const { id, createdAt, status, completionDate, ...data } = project;

    const existingProject = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: project.slug }]
      },
      select: { id: true }
    });

    const payload = {
      ...data,
      status: ProjectStatus[status],
      completionDate: completionDate ? new Date(completionDate) : null
    };

    const savedProject = existingProject
      ? await prisma.project.update({
          where: { id: existingProject.id },
          data: payload
        })
      : await prisma.project.create({
          data: {
            id,
            ...payload,
            createdAt: createdAt ? new Date(createdAt) : new Date()
          }
        });

    await syncProjectMedia(savedProject.id, project.coverImage, project.gallery);
  }

  console.log(`Synced projects -> ${projects.length}`);
}

async function syncBlogMedia(blogPostId: string, coverImage: string) {
  await prisma.media.deleteMany({
    where: { blogPostId }
  });

  const urls = uniqueUrls([coverImage]);

  for (const url of urls) {
    await prisma.media.create({
      data: {
        url,
        alt: "Featured news image",
        entityType: MediaEntityType.BLOG_POST,
        blogPostId
      }
    });
  }
}

async function syncBlogPosts() {
  const posts = await readJsonFile<RawBlogPost[]>("data/blog-posts.json");

  for (const post of posts) {
    const { id, createdAt, publishedAt, ...data } = post;

    const existingPost = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id }, { slug: post.slug }]
      },
      select: { id: true }
    });

    const payload = {
      ...data,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date()
    };

    const savedPost = existingPost
      ? await prisma.blogPost.update({
          where: { id: existingPost.id },
          data: payload
        })
      : await prisma.blogPost.create({
          data: {
            id,
            ...payload,
            createdAt: createdAt ? new Date(createdAt) : new Date()
          }
        });

    await syncBlogMedia(savedPost.id, post.coverImage);
  }

  console.log(`Synced blog posts -> ${posts.length}`);
}

async function main() {
  const databaseUrl = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn("Skipped deployment sync because DATABASE_URL is not configured.");
    return;
  }

  await syncSiteContent();
  await syncTestimonials();
  await syncProjects();
  await syncBlogPosts();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
