import { unstable_cache } from "next/cache";
import { MediaEntityType } from "@prisma/client";
import type { JobApplication, Lead, Prisma, Project } from "@prisma/client";

import { isDatabaseEnabled } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import { careerOpenings } from "@/lib/careers";
import { getLocalProjectBySlug, listLocalProjects } from "@/lib/local-projects";
import { allowedPropertyTitles } from "@/lib/property-showcase";
import { listAllTestimonials, listPublishedTestimonials } from "@/lib/testimonials";
import {
  demoApplications,
  demoLeads,
  demoPosts,
  demoProjects,
  demoProperties,
  demoSiteContent,
  demoTestimonials
} from "@/lib/demo-data";

const hasDatabase = isDatabaseEnabled() && Boolean(process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL);

function assertDatabaseAvailable() {
  if (!hasDatabase) {
    throw new Error("DATABASE_URL is not configured. This application is configured to use MongoDB for all data.");
  }
}

function dedupeProjectImages(coverImage: string, gallery: string[]) {
  return Array.from(new Set([coverImage, ...gallery].filter(Boolean)));
}

async function syncProjectMediaForDatabase(projectId: string, coverImage: string, gallery: string[]) {
  const urls = dedupeProjectImages(coverImage, gallery);

  await prisma.media.deleteMany({
    where: { projectId }
  });

  if (!urls.length) return;

  await Promise.all(
    urls.map((url, index) =>
      prisma.media.create({
        data: {
          url,
          alt: index === 0 ? "Featured project image" : "Project gallery image",
          entityType: MediaEntityType.PROJECT,
          projectId
        }
      })
    )
  );
}

async function syncLocalProjectsToDatabase() {
  if (!hasDatabase) return;

  const localProjects = await listLocalProjects();

  for (const project of localProjects) {
    const payload = {
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      city: project.city,
      location: project.location,
      country: project.country,
      priceRange: project.priceRange,
      areaSqFt: project.areaSqFt,
      areaLabel: project.areaLabel,
      tags: project.tags,
      status: project.status,
      completionDate: project.completionDate,
      featured: project.featured,
      visible: project.visible,
      sortOrder: project.sortOrder,
      coverImage: project.coverImage,
      gallery: project.gallery,
      seoTitle: project.seoTitle,
      seoDescription: project.seoDescription
    };

    const existingProject = await prisma.project.findFirst({
      where: {
        OR: [{ id: project.id }, { slug: project.slug }]
      },
      select: { id: true }
    });

    const savedProject = existingProject
      ? await prisma.project.update({
          where: { id: existingProject.id },
          data: payload
        })
      : await prisma.project.create({
          data: {
            id: project.id,
            ...payload,
            createdAt: project.createdAt
          }
        });

    await syncProjectMediaForDatabase(savedProject.id, project.coverImage, project.gallery);
  }
}

export type AdminUserRecord = {
  id: string;
  username: string;
  employeeCode: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  reportingManagerId: string | null;
  reportingManagerName: string | null;
  leaveBalance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserFilters = {
  department?: string;
};

type AdminJobPosting = {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  openings: number;
  qualification: string | null;
  experience: string | null;
  salary: string | null;
  type: string;
  isActive: boolean;
  postedAt: Date;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type DashboardOverview = {
  leads: number;
  properties: number;
  projects: number;
  posts: number;
  applications: number;
  jobs: number;
  openings: number;
};

type AdminProjectRecord = {
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
};
type AdminPropertyRecord = Prisma.PropertyGetPayload<{ include: { project: true } }>;
type AdminPostRecord = Prisma.BlogPostGetPayload<{ include: { media: true } }>;
type AdminCollections = {
  projects: AdminProjectRecord[];
  properties: AdminPropertyRecord[];
  posts: AdminPostRecord[];
  testimonials: Awaited<ReturnType<typeof listAllTestimonials>>;
  leads: Lead[];
  applications: JobApplication[];
  siteContent: NonNullable<Awaited<ReturnType<typeof getSiteContent>>>;
};

type PropertyRecord = (typeof demoProperties)[number];
const allowedPropertyTitleSet = new Set<string>(allowedPropertyTitles.map((title) => title.toLowerCase()));

function normalizePropertyTitle(title: string) {
  return title.trim().toLowerCase();
}

function getFallbackAdminJobPostings(): AdminJobPosting[] {
  return careerOpenings.map((job, index) => ({
    id: `fallback-job-${index + 1}`,
    title: job.title,
    department: "General",
    location: "Bengaluru",
    description: job.requirements.join("\n"),
    requirements: job.requirements.join("\n"),
    openings: job.openings,
    qualification: job.qualification,
    experience: job.experience,
    salary: null,
    type: "FULL_TIME",
    isActive: true,
    postedAt: new Date(),
    expiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

export type PropertyFilterParams = {
  search?: string;
  location?: string;
  budget?: string;
  size?: string;
  status?: string;
  category?: string;
};

export type ProjectFilterParams = {
  search?: string;
  location?: string;
  status?: string;
  tag?: string;
};

async function withFallback<T>(query: () => Promise<T>, _fallback: T) {
  if (!hasDatabase) {
    return _fallback;
  }

  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Database query failed, serving fallback data instead.", error);
    }

    return _fallback;
  }
}

const getCachedSiteContent = unstable_cache(
  async () =>
    withFallback(
      () =>
        prisma.siteContent.findFirst({
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
        }),
      demoSiteContent
    ),
  ["site-content"],
  { revalidate: 300, tags: ["site-content"] }
);

const getCachedFeaturedProperties = unstable_cache(
  async () =>
    withFallback(
      async () => {
        const properties = await prisma.property.findMany({
          where: { featured: true },
          include: { project: true },
          take: 3,
          orderBy: { createdAt: "desc" }
        });

        return restrictToAllowedProperties(properties.filter((property) => property.featured)).slice(0, 3);
      },
      restrictToAllowedProperties(demoProperties.filter((property) => property.featured)).slice(0, 3)
    ),
  ["featured-properties"],
  { revalidate: 300, tags: ["properties"] }
);

const sortProjectsForDisplay = <T extends {
  sortOrder?: number | null;
  updatedAt?: Date | string | null;
  createdAt?: Date | string | null;
}>(projects: T[]) =>
  [...projects].sort((left, right) => {
    const orderDifference = (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
    if (orderDifference !== 0) return orderDifference;

    const leftTime = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
    const rightTime = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });

const getCachedFeaturedProjects = unstable_cache(
  async () =>
    withFallback(
      async () => {
        const projects = await prisma.project.findMany({
          where: {
            featured: true,
            visible: true
          },
          orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
        });

        return sortProjectsForDisplay(projects).slice(0, 3);
      },
      sortProjectsForDisplay(demoProjects.filter((project) => project.featured && project.visible)).slice(0, 3)
    ),
  ["featured-projects"],
  { revalidate: 300, tags: ["projects"] }
);

const getCachedBlogPosts = unstable_cache(
  async () =>
    withFallback(
      () =>
        prisma.blogPost.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" }
        }),
      demoPosts
    ),
  ["blog-posts"],
  { revalidate: 300, tags: ["posts"] }
);

const getCachedTestimonials = unstable_cache(
  async () => withFallback(() => listPublishedTestimonials(), demoTestimonials.filter((item) => item.published)),
  ["testimonials"],
  { revalidate: 300, tags: ["testimonials"] }
);

const getCachedProperties = unstable_cache(
  async () =>
    withFallback(
      () =>
        prisma.property.findMany({
          include: { project: true },
          orderBy: { createdAt: "desc" }
        }),
      demoProperties
    ),
  ["all-properties"],
  { revalidate: 300, tags: ["properties"] }
);

const getCachedProjects = unstable_cache(
  async () =>
    withFallback(
      () =>
        prisma.project.findMany({
          where: { visible: true },
          orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
        }),
      demoProjects.filter((project) => project.visible)
    ),
  ["all-projects"],
  { revalidate: 300, tags: ["projects"] }
);

const getCachedDashboardOverview = unstable_cache(
  async (): Promise<DashboardOverview> => {
    const fallbackJobPostings = getFallbackAdminJobPostings();
    const fallbackOpenings = fallbackJobPostings.reduce((sum, job) => sum + job.openings, 0);

    if (!hasDatabase) {
      return {
        leads: demoLeads.length,
        properties: demoProperties.length,
        projects: demoProjects.length,
        posts: demoPosts.length,
        applications: demoApplications.length,
        jobs: fallbackJobPostings.length,
        openings: fallbackOpenings
      };
    }

    try {
      const [leads, properties, projects, posts, applications, jobs] = await Promise.all([
        prisma.lead.count(),
        prisma.property.count(),
        prisma.project.count(),
        prisma.blogPost.count(),
        prisma.jobApplication.count(),
        prisma.jobPosting.findMany({
          where: { isActive: true },
          select: { openings: true }
        })
      ]);

      return {
        leads,
        properties,
        projects,
        posts,
        applications,
        jobs: jobs.length,
        openings: jobs.reduce((sum, job) => sum + (job.openings ?? 0), 0)
      };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Job posting data unavailable on dashboard, serving fallback openings instead.", error);
      }
      return {
        leads: demoLeads.length,
        properties: demoProperties.length,
        projects: demoProjects.length,
        posts: demoPosts.length,
        applications: demoApplications.length,
        jobs: fallbackJobPostings.length,
        openings: fallbackOpenings
      };
    }
  },
  ["admin-dashboard-overview"],
  { revalidate: 60, tags: ["admin-dashboard"] }
);

const getCachedAdminDashboardPreview = unstable_cache(
  async () =>
    withFallback(
      async () => {
        const [leads, leadCount, siteContent, jobPostingCount, recentJobPostings] = await Promise.all([
          prisma.lead.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            },
            orderBy: { createdAt: "desc" },
            take: 5
          }),
          prisma.lead.count(),
          prisma.siteContent.findFirst({
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
          }),
          prisma.jobPosting.count(),
          prisma.jobPosting.findMany({
            select: {
              id: true,
              title: true,
              department: true,
              location: true,
              openings: true,
              type: true
            },
            orderBy: { createdAt: "desc" },
            take: 6
          })
        ]);

        return {
          recentLeads: leads,
          leadCount,
          siteContent,
          jobPostingCount,
          recentJobPostings
        };
      },
      {
        recentLeads: demoLeads.slice(0, 5),
        leadCount: demoLeads.length,
        siteContent: demoSiteContent,
        jobPostingCount: getFallbackAdminJobPostings().length,
        recentJobPostings: getFallbackAdminJobPostings().slice(0, 6)
      }
    ),
  ["admin-dashboard-preview"],
  { revalidate: 60, tags: ["admin-dashboard", "site-content", "jobs", "leads"] }
);

const getCachedUserDepartments = unstable_cache(
  async (): Promise<string[]> => {
    if (!hasDatabase) {
      const users = await getNotificationAudienceUsers();

      return Array.from(
        new Set(
          users
            .map((user) => user.department?.trim())
            .filter((department): department is string => Boolean(department))
        )
      ).sort((a, b) => a.localeCompare(b));
    }

    try {
      const departments = await prisma.user.findMany({
        where: {
          department: {
            not: null
          }
        },
        select: {
          department: true
        },
        distinct: ["department"]
      });

      return departments
        .map((item) => item.department?.trim())
        .filter((department): department is string => Boolean(department))
        .sort((a, b) => a.localeCompare(b));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Falling back to derived user departments.", error);
      }

      const users = await getNotificationAudienceUsers();
      return Array.from(
        new Set(
          users
            .map((user) => user.department?.trim())
            .filter((department): department is string => Boolean(department))
        )
      ).sort((a, b) => a.localeCompare(b));
    }
  },
  ["user-departments"],
  { revalidate: 300, tags: ["users"] }
);

export async function getSiteContent() {
  return getCachedSiteContent();
}

export async function getProjectBySlug(slug: string) {
  if (!hasDatabase) {
    return getLocalProjectBySlug(slug);
  }

  try {
    return await prisma.project.findFirst({
      where: { slug, visible: true },
      include: { properties: true, media: { orderBy: { createdAt: "asc" } } }
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Project lookup failed, serving local project fallback instead.", error);
    }

    return getLocalProjectBySlug(slug);
  }
}

function filterProjects<T extends Pick<Project, "title" | "summary" | "description" | "location" | "city" | "status" | "tags">>(
  projects: T[],
  filters: ProjectFilterParams
) {
  const search = filters.search?.trim().toLowerCase();
  const location = filters.location?.trim().toLowerCase();
  const status = filters.status?.trim().toLowerCase();
  const tag = filters.tag?.trim().toLowerCase();

  return projects.filter((project) => {
    const haystack = [project.title, project.summary, project.description, project.location, project.city, ...project.tags]
      .join(" ")
      .toLowerCase();

    const matchesSearch = search ? haystack.includes(search) : true;
    const matchesLocation = location ? project.location.toLowerCase().includes(location) : true;
    const matchesStatus = status ? project.status.toLowerCase() === status : true;
    const matchesTag = tag ? project.tags.some((item) => item.toLowerCase() === tag) : true;

    return matchesSearch && matchesLocation && matchesStatus && matchesTag;
  });
}

function parsePriceValue(price: string) {
  const normalized = price.toLowerCase();
  const number = Number.parseFloat(normalized.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(number)) return null;

  if (normalized.includes("cr")) return number * 100;
  if (normalized.includes("mn")) return number * 100;
  if (normalized.includes("l")) return number;
  return number;
}

function matchesBudget(price: string, budget?: string) {
  if (!budget || budget === "Any Budget") return true;
  const value = parsePriceValue(price);
  if (value === null) return true;

  if (budget === "Under 1 Cr") return value < 100;
  if (budget === "1 Cr - 2 Cr") return value >= 100 && value <= 200;
  if (budget === "2 Cr - 5 Cr") return value > 200 && value <= 500;
  if (budget === "5 Cr+") return value > 500;
  return true;
}

function matchesSize(areaSqFt: number | null | undefined, size?: string) {
  if (!size || size === "Any Size") return true;
  if (!areaSqFt) return false;

  if (size === "Under 1500 sq ft") return areaSqFt < 1500;
  if (size === "1500 - 2400 sq ft") return areaSqFt >= 1500 && areaSqFt <= 2400;
  if (size === "2400 - 3200 sq ft") return areaSqFt > 2400 && areaSqFt <= 3200;
  if (size === "3200+ sq ft") return areaSqFt > 3200;
  return true;
}

function getPropertyTags(property: {
  title: string;
  description: string;
  location: string;
  city: string;
  project?: { title: string } | null;
}) {
  const haystack = [
    property.title,
    property.description,
    property.location,
    property.city,
    property.project?.title ?? ""
  ]
    .join(" ")
    .toLowerCase();

  return {
    "All Projects": true,
    "North Bengaluru":
      haystack.includes("north bengaluru") ||
      haystack.includes("airport") ||
      ["doddaballapur", "devanahalli", "yelahanka"].includes(property.location.toLowerCase()),
    Township:
      haystack.includes("township") || haystack.includes("block") || haystack.includes("integrated"),
    "Villa Plots":
      haystack.includes("plot") || haystack.includes("plots") || haystack.includes("villa"),
    "Farm Lands":
      haystack.includes("farm land") || haystack.includes("farm lands") || haystack.includes("farm house"),
    Apartments:
      haystack.includes("apartment") || haystack.includes("apartments") || haystack.includes("units"),
    "Commercial Land":
      haystack.includes("commercial") || haystack.includes("converted plots"),
    Investment:
      haystack.includes("investment") ||
      haystack.includes("investor") ||
      haystack.includes("growth") ||
      haystack.includes("appreciation"),
    "Gated Community":
      haystack.includes("gated") || haystack.includes("community") || haystack.includes("clubhouse")
  };
}

function filterProperties<T extends {
  title: string;
  description: string;
  location: string;
  city: string;
  price: string;
  areaSqFt?: number | null;
  status: string;
  project?: { title: string } | null;
}>(properties: T[], filters: PropertyFilterParams) {
  const search = filters.search?.trim().toLowerCase();

  return properties.filter((property) => {
    const haystack = [
      property.title,
      property.description,
      property.location,
      property.city,
      property.project?.title ?? ""
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = search ? haystack.includes(search) : true;
    const matchesLocation =
      !filters.location || filters.location === "All Locations"
        ? true
        : property.location.toLowerCase() === filters.location.toLowerCase();
    const matchesStatus =
      !filters.status || filters.status === "Any Status"
        ? true
        : property.status.toLowerCase() === filters.status.toLowerCase();
    const categoryTags = getPropertyTags(property);
    const matchesCategory =
      !filters.category || filters.category === "All Projects"
        ? true
        : categoryTags[filters.category as keyof typeof categoryTags];

    return (
      matchesSearch &&
      matchesLocation &&
      matchesBudget(property.price, filters.budget) &&
      matchesSize(property.areaSqFt, filters.size) &&
      matchesStatus &&
      matchesCategory
    );
  });
}

function sortPropertiesByNewest<T extends { createdAt?: Date | string | null }>(properties: T[]) {
  return [...properties].sort((left, right) => {
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

function isAllowedPropertyTitle(title: string) {
  return allowedPropertyTitleSet.has(normalizePropertyTitle(title));
}

function sortPropertiesByAllowedOrder<T extends { title: string; createdAt?: Date | string | null }>(properties: T[]) {
  return [...properties].sort((left, right) => {
    const leftIndex = allowedPropertyTitles.findIndex((title) => title === left.title);
    const rightIndex = allowedPropertyTitles.findIndex((title) => title === right.title);

    if (leftIndex !== -1 && rightIndex !== -1 && leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    if (leftIndex !== -1 && rightIndex === -1) return -1;
    if (leftIndex === -1 && rightIndex !== -1) return 1;

    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
    return rightTime - leftTime;
  });
}

function restrictToAllowedProperties<T extends { title: string; createdAt?: Date | string | null }>(properties: T[]) {
  const deduped = new Map<string, T>();

  for (const property of sortPropertiesByAllowedOrder(properties)) {
    if (!isAllowedPropertyTitle(property.title)) continue;

    const key = normalizePropertyTitle(property.title);
    if (!deduped.has(key)) {
      deduped.set(key, property);
    }
  }

  return Array.from(deduped.values());
}

function mergePropertyRecords<T extends { slug: string; createdAt?: Date | string | null }>(primary: T[], secondary: T[]) {
  const merged = new Map<string, T>();

  for (const item of sortPropertiesByNewest(primary)) {
    const key = "title" in item && typeof item.title === "string" && isAllowedPropertyTitle(item.title)
      ? `title:${normalizePropertyTitle(item.title)}`
      : `slug:${item.slug}`;

    if (!merged.has(key)) {
      merged.set(key, item);
    }
  }

  for (const item of sortPropertiesByNewest(secondary)) {
    const key = "title" in item && typeof item.title === "string" && isAllowedPropertyTitle(item.title)
      ? `title:${normalizePropertyTitle(item.title)}`
      : `slug:${item.slug}`;

    if (!merged.has(key)) {
      merged.set(key, item);
    }
  }

  return sortPropertiesByNewest(Array.from(merged.values()));
}

export async function getProperties(filters: PropertyFilterParams = {}) {
  const properties = await getCachedProperties();
  return filterProperties(restrictToAllowedProperties(properties), filters);
}

export async function getPropertyBySlug(slug: string) {
  const properties = await getCachedProperties();
  return restrictToAllowedProperties(properties).find((property) => property.slug === slug) ?? null;
}

export async function getFeaturedProperties() {
  return getCachedFeaturedProperties();
}

export async function getFeaturedProjects() {
  return getCachedFeaturedProjects();
}

export async function getProjects(filters: ProjectFilterParams = {}) {
  const projects = await getCachedProjects();
  return filterProjects(projects, filters);
}

export async function getBlogPosts() {
  return getCachedBlogPosts();
}

export async function getTestimonials() {
  return getCachedTestimonials();
}

export async function getBlogPostBySlug(slug: string) {
  return unstable_cache(
    async () => {
      assertDatabaseAvailable();
      return prisma.blogPost.findUnique({
        where: { slug },
        include: {
          media: {
            orderBy: { createdAt: "asc" }
          }
        }
      });
    },
    ["blog-post", slug],
    { revalidate: 300, tags: ["posts"] }
  )();
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return getCachedDashboardOverview();
}

export async function getAdminCollections(): Promise<AdminCollections> {
  if (!hasDatabase) {
    return {
      projects: await listLocalProjects(),
      properties: restrictToAllowedProperties(demoProperties),
      posts: demoPosts.map((post) => ({ ...post, media: [] })),
      testimonials: demoTestimonials,
      leads: demoLeads,
      applications: demoApplications,
      siteContent: demoSiteContent
    };
  }

  try {
    await syncLocalProjectsToDatabase();

    const [projects, properties, posts, leads, applications, siteContent] = await Promise.all([
      prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
      prisma.property.findMany({ include: { project: true }, orderBy: { createdAt: "desc" } }),
      prisma.blogPost.findMany({
        include: {
          media: {
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } }),
      getSiteContent()
    ]);

    const testimonials = await listAllTestimonials();

    return {
      projects,
      properties: restrictToAllowedProperties(properties),
      posts,
      testimonials,
      leads,
      applications,
      siteContent: siteContent ?? demoSiteContent
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Admin collections unavailable from database, serving local fallback instead.", error);
    }

    return {
      projects: await listLocalProjects(),
      properties: restrictToAllowedProperties(demoProperties),
      posts: demoPosts.map((post) => ({ ...post, media: [] })),
      testimonials: demoTestimonials,
      leads: demoLeads,
      applications: demoApplications,
      siteContent: demoSiteContent
    };
  }
}

export async function getAdminDashboardPreview() {
  return getCachedAdminDashboardPreview();
}

export async function getAdminJobPostings(): Promise<AdminJobPosting[]> {
  return withFallback(
    () =>
      prisma.jobPosting.findMany({
        orderBy: { createdAt: "desc" }
      }),
    getFallbackAdminJobPostings()
  );
}

export async function getAdminJobPostingById(id: string): Promise<AdminJobPosting | null> {
  return withFallback(
    () =>
      prisma.jobPosting.findUnique({
        where: { id }
      }),
    null
  );
}

export async function getAdminUsers(filters: AdminUserFilters = {}): Promise<AdminUserRecord[]> {
  const department = filters.department?.trim();

  return withFallback(
    () =>
      prisma.user.findMany({
        where: department
          ? {
              department: {
                equals: department
              }
            }
          : undefined,
        select: {
          id: true,
          username: true,
          employeeCode: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          department: true,
          reportingManagerId: true,
          casualLeaveBalance: true,
          sickLeaveBalance: true,
          paidLeaveBalance: true,
          unpaidLeaveBalance: true,
          createdAt: true,
          updatedAt: true,
          reportingManager: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }).then((users) =>
        users.map((user) => ({
          id: user.id,
          username: user.username,
          employeeCode: user.employeeCode,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department,
          reportingManagerId: user.reportingManagerId,
          reportingManagerName: user.reportingManager?.name ?? user.reportingManager?.email ?? null,
          leaveBalance:
            (user.casualLeaveBalance ?? 0) +
            (user.sickLeaveBalance ?? 0) +
            (user.paidLeaveBalance ?? 0) +
            (user.unpaidLeaveBalance ?? 0),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      ),
    []
  );
}

export async function getNotificationAudienceUsers(filters: AdminUserFilters = {}) {
  return getAdminUsers(filters);
}

export async function getUserDepartments(): Promise<string[]> {
  return getCachedUserDepartments();
}

export async function getManagerOptions() {
  return withFallback(
    () =>
      prisma.user.findMany({
        where: {
          role: { in: ["MANAGER", "ADMIN", "SUPER_ADMIN", "HR"] }
        },
        select: {
          id: true,
          name: true,
          email: true
        },
        orderBy: [{ name: "asc" }, { email: "asc" }]
      }),
    []
  );
}

export async function getAdminUserById(id: string): Promise<AdminUserRecord | null> {
  return withFallback(
    () =>
      prisma.user
        .findUnique({
          where: { id },
          select: {
            id: true,
            username: true,
            employeeCode: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            department: true,
            reportingManagerId: true,
            casualLeaveBalance: true,
            sickLeaveBalance: true,
            paidLeaveBalance: true,
            unpaidLeaveBalance: true,
            createdAt: true,
            updatedAt: true,
            reportingManager: {
              select: {
                name: true,
                email: true
              }
            }
          }
        })
        .then((user) =>
          user
            ? {
                id: user.id,
                username: user.username,
                employeeCode: user.employeeCode,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                department: user.department,
                reportingManagerId: user.reportingManagerId,
                reportingManagerName: user.reportingManager?.name ?? user.reportingManager?.email ?? null,
                leaveBalance:
                  (user.casualLeaveBalance ?? 0) +
                  (user.sickLeaveBalance ?? 0) +
                  (user.paidLeaveBalance ?? 0) +
                  (user.unpaidLeaveBalance ?? 0),
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              }
            : null
        ),
    null
  );
}
