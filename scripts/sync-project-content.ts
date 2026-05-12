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
        "Premium plotted development divided into multiple blocks on NH-648, Doddaballapura Town, Bangalore North.",
      description:
        "Jaguar City is a large-scale plotted development strategically located along NH-648 in the fast-growing corridor of Doddaballapura, Bangalore North. Designed for both investors and future homeowners, the project offers well-planned residential plots with strong appreciation potential. Key features include a master-planned layout, well-structured residential blocks, wide internal roads, gated community planning, drainage and underground infrastructure planning, and excellent highway connectivity. Located in one of North Bangalore's emerging growth zones, Jaguar City offers strong ROI potential due to expanding infrastructure and proximity to industrial and residential hubs.",
      city: "Bangalore North",
      location: "NH-648, Doddaballapura Town",
      country: "India",
      priceRange: "Premium Plotted Development",
      areaSqFt: 2400,
      areaLabel: "Multiple Blocks",
      tags: ["Under Process", "Premium Plots", "Master-Planned Layout", "High ROI Potential"],
      status: ProjectStatus.LAUNCHING,
      featured: true,
      visible: true,
      sortOrder: 1,
      coverImage: "/uploads/site-media/jaguar-city-project.png",
      gallery: [
        "/uploads/site-media/jaguar-city-project.png",
        "/uploads/site-media/jaguar-city-growth.jpeg"
      ],
      seoTitle: "Jaguar City | Premium Plotted Development",
      seoDescription:
        "Explore Jaguar City, a premium plotted development on NH-648 in Doddaballapura Town with strong connectivity and appreciation potential."
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
        "Premium villa plots for a better tomorrow at Gauribidanur, near Bengaluru.",
      description:
        "Green Hills is a premium villa plot development designed for peaceful living and long-term investment. Surrounded by natural greenery, the project offers a serene environment away from city congestion while maintaining accessibility. Project highlights include a DTCP approved layout, E-Khata availability, DC conversion completed, readiness for registration, clear legal documentation, and spacious villa plots. Ideal for those seeking a calm environment, Green Hills combines legal clarity, open spaces, and future development potential in a fast-developing location.",
      city: "Near Bengaluru",
      location: "Gauribidanur",
      country: "India",
      priceRange: "Premium Villa Plots",
      areaSqFt: 1200,
      areaLabel: "DTCP Approved Layout",
      tags: ["Under Process", "Villa Plots", "E-Khata", "Ready for Registration"],
      status: ProjectStatus.LAUNCHING,
      featured: true,
      visible: true,
      sortOrder: 3,
      coverImage: "/uploads/site-media/green-hills-project.jpeg",
      gallery: [
        "/uploads/site-media/green-hills-project.jpeg",
        "/uploads/site-media/jaguar-city-community.jpeg",
        "/uploads/site-media/jaguar-city-cover.png"
      ],
      seoTitle: "Green Hills | Premium Villa Plots Near Bengaluru",
      seoDescription:
        "Explore Green Hills, premium villa plots near Bengaluru with DTCP approval, E-Khata, legal clarity, and registration readiness."
    }
  },
  {
    slug: "emirates-city",
    data: {
      title: "Emirates City",
      summary:
        "Integrated township development divided into multiple blocks adjacent to Jaguar City on NH-648, Doddaballapura.",
      description:
        "Emirates City is a proposed integrated township offering a blend of residential plots and future-ready infrastructure. Positioned adjacent to Jaguar City, this project is planned to create a modern community experience. Key features include township-style development, planned residential blocks, flexible payment plans, strategic highway access, and future community amenities. Its flexible payment structure makes it ideal for investors looking to secure property with manageable installments in a high-growth corridor.",
      city: "Doddaballapura",
      location: "NH-648, Doddaballapura",
      country: "India",
      priceRange: "Flexible Payment Plans Available",
      areaSqFt: 2400,
      areaLabel: "Multiple Blocks",
      tags: ["Upcoming", "Integrated Township", "Flexible Payment Plans", "High-Growth Corridor"],
      status: ProjectStatus.UPCOMING,
      featured: true,
      visible: true,
      sortOrder: 4,
      coverImage: "/uploads/site-media/emirates-city-project.png",
      gallery: [
        "/uploads/site-media/emirates-city-project.png",
        "/uploads/site-media/jaguar-city-community.jpeg",
        "/uploads/site-media/jaguar-city-cover.png"
      ],
      seoTitle: "Emirates City | Integrated Township",
      seoDescription:
        "Explore Emirates City, an integrated township in Doddaballapura with flexible payment plans and future-ready community planning."
    }
  },
  {
    slug: "jaguar-diamond-city",
    data: {
      title: "Jaguar Diamond City",
      summary:
        "Premium plotted project on SH-74, Doddaballapura to Nelamangala Highway.",
      description:
        "Jaguar Diamond City is a boutique plotted development strategically positioned along SH-74. Designed for focused residential planning, it offers premium plots with strong connectivity to Nelamangala and surrounding hubs. Key features include a well-planned layout, highway-facing location, planned infrastructure development, and investment-friendly plot options. The project also offers direct access to SH-74, easy reach to Nelamangala Highway, and smooth connectivity to Bangalore North.",
      city: "Doddaballapura",
      location: "SH-74, Doddaballapura – Nelamangala Highway",
      country: "India",
      priceRange: "Premium Plotted Project",
      areaSqFt: 1800,
      areaLabel: "Highway-Facing Location",
      tags: ["Upcoming", "Premium Plots", "Highway Connectivity", "Investment-Friendly"],
      status: ProjectStatus.UPCOMING,
      featured: true,
      visible: true,
      sortOrder: 5,
      coverImage: "/uploads/site-media/jaguar-diamond-city-project.png",
      gallery: [
        "/uploads/site-media/jaguar-diamond-city-project.png",
        "/uploads/site-media/jaguar-city-growth.jpeg",
        "/uploads/site-media/jaguar-city-cover.png"
      ],
      seoTitle: "Jaguar Diamond City | Premium Plotted Project",
      seoDescription:
        "Explore Jaguar Diamond City, a premium plotted project on SH-74 with direct highway access and smooth connectivity to Bangalore North."
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
