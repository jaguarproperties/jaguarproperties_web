import { Prisma, PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

const LEGACY_SITE_MEDIA_PREFIX = "/media/site-media/";
const SITE_MEDIA_PREFIX = "/uploads/site-media/";

function normalizeSiteMediaUrl(value: string | null | undefined) {
  if (!value) return value ?? null;
  return value.startsWith(LEGACY_SITE_MEDIA_PREFIX)
    ? `${SITE_MEDIA_PREFIX}${value.slice(LEGACY_SITE_MEDIA_PREFIX.length)}`
    : value;
}

const projectUpdates: Array<{ slug: string; data: Prisma.ProjectUpdateInput }> = [
  {
    slug: "jaguar-city",
    data: {
      title: "Jaguar City",
      summary:
        "Premium Plotted Development divided into 4 blocks at NH-648, Doddaballapura Town, Bangalore North.",
      description:
        "JAGUAR CITY is a strategically located large-scale premium plotted development divided into four blocks. Located on NH-648 at Doddaballapura Town in Bangalore North, the project is currently under process and offers excellent connectivity along with strong long-term investment potential.",
      city: "Bangalore North",
      location: "NH-648, Doddaballapura Town",
      country: "India",
      priceRange: "Premium Plotted Development",
      areaSqFt: 2400,
      areaLabel: "4 Blocks",
      tags: ["Under Process", "Premium Plots", "High Investment Potential"],
      status: ProjectStatus.LAUNCHING,
      featured: true,
      visible: true,
      sortOrder: 1,
      coverImage: "/uploads/site-media/jaguar-city-150c0be1-bde2-4b8d-8a20-88cb9b70900e.png",
      gallery: [
        "/uploads/site-media/jaguar-city-150c0be1-bde2-4b8d-8a20-88cb9b70900e.png",
        "/uploads/site-media/jaguar-city-growth.jpeg"
      ],
      seoTitle: "Jaguar City | Premium Plotted Development",
      seoDescription:
        "Explore Jaguar City, a premium plotted development on NH-648 at Doddaballapura Town, Bangalore North."
    }
  },
  {
    slug: "jaguar-paradise",
    data: {
      featured: false,
      visible: false
    }
  },
  {
    slug: "green-hills",
    data: {
      title: "Green Hills",
      summary:
        "Premium Villa Plots for a Better Tomorrow near Bengaluru in a peaceful, growth-focused community.",
      description:
        "GREEN HILLS is a peaceful villa plot community at Gauribidanur near Bengaluru, designed for comfortable living and long-term growth. The project is under process and highlights DTCP approved layout planning with E-Khata and completed DC conversion.",
      city: "Near Bengaluru",
      location: "Gauribidanur",
      country: "India",
      priceRange: "Premium Villa Plots",
      areaSqFt: 1200,
      areaLabel: "DTCP Approved · E-Khata · DC Conversion",
      tags: ["Under Process", "Villa Plots", "Long-Term Growth"],
      status: ProjectStatus.LAUNCHING,
      featured: true,
      visible: true,
      sortOrder: 3,
      coverImage: "/uploads/site-media/green-hills.jpeg",
      gallery: [
        "/uploads/site-media/jaguar-city-growth.jpeg",
        "/uploads/site-media/jaguar-city-community.jpeg",
        "/uploads/site-media/jaguar-city-cover.png"
      ],
      seoTitle: "Green Hills | Premium Villa Plots Near Bengaluru",
      seoDescription:
        "Explore Green Hills, a peaceful villa plot community with DTCP approved layout planning, E-Khata, and completed DC conversion."
    }
  },
  {
    slug: "emirates-city",
    data: {
      title: "Emirates City",
      summary:
        "Integrated Township divided into 4 blocks adjacent to Jaguar City on NH-648, Doddaballapura.",
      description:
        "EMIRATES CITY is an integrated township divided into four blocks and positioned adjacent to Jaguar City on NH-648, Doddaballapura. The project is upcoming and offers flexible payment plans from 18 to 36 months for buyers seeking a large-scale plotted township opportunity.",
      city: "Adjacent to Jaguar City",
      location: "NH-648, Doddaballapura",
      country: "India",
      priceRange: "Flexible Payment Plans (18 - 36 Months)",
      areaSqFt: 2400,
      areaLabel: "4 Blocks",
      tags: ["Upcoming", "Integrated Township", "Flexible Payment Plan"],
      status: ProjectStatus.UPCOMING,
      featured: true,
      visible: true,
      sortOrder: 4,
      coverImage: "/uploads/site-media/emirates-city-main.png",
      gallery: [
        "/uploads/site-media/emirates-city.jpeg",
        "/uploads/site-media/jaguar-city-community.jpeg",
        "/uploads/site-media/jaguar-city-cover.png"
      ],
      seoTitle: "Emirates City | Integrated Township",
      seoDescription:
        "Explore Emirates City, an integrated township beside Jaguar City with flexible 18 to 36 month payment plans."
    }
  },
  {
    slug: "jaguar-diamond-city",
    data: {
      title: "Jaguar Diamond City",
      summary:
        "Premium Plotted Project on SH-74 with strong Doddaballapura to Nelamangala highway connectivity.",
      description:
        "JAGUAR DIAMOND CITY is a well-planned premium plotted development located on SH-74, Doddaballapura to Nelamangala Highway. The project is upcoming and is positioned for buyers who value a compact project footprint with excellent highway connectivity.",
      city: "Doddaballapura",
      location: "SH-74, Doddaballapura – Nelamangala Highway",
      country: "India",
      priceRange: "Premium Plotted Project",
      areaSqFt: 1800,
      areaLabel: "Premium Plotted Project",
      tags: ["Upcoming", "Highway Connectivity", "Premium Plots"],
      status: ProjectStatus.UPCOMING,
      featured: true,
      visible: true,
      sortOrder: 5,
      coverImage: "/uploads/site-media/jaguar-diamond-city-main.png",
      gallery: [
        "/uploads/site-media/jaguar-city.jpeg",
        "/uploads/site-media/jaguar-city-growth.jpeg",
        "/uploads/site-media/jaguar-city-cover.png"
      ],
      seoTitle: "Jaguar Diamond City | Premium Plotted Project",
      seoDescription:
        "Explore Jaguar Diamond City, a premium plotted project on SH-74 with excellent highway connectivity."
    }
  }
];

async function syncProjectMedia(projectId: string, urls: string[]) {
  await prisma.media.deleteMany({
    where: { projectId }
  });

  for (const [index, url] of urls.entries()) {
    await prisma.media.create({
      data: {
        url,
        alt: index === 0 ? "Featured project image" : "Project gallery image",
        entityType: "PROJECT",
        projectId
      }
    });
  }
}

async function normalizeExistingMediaUrls() {
  const mediaRecords = await prisma.media.findMany();

  for (const media of mediaRecords) {
    const nextUrl = normalizeSiteMediaUrl(media.url);

    if (nextUrl && nextUrl !== media.url) {
      await prisma.media.update({
        where: { id: media.id },
        data: { url: nextUrl }
      });
    }
  }
}

async function normalizeBlogPostImages() {
  const posts = await prisma.blogPost.findMany();

  for (const post of posts) {
    const nextCoverImage = normalizeSiteMediaUrl(post.coverImage);

    if (nextCoverImage && nextCoverImage !== post.coverImage) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { coverImage: nextCoverImage }
      });
    }
  }
}

async function normalizeSiteContentImages() {
  const entries = await prisma.siteContent.findMany();

  for (const entry of entries) {
    const nextHeroImage = normalizeSiteMediaUrl(entry.heroImage);

    if (nextHeroImage && nextHeroImage !== entry.heroImage) {
      await prisma.siteContent.update({
        where: { id: entry.id },
        data: { heroImage: nextHeroImage }
      });
    }
  }
}

async function main() {
  for (const update of projectUpdates) {
    const existingProject = await prisma.project.findUnique({
      where: { slug: update.slug },
      select: { id: true }
    });

    if (!existingProject) {
      console.log(`Skipped missing project: ${update.slug}`);
      continue;
    }

    const savedProject = await prisma.project.update({
      where: { id: existingProject.id },
      data: update.data
    });

    if (typeof update.data.coverImage === "string" && Array.isArray(update.data.gallery)) {
      const urls = Array.from(new Set([update.data.coverImage, ...update.data.gallery]));
      await syncProjectMedia(savedProject.id, urls);
    }

    console.log(`Updated project: ${update.slug}`);
  }

  await normalizeExistingMediaUrls();
  await normalizeBlogPostImages();
  await normalizeSiteContentImages();

  console.log("Project content and site-media URLs synced.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
