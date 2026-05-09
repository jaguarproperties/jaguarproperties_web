import { PrismaClient, ProjectStatus, PropertyStatus } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { demoSiteContent } from "@/lib/demo-data";
import { defaultRolePermissions, systemRoleDetails, toLegacyPermissionFlags } from "@/lib/permissions";
import { propertyShowcase } from "@/lib/property-showcase";
import { siteMedia } from "@/lib/site-media";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const DEFAULT_ADMIN_EMPLOYEE_CODE = "JP2026A0001";
const LEGACY_ADMIN_USERNAME = "jaguarproperties2023";
const LEGACY_ADMIN_EMAIL = "admin@jaguarproperties.in";
const projectSeedData = [
  {
    id: "seed-project-jaguar-city",
    title: "Jaguar City",
    slug: "jaguar-city",
    summary:
      "100 acres divided into 4 blocks, ready for registration, attached to NH-648 at Doddaballapura Town in Bangalore North.",
    description:
      "JAGUAR CITY is a 100-acre project divided into four blocks and positioned as a ready-for-registration plotted development attached to NH-648 at Doddaballapura Town, Bangalore North. It is designed for buyers who want immediate documentation readiness, strong highway visibility, and a large-format township opportunity in the Doddaballapura growth corridor.",
    city: "Bengaluru",
    location: "Doddaballapura",
    country: "India",
    priceRange: "Ready For Registration",
    areaSqFt: 2400,
    areaLabel: "100-acre township · 4 blocks",
    tags: ["Ready for Registration", "Township", "Premium"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 1,
    coverImage: siteMedia.jaguarCityCover,
    gallery: [siteMedia.jaguarCity, siteMedia.jaguarCityCommunity, siteMedia.jaguarCityGrowth],
    seoTitle: "Jaguar City | 100 Acres at NH-648 Doddaballapura",
    seoDescription:
      "Explore Jaguar City, a 100-acre four-block project ready for registration at NH-648, Doddaballapura Town, Bangalore North."
  },
  {
    id: "seed-project-jaguar-paradise",
    title: "Jaguar Paradise",
    slug: "jaguar-paradise",
    summary:
      "A plotted community built for buyers who want gated living, registration clarity, and a growth-led North Bengaluru address.",
    description:
      "Jaguar Paradise is positioned as a premium plotted community for families and investors who want a balanced combination of location access, documentation readiness, and a cleaner residential environment in the broader Bengaluru growth corridor.",
    city: "Bengaluru",
    location: "North Bengaluru",
    country: "India",
    priceRange: "Price on request",
    areaSqFt: 1500,
    areaLabel: "Premium plotted community",
    tags: ["Premium", "Listing"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 2,
    coverImage: siteMedia.jaguarCityCommunity,
    gallery: [siteMedia.jaguarCityCommunity, siteMedia.jaguarCityCover, siteMedia.jaguarCityGrowth],
    seoTitle: "Jaguar Paradise | Premium Plotted Community",
    seoDescription:
      "Discover Jaguar Paradise, a premium plotted community in the North Bengaluru growth corridor."
  },
  {
    id: "seed-project-green-hills",
    title: "Green Hills",
    slug: "green-hills",
    summary:
      "A land-led community designed around open surroundings, investor appeal, and ready access to Bengaluru's expanding northern belt.",
    description:
      "Green Hills is framed as a plotted development for buyers who value calmer surroundings, future growth potential, and a flexible entry point into the Bengaluru plotted-land market.",
    city: "Bengaluru",
    location: "Bangalore North",
    country: "India",
    priceRange: "Price on request",
    areaSqFt: 1200,
    areaLabel: "Growth-led plotted enclave",
    tags: ["Listing", "Investment"],
    status: ProjectStatus.UPCOMING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 3,
    coverImage: siteMedia.jaguarCityGrowth,
    gallery: [siteMedia.jaguarCityGrowth, siteMedia.jaguarCityCommunity, siteMedia.jaguarCityCover],
    seoTitle: "Green Hills | Plotted Development in North Bengaluru",
    seoDescription:
      "Explore Green Hills, a plotted development designed for long-term growth and investor interest."
  },
  {
    id: "seed-project-emirates-city",
    title: "Emirates City",
    slug: "emirates-city",
    summary:
      "100 acres divided into 4 blocks with flexible payment plans between 18 and 36 months, attached to Jaguar City on NH-648.",
    description:
      "EMIRATES CITY is a 100-acre project divided into four blocks and attached to the Jaguar City corridor on NH-648 at Doddaballapura Town, Bangalore North. The project is positioned for buyers who want a large plotted development with flexible payment plans structured between 18 and 36 months.",
    city: "Bengaluru",
    location: "Doddaballapura",
    country: "India",
    priceRange: "Flexible Payment Plans (18 - 36 Months)",
    areaSqFt: 2400,
    areaLabel: "100-acre township · 4 blocks",
    tags: ["Premium", "Listing", "Payment Plan"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 4,
    coverImage: siteMedia.emiratesCity,
    gallery: [siteMedia.emiratesCity, siteMedia.jaguarCityCommunity, siteMedia.jaguarCityCover],
    seoTitle: "Emirates City | 100 Acres Beside Jaguar City",
    seoDescription:
      "Explore Emirates City, a 100-acre four-block project with flexible 18 to 36 month payment plans at Doddaballapura Town, Bangalore North."
  },
  {
    id: "seed-project-jaguar-diamond-city",
    title: "Jaguar Diamond City",
    slug: "jaguar-diamond-city",
    summary:
      "A registration-ready plotted project with direct highway access on the Doddaballapura to Nelamangala route.",
    description:
      "Jaguar Diamond City is designed for buyers seeking ready-for-registration plots in a smaller-format project with strong road connectivity and practical access to the Doddaballapura market.",
    city: "Bengaluru",
    location: "Doddaballapura",
    country: "India",
    priceRange: "Price on request",
    areaSqFt: 1800,
    areaLabel: "10-acre plotted project",
    tags: ["Ready for Registration", "Listing"],
    status: ProjectStatus.LAUNCHING,
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 5,
    coverImage: siteMedia.jaguarCity,
    gallery: [siteMedia.jaguarCity, siteMedia.jaguarCityGrowth, siteMedia.jaguarCityCover],
    seoTitle: "Jaguar Diamond City | Registration Ready Plots",
    seoDescription:
      "Explore Jaguar Diamond City, a registration-ready plotted project at Doddaballapura with strong road connectivity."
  }
];

const seededProjectIdsByTitle = {
  "Emirates City": "seed-project-emirates-city",
  "Jaguar Diamond City": "seed-project-jaguar-diamond-city"
} as const;

async function syncDefaultAdminUser({
  username,
  email,
  passwordHash
}: {
  username: string;
  email: string;
  passwordHash: string;
}) {
  const adminData = {
    username,
    employeeCode: DEFAULT_ADMIN_EMPLOYEE_CODE,
    email,
    passwordHash,
    role: "ADMIN" as const,
    name: "Jaguar Admin",
    department: "Administration",
    defaultWorkType: "OFFICE" as const,
    casualLeaveBalance: 0,
    sickLeaveBalance: 0,
    paidLeaveBalance: 24,
    unpaidLeaveBalance: 0
  };
  const adminUsernames = Array.from(new Set([username, LEGACY_ADMIN_USERNAME]));
  const adminEmails = Array.from(new Set([email, LEGACY_ADMIN_EMAIL]));
  const matchingUsers = await prisma.user.findMany({
    where: {
      OR: [
        { employeeCode: DEFAULT_ADMIN_EMPLOYEE_CODE },
        { username: { in: adminUsernames } },
        { email: { in: adminEmails } }
      ]
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true
    }
  });
  const primaryUser =
    matchingUsers.find((user) => user.username === username) ??
    matchingUsers.find((user) => user.email === email) ??
    matchingUsers[0];

  if (!primaryUser) {
    await prisma.user.create({ data: adminData });
    return;
  }

  const duplicateUserIds = matchingUsers.filter((user) => user.id !== primaryUser.id).map((user) => user.id);

  if (duplicateUserIds.length > 0) {
    await prisma.user.deleteMany({
      where: { id: { in: duplicateUserIds } }
    });
  }

  await prisma.user.update({
    where: { id: primaryUser.id },
    data: adminData
  });
}

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME ?? "jaguaradmin";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@jaguarproperties.in";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Jaguar2023@";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const { id: _demoId, createdAt: _demoCreatedAt, updatedAt: _demoUpdatedAt, ...siteContentSeed } = demoSiteContent;

  await syncDefaultAdminUser({
    username: adminUsername,
    email: adminEmail,
    passwordHash
  });

  await Promise.all(
    (Object.keys(systemRoleDetails) as Array<keyof typeof systemRoleDetails>).map((role) =>
      prisma.role.upsert({
        where: { name: role },
        update: {
          description: systemRoleDetails[role].description,
          ...toLegacyPermissionFlags(defaultRolePermissions[role])
        },
        create: {
          name: role,
          description: systemRoleDetails[role].description,
          ...toLegacyPermissionFlags(defaultRolePermissions[role])
        }
      })
    )
  );

  const existingSiteContent = await prisma.siteContent.findUnique({
    where: { id: "default-site-content" },
    select: { id: true }
  });

  if (existingSiteContent) {
    console.log("Site content already exists; keeping the current backend record.");
  } else {
    await prisma.siteContent.create({
      data: {
        ...siteContentSeed,
        id: "default-site-content"
      }
    });
  }

  await prisma.project.deleteMany({
    where: {
      id: {
        notIn: projectSeedData.map((project) => project.id)
      }
    }
  });

  await Promise.all(
    projectSeedData.map((project) =>
      prisma.project.upsert({
        where: { id: project.id },
        update: project,
        create: project
      })
    )
  );

  await prisma.property.deleteMany({
    where: {
      slug: {
        in: ["jaguar-city-premium-plots", "jaguar-city-investment-plots"]
      }
    }
  });

  await Promise.all(
    propertyShowcase.map((entry, index) =>
      prisma.property.upsert({
        where: { slug: entry.slug },
        update: {
          title: entry.title,
          description: entry.description,
          city: entry.city,
          location: entry.location,
          address: entry.address,
          price: entry.price,
          bedrooms: null,
          bathrooms: null,
          areaSqFt: entry.areaSqFt,
          status: PropertyStatus.AVAILABLE,
          featured: index < 3,
          coverImage: entry.image,
          gallery: entry.gallery,
          projectId:
            seededProjectIdsByTitle[entry.title as keyof typeof seededProjectIdsByTitle] ??
            "seed-project-jaguar-city"
        },
        create: {
          title: entry.title,
          slug: entry.slug,
          description: entry.description,
          city: entry.city,
          location: entry.location,
          address: entry.address,
          price: entry.price,
          bedrooms: null,
          bathrooms: null,
          areaSqFt: entry.areaSqFt,
          status: PropertyStatus.AVAILABLE,
          featured: index < 3,
          coverImage: entry.image,
          gallery: entry.gallery,
          projectId:
            seededProjectIdsByTitle[entry.title as keyof typeof seededProjectIdsByTitle] ??
            "seed-project-jaguar-city"
        }
      })
    )
  );

  await prisma.blogPost.upsert({
    where: { id: "seed-post-jaguar-city-growth-drivers" },
    update: {
      title: "Why Jaguar City Sits in One of North Bengaluru's Strongest Growth Corridors",
      slug: "jaguar-city-growth-corridor",
      excerpt:
        "From KWIN City to the airport-led industrial belt, Jaguar City is positioned close to major catalysts shaping Doddaballapura's future.",
      content:
        "The Jaguar City brochure highlights several regional growth drivers around Doddaballapura and Devanahalli. These include KWIN City, a planned 5,800-acre knowledge and innovation district; the Information Technology Investment Region spanning 12,000 acres; and the Foxconn manufacturing investment in the wider zone. Together, they strengthen the long-term case for plotted developments positioned near North Bengaluru's evolving infrastructure spine.",
      coverImage: siteMedia.jaguarCityGrowth,
      seoTitle: "Jaguar City Growth Corridor",
      seoDescription:
        "A look at KWIN City, ITIR, Foxconn, and the broader North Bengaluru momentum around Jaguar City.",
      published: true
    },
    create: {
      id: "seed-post-jaguar-city-growth-drivers",
      title: "Why Jaguar City Sits in One of North Bengaluru's Strongest Growth Corridors",
      slug: "jaguar-city-growth-corridor",
      excerpt:
        "From KWIN City to the airport-led industrial belt, Jaguar City is positioned close to major catalysts shaping Doddaballapura's future.",
      content:
        "The Jaguar City brochure highlights several regional growth drivers around Doddaballapura and Devanahalli. These include KWIN City, a planned 5,800-acre knowledge and innovation district; the Information Technology Investment Region spanning 12,000 acres; and the Foxconn manufacturing investment in the wider zone. Together, they strengthen the long-term case for plotted developments positioned near North Bengaluru's evolving infrastructure spine.",
      coverImage: siteMedia.jaguarCityGrowth,
      seoTitle: "Jaguar City Growth Corridor",
      seoDescription:
        "A look at KWIN City, ITIR, Foxconn, and the broader North Bengaluru momentum around Jaguar City.",
      published: true
    }
  });

  await prisma.blogPost.upsert({
    where: { id: "seed-post-kiadb-doddaballapura" },
    update: {
      title: "KIADB and Doddaballapura's Industrial Expansion Add Weight to Jaguar City's Positioning",
      slug: "kiadb-doddaballapura-industrial-expansion",
      excerpt:
        "The brochure points to KIADB's industrial area and Science City pipeline as important context for buyers tracking future demand in the region.",
      content:
        "According to the Jaguar City presentation, the KIADB Doddaballapur Industrial Area extends across more than 900 acres in multiple phases near Kempegowda International Airport. The region already supports industrial activity, textile parks, and the upcoming Science City. For plotted buyers, that broader employment and infrastructure ecosystem can be an important long-term demand signal.",
      coverImage: siteMedia.jaguarCityCommunity,
      seoTitle: "KIADB Doddaballapura and Jaguar City",
      seoDescription:
        "How the KIADB industrial area and surrounding infrastructure strengthen the Doddaballapura case."
    },
    create: {
      id: "seed-post-kiadb-doddaballapura",
      title: "KIADB and Doddaballapura's Industrial Expansion Add Weight to Jaguar City's Positioning",
      slug: "kiadb-doddaballapura-industrial-expansion",
      excerpt:
        "The brochure points to KIADB's industrial area and Science City pipeline as important context for buyers tracking future demand in the region.",
      content:
        "According to the Jaguar City presentation, the KIADB Doddaballapur Industrial Area extends across more than 900 acres in multiple phases near Kempegowda International Airport. The region already supports industrial activity, textile parks, and the upcoming Science City. For plotted buyers, that broader employment and infrastructure ecosystem can be an important long-term demand signal.",
      coverImage: siteMedia.jaguarCityCommunity,
      seoTitle: "KIADB Doddaballapura and Jaguar City",
      seoDescription:
        "How the KIADB industrial area and surrounding infrastructure strengthen the Doddaballapura case.",
      published: true
    }
  });

  await prisma.blogPost.upsert({
    where: { id: "seed-post-jaguar-city-amenities" },
    update: {
      title: "Jaguar City Brings Township-Style Amenities Into a Plotted Development Format",
      slug: "jaguar-city-township-amenities",
      excerpt:
        "The brochure highlights amenities such as a clubhouse, tennis court, children's play area, basketball, park and jogging space, and Jaguar International School.",
      content:
        "Jaguar City's presentation positions the township as more than a plotted layout. It calls out lifestyle and family infrastructure including a clubhouse, tennis court, children's play area, basketball court, park and jogging area, and Jaguar International School. That amenity-led positioning supports both everyday livability and long-term value perception.",
      coverImage: siteMedia.jaguarCityCover,
      seoTitle: "Jaguar City Amenities Overview",
      seoDescription:
        "A summary of the township amenities highlighted in the Jaguar City brochure.",
      published: true
    },
    create: {
      id: "seed-post-jaguar-city-amenities",
      title: "Jaguar City Brings Township-Style Amenities Into a Plotted Development Format",
      slug: "jaguar-city-township-amenities",
      excerpt:
        "The brochure highlights amenities such as a clubhouse, tennis court, children's play area, basketball, park and jogging space, and Jaguar International School.",
      content:
        "Jaguar City's presentation positions the township as more than a plotted layout. It calls out lifestyle and family infrastructure including a clubhouse, tennis court, children's play area, basketball court, park and jogging area, and Jaguar International School. That amenity-led positioning supports both everyday livability and long-term value perception.",
      coverImage: siteMedia.jaguarCityCover,
      seoTitle: "Jaguar City Amenities Overview",
      seoDescription:
        "A summary of the township amenities highlighted in the Jaguar City brochure.",
      published: true
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
