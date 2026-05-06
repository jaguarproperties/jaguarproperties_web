const fs = require("fs/promises");
const path = require("path");
const { loadEnvConfig } = require("@next/env");
const { PrismaClient } = require("@prisma/client");

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const publicRoot = path.join(process.cwd(), "public");
const siteMediaDir = path.join(publicRoot, "uploads", "site-media");
const SITE_MEDIA_BASE_PATH = "/uploads/site-media";

function isMigratableLocalImage(value) {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith(SITE_MEDIA_BASE_PATH) &&
    (value.startsWith("/images/") || value.startsWith("/uploads/"))
  );
}

function toSiteMediaValue(value) {
  return `${SITE_MEDIA_BASE_PATH}/${path.basename(value)}`;
}

async function ensureCopied(value) {
  if (!isMigratableLocalImage(value)) return value;

  const sourcePath = path.join(publicRoot, value.slice(1));
  const targetPath = path.join(siteMediaDir, path.basename(value));

  await fs.mkdir(siteMediaDir, { recursive: true });

  try {
    await fs.access(sourcePath);
    await fs.copyFile(sourcePath, targetPath);
  } catch (error) {
    console.warn(`Skipping copy for missing source: ${value}`);
    return value;
  }

  return toSiteMediaValue(value);
}

async function migrateGallery(gallery) {
  return Promise.all((gallery ?? []).map((item) => ensureCopied(item)));
}

async function migratePortfolioGallery(portfolioGallery) {
  if (!portfolioGallery) return portfolioGallery;

  const rows = portfolioGallery
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const nextRows = [];

  for (const row of rows) {
    const [image = "", title = "", text = ""] = row.split("|");
    const nextImage = await ensureCopied(image.trim());
    nextRows.push([nextImage, title.trim(), text.trim()].join("|"));
  }

  return nextRows.join("\n");
}

async function migrateProjects() {
  const projects = await prisma.project.findMany({
    select: { id: true, coverImage: true, gallery: true }
  });

  for (const project of projects) {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        coverImage: await ensureCopied(project.coverImage),
        gallery: await migrateGallery(project.gallery)
      }
    });
  }
}

async function migrateProperties() {
  const properties = await prisma.property.findMany({
    select: { id: true, coverImage: true, gallery: true }
  });

  for (const property of properties) {
    await prisma.property.update({
      where: { id: property.id },
      data: {
        coverImage: await ensureCopied(property.coverImage),
        gallery: await migrateGallery(property.gallery)
      }
    });
  }
}

async function migratePosts() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, coverImage: true }
  });

  for (const post of posts) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        coverImage: await ensureCopied(post.coverImage)
      }
    });
  }
}

async function migrateMedia() {
  const media = await prisma.media.findMany({
    select: { id: true, url: true }
  });

  for (const item of media) {
    if (!isMigratableLocalImage(item.url)) continue;

    await prisma.media.update({
      where: { id: item.id },
      data: {
        url: await ensureCopied(item.url)
      }
    });
  }
}

async function migrateSiteContent() {
  const records = await prisma.siteContent.findMany({
    select: { id: true, heroImage: true, portfolioGallery: true }
  });

  for (const record of records) {
    await prisma.siteContent.update({
      where: { id: record.id },
      data: {
        heroImage: await ensureCopied(record.heroImage),
        portfolioGallery: await migratePortfolioGallery(record.portfolioGallery)
      }
    });
  }
}

async function main() {
  await migrateProjects();
  await migrateProperties();
  await migratePosts();
  await migrateMedia();
  await migrateSiteContent();

  console.log("Site media migration completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
