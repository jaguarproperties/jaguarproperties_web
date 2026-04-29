import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { careerOpenings } from "@/lib/careers";
import { allowedPropertyTitles } from "@/lib/property-showcase";
import {
  demoApplications,
  demoLeads,
  demoPosts,
  demoProjects,
  demoProperties,
  demoSiteContent
} from "@/lib/demo-data";

const hasDatabase = Boolean(process.env.DATABASE_URL);

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

async function withFallback<T>(query: () => Promise<T>, fallback: T) {
  if (!hasDatabase) return fallback;
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Database unavailable, serving demo data instead.", error);
    }
    return fallback;
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

        const mergedProperties = mergePropertyRecords(properties, demoProperties as PropertyRecord[]);

        return restrictToAllowedProperties(mergedProperties.filter((property) => property.featured)).slice(0, 3);
      },
      restrictToAllowedProperties(demoProperties.filter((property) => property.featured)).slice(0, 3)
    ),
  ["featured-properties"],
  { revalidate: 300, tags: ["properties"] }
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

const getCachedProperties = unstable_cache(
  async () =>
    withFallback(
      async () => {
        const properties = await prisma.property.findMany({
          include: { project: true },
          orderBy: { createdAt: "desc" }
        });

        return mergePropertyRecords(properties, demoProperties as PropertyRecord[]);
      },
      demoProperties
    ),
  ["all-properties"],
  { revalidate: 300, tags: ["properties"] }
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
  return withFallback(
    () =>
      prisma.project.findUnique({
        where: { slug },
        include: { properties: true }
      }),
    demoProjects.find((project) => project.slug === slug) ?? null
  );
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

export async function getBlogPosts() {
  return getCachedBlogPosts();
}

export async function getBlogPostBySlug(slug: string) {
  return unstable_cache(
    async () =>
      withFallback(
        () =>
          prisma.blogPost.findUnique({
            where: { slug },
            include: {
              media: {
                orderBy: { createdAt: "asc" }
              }
            }
          }),
        (() => {
          const post = demoPosts.find((item) => item.slug === slug);
          return post ? { ...post, media: [] } : null;
        })()
      ),
    ["blog-post", slug],
    { revalidate: 300, tags: ["posts"] }
  )();
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return getCachedDashboardOverview();
}

export async function getAdminCollections() {
  return withFallback(
    async () => {
      const [projects, properties, posts, leads, applications, siteContent] = await Promise.all([
        prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
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

      return {
        projects,
        properties: restrictToAllowedProperties(properties),
        posts,
        leads,
        applications,
        siteContent
      };
    },
    {
      projects: demoProjects,
      properties: [],
      posts: demoPosts.map((post) => ({ ...post, media: [] })),
      leads: demoLeads,
      applications: demoApplications,
      siteContent: demoSiteContent
    }
  );
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
