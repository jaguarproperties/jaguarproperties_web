import { PrismaClient, ProjectStatus, PropertyStatus } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { demoSiteContent } from "@/lib/demo-data";
import { defaultRolePermissions, systemRoleDetails, toLegacyPermissionFlags } from "@/lib/permissions";
import { propertyShowcase } from "@/lib/property-showcase";
import { siteMedia } from "@/lib/site-media";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const DEFAULT_SUPER_ADMIN_EMPLOYEE_CODE = "JP2026SA0001";
const DEFAULT_HR_EMPLOYEE_CODE = "JP2026H0001";
const DEFAULT_EMPLOYEE_EMPLOYEE_CODE = "JP2026E0001";
const LEGACY_ADMIN_USERNAME = "jaguarproperties2023";
const LEGACY_ADMIN_EMAIL = "admin@jaguarproperties.in";
const projectSeedData = [
  {
    id: "seed-project-jaguar-city",
    title: "Jaguar City",
    slug: "jaguar-city",
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
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 1,
    coverImage: siteMedia.jaguarCityCover,
    gallery: [siteMedia.jaguarCity, siteMedia.jaguarCityCommunity, siteMedia.jaguarCityGrowth],
    seoTitle: "Jaguar City | Premium Plotted Development",
    seoDescription:
      "Explore Jaguar City, a premium plotted development on NH-648 at Doddaballapura Town, Bangalore North."
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
    featured: false,
    visible: false,
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
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 3,
    coverImage: "/uploads/site-media/green-hills.jpeg",
    gallery: [siteMedia.jaguarCityGrowth, siteMedia.jaguarCityCommunity, siteMedia.jaguarCityCover],
    seoTitle: "Green Hills | Premium Villa Plots Near Bengaluru",
    seoDescription:
      "Explore Green Hills, a peaceful villa plot community with DTCP approved layout planning, E-Khata, and completed DC conversion."
  },
  {
    id: "seed-project-emirates-city",
    title: "Emirates City",
    slug: "emirates-city",
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
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 4,
    coverImage: "/uploads/site-media/emirates-city-main.png",
    gallery: [siteMedia.emiratesCity, siteMedia.jaguarCityCommunity, siteMedia.jaguarCityCover],
    seoTitle: "Emirates City | Integrated Township",
    seoDescription:
      "Explore Emirates City, an integrated township beside Jaguar City with flexible 18 to 36 month payment plans."
  },
  {
    id: "seed-project-jaguar-diamond-city",
    title: "Jaguar Diamond City",
    slug: "jaguar-diamond-city",
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
    completionDate: null,
    featured: true,
    visible: true,
    sortOrder: 5,
    coverImage: "/uploads/site-media/jaguar-diamond-city-main.png",
    gallery: [siteMedia.jaguarCity, siteMedia.jaguarCityGrowth, siteMedia.jaguarCityCover],
    seoTitle: "Jaguar Diamond City | Premium Plotted Project",
    seoDescription:
      "Explore Jaguar Diamond City, a premium plotted project on SH-74 with excellent highway connectivity."
  }
];

const seededProjectIdsByTitle = {
  "Emirates City": "seed-project-emirates-city",
  "Jaguar Diamond City": "seed-project-jaguar-diamond-city"
} as const;

async function syncSeedUser({
  username,
  email,
  employeeCode,
  passwordHash,
  role,
  name,
  department
}: {
  username: string;
  email: string;
  employeeCode: string;
  passwordHash: string;
  role: "SUPER_ADMIN" | "HR" | "EMPLOYEE";
  name: string;
  department: string;
}) {
  const userData = {
    username,
    employeeCode,
    email,
    passwordHash,
    role,
    name,
    department,
    defaultWorkType: "OFFICE" as const,
    casualLeaveBalance: 0,
    sickLeaveBalance: 0,
    paidLeaveBalance: role === "EMPLOYEE" ? 12 : 24,
    unpaidLeaveBalance: 0
  };
  const usernames = Array.from(
    new Set(role === "SUPER_ADMIN" ? [username, LEGACY_ADMIN_USERNAME] : [username])
  );
  const emails = Array.from(
    new Set(role === "SUPER_ADMIN" ? [email, LEGACY_ADMIN_EMAIL] : [email])
  );
  const matchingUsers = await prisma.user.findMany({
    where: {
      OR: [
        { employeeCode },
        { username: { in: usernames } },
        { email: { in: emails } }
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
    await prisma.user.create({ data: userData });
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
    data: userData
  });
}

async function main() {
  const superAdminUsername = process.env.SUPER_ADMIN_USERNAME ?? process.env.ADMIN_USERNAME ?? "jaguaradmin";
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? "admin@jaguarproperties.in";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "Jaguar2023@";
  const hrUsername = process.env.HR_USERNAME ?? "hrjaguar";
  const hrEmail = process.env.HR_EMAIL ?? "hr@jaguarproperties.in";
  const hrPassword = process.env.HR_PASSWORD ?? "Jaguar2023@";
  const employeeUsername = process.env.EMPLOYEE_USERNAME ?? "shantosh";
  const employeeEmail = process.env.EMPLOYEE_EMAIL ?? "shantosh@jaguarproperties.in";
  const employeePassword = process.env.EMPLOYEE_PASSWORD ?? "Shantosh2023@";
  const { id: _demoId, createdAt: _demoCreatedAt, updatedAt: _demoUpdatedAt, ...siteContentSeed } = demoSiteContent;

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

  await syncSeedUser({
    username: superAdminUsername,
    email: superAdminEmail,
    employeeCode: DEFAULT_SUPER_ADMIN_EMPLOYEE_CODE,
    passwordHash: await bcrypt.hash(superAdminPassword, 10),
    role: "SUPER_ADMIN",
    name: "Jaguar Super Admin",
    department: "Administration"
  });

  await syncSeedUser({
    username: hrUsername,
    email: hrEmail,
    employeeCode: DEFAULT_HR_EMPLOYEE_CODE,
    passwordHash: await bcrypt.hash(hrPassword, 10),
    role: "HR",
    name: "Jaguar HR",
    department: "Human Resources"
  });

  await syncSeedUser({
    username: employeeUsername,
    email: employeeEmail,
    employeeCode: DEFAULT_EMPLOYEE_EMPLOYEE_CODE,
    passwordHash: await bcrypt.hash(employeePassword, 10),
    role: "EMPLOYEE",
    name: "Shantosh",
    department: "Operations"
  });

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
