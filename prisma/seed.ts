import { PrismaClient, ProjectStatus, PropertyStatus } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { demoSiteContent } from "@/lib/demo-data";
import { defaultRolePermissions, systemRoleDetails, toLegacyPermissionFlags } from "@/lib/permissions";
import { propertyShowcase } from "@/lib/property-showcase";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const DEFAULT_ADMIN_EMPLOYEE_CODE = "JP2026A0001";
const LEGACY_ADMIN_USERNAME = "jaguarproperties2023";
const LEGACY_ADMIN_EMAIL = "admin@jaguarproperties.in";

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
    await prisma.siteContent.update({
      where: { id: "default-site-content" },
      data: siteContentSeed
    });
  } else {
    await prisma.siteContent.create({
      data: {
        ...siteContentSeed,
        id: "default-site-content"
      }
    });
  }

  const project = await prisma.project.upsert({
    where: { id: "seed-project-jaguar-city" },
    update: {
      title: "Jaguar City",
      slug: "jaguar-city",
      summary:
        "A landmark integrated township in Doddaballapura with premium plots, modern infrastructure, and community-first amenities.",
      description:
        "Jaguar City is a 190-hectare integrated township by Jaguar Properties in Doddaballapura, North Bengaluru. Positioned near the existing and upcoming international airport corridor, the project is designed for families and investors seeking plotted development, smart infrastructure, and long-term value in a fast-growing region.",
      city: "Bengaluru",
      location: "Doddaballapura",
      country: "India",
      priceRange: "Price on request",
      status: ProjectStatus.LAUNCHING,
      featured: true,
      coverImage: "/images/projects/jaguar-city-cover.png",
      gallery: [
        "/images/projects/jaguar-city-cover.png",
        "/images/projects/jaguar-city-community.jpeg",
        "/images/projects/jaguar-city-growth.jpeg"
      ],
      seoTitle: "Jaguar City | Integrated Township in Doddaballapura",
      seoDescription:
        "Explore Jaguar City, a 190-hectare integrated plotted township in North Bengaluru."
    },
    create: {
      id: "seed-project-jaguar-city",
      title: "Jaguar City",
      slug: "jaguar-city",
      summary:
        "A landmark integrated township in Doddaballapura with premium plots, modern infrastructure, and community-first amenities.",
      description:
        "Jaguar City is a 190-hectare integrated township by Jaguar Properties in Doddaballapura, North Bengaluru. Positioned near the existing and upcoming international airport corridor, the project is designed for families and investors seeking plotted development, smart infrastructure, and long-term value in a fast-growing region.",
      city: "Bengaluru",
      location: "Doddaballapura",
      country: "India",
      priceRange: "Price on request",
      status: ProjectStatus.LAUNCHING,
      featured: true,
      coverImage: "/images/projects/jaguar-city-cover.png",
      gallery: [
        "/images/projects/jaguar-city-cover.png",
        "/images/projects/jaguar-city-community.jpeg",
        "/images/projects/jaguar-city-growth.jpeg"
      ],
      seoTitle: "Jaguar City | Integrated Township in Doddaballapura",
      seoDescription:
        "Explore Jaguar City, a 190-hectare integrated plotted township in North Bengaluru."
    }
  });

  await prisma.property.deleteMany({
    where: {
      slug: {
        in: ["jaguar-city-premium-plots", "jaguar-city-investment-plots"]
      }
    }
  });

  await prisma.property.upsert({
    where: { id: "seed-property-jaguar-greens" },
    update: {
      title: propertyShowcase[0].title,
      slug: propertyShowcase[0].slug,
      description: propertyShowcase[0].description,
      city: propertyShowcase[0].city,
      location: propertyShowcase[0].location,
      address: propertyShowcase[0].address,
      price: propertyShowcase[0].price,
      bedrooms: null,
      bathrooms: null,
      areaSqFt: propertyShowcase[0].areaSqFt,
      status: PropertyStatus.AVAILABLE,
      featured: true,
      coverImage: propertyShowcase[0].image,
      gallery: propertyShowcase[0].gallery,
      projectId: project.id
    },
    create: {
      id: "seed-property-jaguar-greens",
      title: propertyShowcase[0].title,
      slug: propertyShowcase[0].slug,
      description: propertyShowcase[0].description,
      city: propertyShowcase[0].city,
      location: propertyShowcase[0].location,
      address: propertyShowcase[0].address,
      price: propertyShowcase[0].price,
      bedrooms: null,
      bathrooms: null,
      areaSqFt: propertyShowcase[0].areaSqFt,
      status: PropertyStatus.AVAILABLE,
      featured: true,
      coverImage: propertyShowcase[0].image,
      gallery: propertyShowcase[0].gallery,
      projectId: project.id
    }
  });

  await prisma.property.upsert({
    where: { id: "seed-property-jaguar-horizon" },
    update: {
      title: propertyShowcase[1].title,
      slug: propertyShowcase[1].slug,
      description: propertyShowcase[1].description,
      city: propertyShowcase[1].city,
      location: propertyShowcase[1].location,
      address: propertyShowcase[1].address,
      price: propertyShowcase[1].price,
      bedrooms: null,
      bathrooms: null,
      areaSqFt: propertyShowcase[1].areaSqFt,
      status: PropertyStatus.AVAILABLE,
      featured: true,
      coverImage: propertyShowcase[1].image,
      gallery: propertyShowcase[1].gallery,
      projectId: project.id
    },
    create: {
      id: "seed-property-jaguar-horizon",
      title: propertyShowcase[1].title,
      slug: propertyShowcase[1].slug,
      description: propertyShowcase[1].description,
      city: propertyShowcase[1].city,
      location: propertyShowcase[1].location,
      address: propertyShowcase[1].address,
      price: propertyShowcase[1].price,
      bedrooms: null,
      bathrooms: null,
      areaSqFt: propertyShowcase[1].areaSqFt,
      status: PropertyStatus.AVAILABLE,
      featured: true,
      coverImage: propertyShowcase[1].image,
      gallery: propertyShowcase[1].gallery,
      projectId: project.id
    }
  });

  await prisma.property.upsert({
    where: { id: "seed-property-jaguar-urban-reserve" },
    update: {
      title: propertyShowcase[2].title,
      slug: propertyShowcase[2].slug,
      description: propertyShowcase[2].description,
      city: propertyShowcase[2].city,
      location: propertyShowcase[2].location,
      address: propertyShowcase[2].address,
      price: propertyShowcase[2].price,
      bedrooms: null,
      bathrooms: null,
      areaSqFt: propertyShowcase[2].areaSqFt,
      status: PropertyStatus.AVAILABLE,
      featured: true,
      coverImage: propertyShowcase[2].image,
      gallery: propertyShowcase[2].gallery,
      projectId: project.id
    },
    create: {
      id: "seed-property-jaguar-urban-reserve",
      title: propertyShowcase[2].title,
      slug: propertyShowcase[2].slug,
      description: propertyShowcase[2].description,
      city: propertyShowcase[2].city,
      location: propertyShowcase[2].location,
      address: propertyShowcase[2].address,
      price: propertyShowcase[2].price,
      bedrooms: null,
      bathrooms: null,
      areaSqFt: propertyShowcase[2].areaSqFt,
      status: PropertyStatus.AVAILABLE,
      featured: true,
      coverImage: propertyShowcase[2].image,
      gallery: propertyShowcase[2].gallery,
      projectId: project.id
    }
  });

  await prisma.blogPost.upsert({
    where: { id: "seed-post-jaguar-city-growth-drivers" },
    update: {
      title: "Why Jaguar City Sits in One of North Bengaluru's Strongest Growth Corridors",
      slug: "jaguar-city-growth-corridor",
      excerpt:
        "From KWIN City to the airport-led industrial belt, Jaguar City is positioned close to major catalysts shaping Doddaballapura's future.",
      content:
        "The Jaguar City brochure highlights several regional growth drivers around Doddaballapura and Devanahalli. These include KWIN City, a planned 5,800-acre knowledge and innovation district; the Information Technology Investment Region spanning 12,000 acres; and the Foxconn manufacturing investment in the wider zone. Together, they strengthen the long-term case for plotted developments positioned near North Bengaluru's evolving infrastructure spine.",
      coverImage: "/images/projects/jaguar-city-growth.jpeg",
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
      coverImage: "/images/projects/jaguar-city-growth.jpeg",
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
      coverImage: "/images/projects/jaguar-city-community.jpeg",
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
      coverImage: "/images/projects/jaguar-city-community.jpeg",
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
      coverImage: "/images/projects/jaguar-city-cover.png",
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
      coverImage: "/images/projects/jaguar-city-cover.png",
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
