"use server";

import { mkdir, writeFile } from "fs/promises";
import { MediaEntityType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";

import { auth } from "@/lib/auth";
import { getCareerBySlug } from "@/lib/careers";
import { replaceHolidayCalendar } from "@/lib/holidays";
import { getMongoDb } from "@/lib/mongo";
import { prisma } from "@/lib/prisma";
import { slugify, safeSplitGallery } from "@/lib/utils";
import {
  canAccessLeads,
  canEditContent,
  canEditProjects,
  canEditProperties,
  canManageJobPostings,
  canManageNews,
  canManageRoles,
  canManageUsers,
  canUploadHolidayCalendar,
  canViewApplications,
  getRoleLabel,
  isSystemRoleName,
  normalizeAdminRoleName,
  permissionList,
  toLegacyPermissionFlags,
  type Permission
} from "@/lib/permissions";
import {
  blogSchema,
  careerApplicationSchema,
  jobPostingSchema,
  leadSchema,
  projectSchema,
  roleProfileSchema,
  propertySchema,
  siteContentSchema,
  userManagementSchema,
  userUpdateSchema
} from "@/lib/validations";

async function requireRoleAccess(check: (role: UserRole) => boolean | Promise<boolean>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const allowed = await check(session.user.role as UserRole);

  if (!allowed) {
    redirect("/admin");
  }

  return session;
}

async function requireJobPostingManager() {
  return requireRoleAccess(canManageJobPostings);
}

function ensureDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. Add your MongoDB Atlas connection string to use live admin mutations.");
  }
}

async function requireHrmWorkspaceManager() {
  return requireRoleAccess((role) => role === "HR" || role === "ADMIN" || role === "SUPER_ADMIN");
}

function revalidatePublicSiteContent() {
  const publicPaths = ["/", "/contact", "/portfolio", "/news", "/properties", "/careers"];

  for (const publicPath of publicPaths) {
    revalidatePath(publicPath);
  }

  revalidatePath("/", "layout");
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function parsePermissionSelection(formData: FormData): Permission[] {
  return permissionList.filter((permission) => parseBoolean(formData.get(permission)));
}

async function generateEmployeeCode(sourceText: string) {
  const year = new Date().getFullYear();
  const alpha = sourceText.trim().charAt(0).toUpperCase() || "A";
  const prefix = `JP${year}${alpha}`;

  const existingCodes = await prisma.user.findMany({
    where: {
      employeeCode: {
        startsWith: prefix
      }
    },
    select: {
      employeeCode: true
    },
    orderBy: {
      employeeCode: "desc"
    }
  });

  const lastSequence = existingCodes.reduce((max, entry) => {
    const match = entry.employeeCode.match(/(\d{4})$/);
    if (!match) return max;
    return Math.max(max, Number.parseInt(match[1], 10));
  }, 0);

  return `${prefix}${String(lastSequence + 1).padStart(4, "0")}`;
}

function getResumeStorageDir() {
  return path.join(process.cwd(), "storage", "resumes");
}

function getHrmLetterheadStorageDir() {
  return path.join(process.cwd(), "public", "uploads", "hrm-letterheads");
}

function getPropertyImageStorageDir() {
  return path.join(process.cwd(), "public", "uploads", "properties");
}

function getNewsImageStorageDir() {
  return path.join(process.cwd(), "public", "uploads", "news");
}

function isAllowedResumeType(file: File) {
  return [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ].includes(file.type);
}

function isAllowedLetterheadType(file: File) {
  return ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"].includes(file.type);
}

function isAllowedPropertyImageType(file: File) {
  return ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"].includes(file.type);
}

function sanitizeFilenameSegment(value: string) {
  const trimmed = value.trim().toLowerCase();
  const sanitized = trimmed.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || "property-image";
}

async function savePropertyImage(file: File, propertyTitle: string) {
  if (!isAllowedPropertyImageType(file)) {
    throw new Error("Please upload JPG, PNG, WebP, or GIF images for properties.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Property images must be smaller than 8 MB each.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name) || ".jpg";
  const storageDir = getPropertyImageStorageDir();
  const filename = `${sanitizeFilenameSegment(propertyTitle)}-${randomUUID()}${extension.toLowerCase()}`;

  await mkdir(storageDir, { recursive: true });
  await writeFile(path.join(storageDir, filename), buffer);

  return `/uploads/properties/${filename}`;
}

async function saveNewsImage(file: File, articleTitle: string) {
  if (!isAllowedPropertyImageType(file)) {
    throw new Error("Please upload JPG, PNG, WebP, or GIF images for news articles.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("News article images must be smaller than 8 MB each.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name) || ".jpg";
  const storageDir = getNewsImageStorageDir();
  const filename = `${sanitizeFilenameSegment(articleTitle)}-${randomUUID()}${extension.toLowerCase()}`;

  await mkdir(storageDir, { recursive: true });
  await writeFile(path.join(storageDir, filename), buffer);

  return `/uploads/news/${filename}`;
}

function dedupeImageList(images: string[]) {
  return Array.from(new Set(images.map((image) => image.trim()).filter(Boolean)));
}

async function syncPropertyMedia(propertyId: string, coverImage: string, gallery: string[]) {
  const urls = dedupeImageList([coverImage, ...gallery]);

  await prisma.media.deleteMany({
    where: {
      propertyId
    }
  });

  if (!urls.length) return;

  await Promise.all(
    urls.map((url, index) =>
      prisma.media.create({
        data: {
          url,
          alt: index === 0 ? "Featured property image" : "Property gallery image",
          entityType: MediaEntityType.PROPERTY,
          propertyId
        }
      })
    )
  );
}

async function syncBlogPostMedia(blogPostId: string, coverImage: string, gallery: string[]) {
  const urls = dedupeImageList([coverImage, ...gallery]);

  await prisma.media.deleteMany({
    where: {
      blogPostId
    }
  });

  if (!urls.length) return;

  await Promise.all(
    urls.map((url, index) =>
      prisma.media.create({
        data: {
          url,
          alt: index === 0 ? "Featured news image" : "News gallery image",
          entityType: MediaEntityType.BLOG_POST,
          blogPostId
        }
      })
    )
  );
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass }
  });
}

type ParsedHolidaySheetRow = {
  Date?: string | number | Date;
  Title?: string;
  Description?: string;
};

function parseHolidaySheetDate(value: ParsedHolidaySheetRow["Date"]) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
    }
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

export async function submitLead(
  _prevState: { success: boolean; message: string },
  formData: FormData
) {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    city: formData.get("city") || undefined,
    inquiryType: formData.get("inquiryType") || undefined
  });

  if (!parsed.success) {
    return { success: false, message: "Please complete all required fields correctly." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      success: false,
      message: "Lead capture is in demo mode. Add DATABASE_URL to store inquiries in MongoDB Atlas."
    };
  }

  await prisma.lead.create({ data: parsed.data });
  revalidatePath("/admin");
  revalidatePath("/admin/leads");

  return { success: true, message: "Your inquiry has been sent. Our team will reach out shortly." };
}

export async function submitCareerApplication(
  _prevState: { success: boolean; message: string },
  formData: FormData
) {
  const parsed = careerApplicationSchema.safeParse({
    role: formData.get("role"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    location: formData.get("location"),
    phone: formData.get("phone"),
    joinDate: formData.get("joinDate")
  });

  if (!parsed.success) {
    return { success: false, message: "Please complete all application fields correctly." };
  }

  const resume = formData.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return { success: false, message: "Please upload your resume." };
  }

  if (!isAllowedResumeType(resume)) {
    return { success: false, message: "Please upload a PDF or Word document." };
  }

  if (resume.size > 5 * 1024 * 1024) {
    return { success: false, message: "Please upload a resume smaller than 5 MB." };
  }

  const transporter = getTransporter();
  const job = await getCareerBySlug(slugify(parsed.data.role));
  const bytes = await resume.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = resume.name.split(".").pop() || "pdf";
  const filename = `${randomUUID()}.${extension}`;
  const resumeDir = getResumeStorageDir();
  await mkdir(resumeDir, { recursive: true });
  const filePath = path.join(resumeDir, filename);
  await writeFile(filePath, buffer);
  const resumeUrl = filename;

  if (process.env.DATABASE_URL) {
    await prisma.jobApplication.create({
      data: {
        role: parsed.data.role,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        location: parsed.data.location,
        phone: parsed.data.phone,
        joinDate: new Date(parsed.data.joinDate),
        resumeUrl,
        resumeName: resume.name
      }
    });
  }

  const requirementText = job
    ? job.requirements.map((item: string, index: number) => `${index + 1}. ${item}`).join("\n")
    : "Role details were not found in the current opening list.";

  let message = "Application submitted successfully. Our team will review it shortly.";

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: "amanrajgrow@gmail.com",
      subject: `Applying for ${parsed.data.role}`,
      text: [
        `Role: ${parsed.data.role}`,
        `Candidate Name: ${parsed.data.fullName}`,
        `Email: ${parsed.data.email}`,
        `Location: ${parsed.data.location}`,
        `Phone: ${parsed.data.phone}`,
        `Joining Date: ${parsed.data.joinDate}`,
        "",
        "Job Description:",
        requirementText,
        "",
        `Qualification: ${job?.qualification ?? "N/A"}`,
        `Experience: ${job?.experience ?? "N/A"}`
      ].join("\n"),
      attachments: [
        {
          filename: resume.name,
          content: buffer
        }
      ]
    });
  } else {
    message = "Application submitted successfully. Email delivery is disabled because SMTP is not configured. Add SMTP settings in .env to enable email notifications.";
  }

  revalidatePath("/admin");
  revalidatePath("/admin/applications");

  return {
    success: true,
    message
  };
}

export async function createOrUpdateProject(formData: FormData) {
  await requireRoleAccess(canEditProjects);
  ensureDatabase();
  const parsed = projectSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    city: formData.get("city"),
    location: formData.get("location"),
    country: formData.get("country"),
    priceRange: formData.get("priceRange"),
    status: formData.get("status"),
    completionDate: formData.get("completionDate") || undefined,
    featured: parseBoolean(formData.get("featured")),
    coverImage: formData.get("coverImage"),
    gallery: formData.get("gallery") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined
  });

  if (!parsed.success) throw new Error("Invalid project payload");

  const { id: _projectId, ...projectValues } = parsed.data;

  const data = {
    ...projectValues,
    slug: slugify(parsed.data.title),
    gallery: safeSplitGallery(parsed.data.gallery ?? ""),
    completionDate: parsed.data.completionDate ? new Date(parsed.data.completionDate) : null
  };

  if (parsed.data.id) {
    await prisma.project.update({
      where: { id: parsed.data.id },
      data
    });
  } else {
    await prisma.project.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProject(formData: FormData) {
  await requireRoleAccess(canEditProjects);
  ensureDatabase();
  const id = String(formData.get("id"));
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
}

export async function createOrUpdateProperty(formData: FormData) {
  await requireRoleAccess(canEditProperties);
  ensureDatabase();

  const id = String(formData.get("id") || "").trim() || undefined;
  const title = String(formData.get("title") || "").trim();
  const existingCoverImage = String(formData.get("existingCoverImage") || "").trim();
  const retainedGallery = safeSplitGallery(String(formData.get("existingGallery") || ""));
  const mainImageFile = formData.get("mainImageFile");
  const galleryFiles = formData
    .getAll("galleryFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const coverImage =
    mainImageFile instanceof File && mainImageFile.size > 0
      ? await savePropertyImage(mainImageFile, title || "property")
      : existingCoverImage;

  const uploadedGallery = await Promise.all(
    galleryFiles.map((file, index) => savePropertyImage(file, `${title || "property"}-${index + 1}`))
  );

  const normalizedGallery = dedupeImageList([coverImage, ...retainedGallery, ...uploadedGallery]);

  const parsed = propertySchema.safeParse({
    id,
    title,
    description: formData.get("description"),
    city: formData.get("city"),
    location: formData.get("location"),
    address: formData.get("address"),
    price: formData.get("price"),
    bedrooms: formData.get("bedrooms") || undefined,
    bathrooms: formData.get("bathrooms") || undefined,
    areaSqFt: formData.get("areaSqFt") || undefined,
    status: formData.get("status"),
    featured: parseBoolean(formData.get("featured")),
    coverImage,
    gallery: normalizedGallery.join(", "),
    projectId: formData.get("projectId") || undefined
  });

  if (!parsed.success) throw new Error("Invalid property payload");

  const previousProperty = parsed.data.id
    ? await prisma.property.findUnique({
        where: { id: parsed.data.id },
        select: { id: true, slug: true }
      })
    : null;

  const { id: _propertyFormId, ...propertyValues } = parsed.data;

  const data = {
    ...propertyValues,
    slug: slugify(parsed.data.title),
    gallery: dedupeImageList(safeSplitGallery(parsed.data.gallery ?? "")),
    projectId: parsed.data.projectId || null
  };

  let propertyId = parsed.data.id;

  if (parsed.data.id) {
    await prisma.property.update({
      where: { id: parsed.data.id },
      data
    });
  } else {
    const property = await prisma.property.create({ data });
    propertyId = property.id;
  }

  if (propertyId) {
    await syncPropertyMedia(propertyId, data.coverImage, data.gallery);
  }

  revalidateTag("properties");
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${data.slug}`);
  if (previousProperty?.slug && previousProperty.slug !== data.slug) {
    revalidatePath(`/properties/${previousProperty.slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/properties");

  if (parsed.data.id) {
    redirect(`/admin/properties/${propertyId}?updated=1`);
  }

  redirect("/admin/properties?created=1");
}

export async function deleteProperty(formData: FormData) {
  await requireRoleAccess(canEditProperties);
  ensureDatabase();
  const id = String(formData.get("id"));
  const property = await prisma.property.findUnique({
    where: { id },
    select: { slug: true }
  });
  await prisma.property.delete({ where: { id } });
  revalidateTag("properties");
  revalidatePath("/");
  revalidatePath("/properties");
  if (property?.slug) {
    revalidatePath(`/properties/${property.slug}`);
  }
  revalidatePath("/admin/properties");
}

export async function createOrUpdateBlogPost(formData: FormData) {
  await requireRoleAccess(canManageNews);
  ensureDatabase();

  const id = String(formData.get("id") || "").trim() || undefined;
  const title = String(formData.get("title") || "").trim();
  const existingCoverImage = String(formData.get("existingCoverImage") || "").trim();
  const retainedGallery = safeSplitGallery(String(formData.get("existingGallery") || ""));
  const mainImageFile = formData.get("mainImageFile");
  const galleryFiles = formData
    .getAll("galleryFiles")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const coverImage =
    mainImageFile instanceof File && mainImageFile.size > 0
      ? await saveNewsImage(mainImageFile, title || "news")
      : existingCoverImage;

  const uploadedGallery = await Promise.all(
    galleryFiles.map((file, index) => saveNewsImage(file, `${title || "news"}-${index + 1}`))
  );

  const normalizedGallery = dedupeImageList([coverImage, ...retainedGallery, ...uploadedGallery]);

  const parsed = blogSchema.safeParse({
    id,
    title,
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    published: parseBoolean(formData.get("published"))
  });

  if (!parsed.success) throw new Error("Invalid blog post payload");

  const previousPost = parsed.data.id
    ? await prisma.blogPost.findUnique({
        where: { id: parsed.data.id },
        select: { slug: true }
      })
    : null;

  const { id: _postId, ...postValues } = parsed.data;

  const data = {
    ...postValues,
    slug: slugify(parsed.data.title)
  };

  let postId = parsed.data.id;

  if (parsed.data.id) {
    await prisma.blogPost.update({
      where: { id: parsed.data.id },
      data
    });
  } else {
    const post = await prisma.blogPost.create({ data });
    postId = post.id;
  }

  if (postId) {
    await syncBlogPostMedia(postId, coverImage, normalizedGallery);
  }

  revalidateTag("posts");
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath(`/news/${data.slug}`);
  if (previousPost?.slug && previousPost.slug !== data.slug) {
    revalidatePath(`/news/${previousPost.slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/blog");

  if (parsed.data.id) {
    redirect(`/admin/blog/${postId}?updated=1`);
  }

  redirect("/admin/blog?created=1");
}

export async function deleteBlogPost(formData: FormData) {
  await requireRoleAccess(canManageNews);
  ensureDatabase();
  const id = String(formData.get("id"));
  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true }
  });
  await prisma.blogPost.delete({ where: { id } });
  revalidateTag("posts");
  revalidatePath("/news");
  if (post?.slug) {
    revalidatePath(`/news/${post.slug}`);
  }
  revalidatePath("/admin/blog");
}

export async function createOrUpdateJobPosting(formData: FormData) {
  await requireJobPostingManager();
  ensureDatabase();

  const typeValue = String(formData.get("type") || "FULL_TIME");
  const normalizedType = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].includes(typeValue)
    ? typeValue
    : "FULL_TIME";

  const parsed = jobPostingSchema.safeParse({
    id: String(formData.get("id") || "").trim() || undefined,
    title: String(formData.get("title") || ""),
    department: String(formData.get("department") || ""),
    location: String(formData.get("location") || ""),
    description: String(formData.get("description") || ""),
    requirements: String(formData.get("requirements") || ""),
    openings: String(formData.get("openings") || "1"),
    qualification: String(formData.get("qualification") || "").trim() || undefined,
    experience: String(formData.get("experience") || "").trim() || undefined,
    salary: String(formData.get("salary") || "").trim() || undefined,
    type: normalizedType,
    postedAt: String(formData.get("postedAt") || "").trim() || undefined,
    isActive: parseBoolean(formData.get("isActive") || "true")
  });

  if (!parsed.success) {
    console.error("Invalid job posting payload", parsed.error.flatten().fieldErrors);
    redirect("/admin/jobs?error=invalid-job-posting");
  }

  const data = {
    ...parsed.data,
    postedAt: parsed.data.postedAt ? new Date(parsed.data.postedAt) : new Date(),
    expiresAt: null
  };

  if (parsed.data.id) {
    await prisma.jobPosting.update({
      where: { id: parsed.data.id },
      data
    });
  } else {
    await prisma.jobPosting.create({ data });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
  redirect("/admin/jobs");
}

export async function deleteJobPosting(formData: FormData) {
  await requireJobPostingManager();
  ensureDatabase();
  const id = String(formData.get("id"));
  await prisma.jobPosting.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/careers");
  redirect("/admin/jobs");
}

export async function updateSiteContent(formData: FormData) {
  await requireRoleAccess(canEditContent);
  ensureDatabase();
  const parsed = siteContentSchema.safeParse({
    id: formData.get("id") || undefined,
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
    heroImage: formData.get("heroImage"),
    homePrimaryCtaLabel: formData.get("homePrimaryCtaLabel"),
    homePrimaryCtaHref: formData.get("homePrimaryCtaHref"),
    homeSecondaryCtaLabel: formData.get("homeSecondaryCtaLabel"),
    homeSecondaryCtaHref: formData.get("homeSecondaryCtaHref"),
    homePresenceLocations: formData.get("homePresenceLocations"),
    homeSignatureText: formData.get("homeSignatureText"),
    homeSpotlightLabel: formData.get("homeSpotlightLabel"),
    homeSpotlightTitle: formData.get("homeSpotlightTitle"),
    homeSpotlightText: formData.get("homeSpotlightText"),
    homeSpotlightPrice: formData.get("homeSpotlightPrice"),
    homeStats: formData.get("homeStats"),
    aboutTitle: formData.get("aboutTitle"),
    aboutBody: formData.get("aboutBody"),
    mission: formData.get("mission"),
    vision: formData.get("vision"),
    presenceText: formData.get("presenceText"),
    homeFeaturedPropertiesTitle: formData.get("homeFeaturedPropertiesTitle"),
    homeFeaturedPropertiesDescription: formData.get("homeFeaturedPropertiesDescription"),
    homePortfolioTitle: formData.get("homePortfolioTitle"),
    homePortfolioDescription: formData.get("homePortfolioDescription"),
    homePortfolioItems: formData.get("homePortfolioItems"),
    homeNewsTitle: formData.get("homeNewsTitle"),
    homeNewsDescription: formData.get("homeNewsDescription"),
    homeConciergeTitle: formData.get("homeConciergeTitle"),
    homeConciergeButtonLabel: formData.get("homeConciergeButtonLabel"),
    homeConciergeButtonHref: formData.get("homeConciergeButtonHref"),
    propertiesTitle: formData.get("propertiesTitle"),
    propertiesDescription: formData.get("propertiesDescription"),
    propertiesHighlights: formData.get("propertiesHighlights"),
    newsTitle: formData.get("newsTitle"),
    newsDescription: formData.get("newsDescription"),
    newsHighlights: formData.get("newsHighlights"),
    portfolioTitle: formData.get("portfolioTitle"),
    portfolioDescription: formData.get("portfolioDescription"),
    portfolioGallery: formData.get("portfolioGallery"),
    contactTitle: formData.get("contactTitle"),
    contactDescription: formData.get("contactDescription"),
    contactSupportPoints: formData.get("contactSupportPoints"),
    careersTitle: formData.get("careersTitle"),
    careersDescription: formData.get("careersDescription"),
    careersCulturePoints: formData.get("careersCulturePoints"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    officeAddress: formData.get("officeAddress"),
    mapEmbedUrl: formData.get("mapEmbedUrl"),
    footerBlurb: formData.get("footerBlurb"),
    footerCopyright: formData.get("footerCopyright"),
    footerNote: formData.get("footerNote"),
    instagramUrl: formData.get("instagramUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    facebookUrl: formData.get("facebookUrl"),
    twitterUrl: formData.get("twitterUrl"),
    youtubeUrl: formData.get("youtubeUrl")
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const fieldName = firstIssue?.path?.[0];
    const message = fieldName
      ? `${String(fieldName)}: ${firstIssue.message}`
      : firstIssue?.message ?? "Please review the website content fields and try again.";

    redirect(`/admin/content?error=${encodeURIComponent(message)}`);
  }

  const { id, ...data } = parsed.data;
  const now = new Date();
  const siteContentCollection = (await getMongoDb()).collection("SiteContent") as {
    updateOne: (filter: Record<string, unknown>, update: Record<string, unknown>) => Promise<unknown>;
    insertOne: (document: Record<string, unknown>) => Promise<unknown>;
  };

  if (id) {
    await siteContentCollection.updateOne(
      { _id: id },
      {
        $set: {
          ...data,
          updatedAt: now
        }
      }
    );
  } else {
    await siteContentCollection.insertOne({
      _id: randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now
    });
  }

  revalidatePublicSiteContent();
  revalidatePath("/admin/content");
  redirect("/admin/content?saved=1");
}

export async function exportLeadsCsv() {
  await requireRoleAccess(canAccessLeads);
  ensureDatabase();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  const headers = ["name", "email", "phone", "city", "inquiryType", "status", "message", "createdAt"];
  const rows = leads.map((lead) =>
    [
      lead.name,
      lead.email,
      lead.phone,
      lead.city ?? "",
      lead.inquiryType ?? "",
      lead.status,
      lead.message,
      lead.createdAt.toISOString()
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export async function exportApplicationsCsv() {
  await requireRoleAccess(canViewApplications);
  ensureDatabase();
  const applications = await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } });
  const headers = ["role", "fullName", "email", "location", "phone", "joinDate", "resumeUrl", "resumeName", "createdAt"];
  const rows = applications.map((item) =>
    [
      item.role,
      item.fullName,
      item.email,
      item.location,
      item.phone,
      item.joinDate.toISOString(),
      `/api/applications/${item.id}/resume`,
      item.resumeName,
      item.createdAt.toISOString()
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export async function createUserAccount(formData: FormData) {
  const session = await requireRoleAccess(canManageUsers);
  ensureDatabase();

  const parsed = userManagementSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: String(formData.get("password") || "").trim(),
    name: String(formData.get("name") || "").trim() || undefined,
    role: formData.get("role"),
    department: String(formData.get("department") || ""),
    reportingManagerId: String(formData.get("reportingManagerId") || "").trim() || undefined,
    leaveBalance: String(formData.get("leaveBalance") || "12")
  });

  if (!parsed.success) {
    redirect("/admin/users/create?error=invalid-user");
  }

  if (parsed.data.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/users/create?error=invalid-user");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }]
    },
    select: { id: true }
  });

  if (existingUser) {
    redirect("/admin/users/create?error=duplicate-user");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const employeeCode = await generateEmployeeCode(parsed.data.department || parsed.data.name || parsed.data.role);

  await prisma.user.create({
    data: {
      username: parsed.data.username,
      employeeCode,
      email: parsed.data.email,
      phone: parsed.data.phone,
      name: parsed.data.name,
      role: parsed.data.role,
      department: parsed.data.department,
      reportingManagerId: parsed.data.reportingManagerId || null,
      defaultWorkType: "OFFICE",
      casualLeaveBalance: 0,
      sickLeaveBalance: 0,
      paidLeaveBalance: Math.round(parsed.data.leaveBalance),
      unpaidLeaveBalance: 0,
      passwordHash
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/roles");
  redirect("/admin/users?created=1");
}

export async function deleteUserAccount(formData: FormData) {
  const session = await requireRoleAccess(canManageUsers);
  ensureDatabase();

  const id = String(formData.get("id") || "");

  if (!id || id === session.user.id) {
    redirect("/admin/users?error=invalid-delete");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true }
  });

  if (!user) {
    redirect("/admin/users?error=user-not-found");
  }

  if (user.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/users?error=protected-user");
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/roles");
  redirect("/admin/users?deleted=1");
}

export async function updateUserAccount(formData: FormData) {
  const session = await requireRoleAccess(canManageUsers);
  ensureDatabase();

  const parsed = userUpdateSchema.safeParse({
    id: formData.get("id"),
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: String(formData.get("password") || "").trim() || undefined,
    name: String(formData.get("name") || "").trim() || undefined,
    role: formData.get("role"),
    department: String(formData.get("department") || ""),
    reportingManagerId: String(formData.get("reportingManagerId") || "").trim() || undefined,
    leaveBalance: String(formData.get("leaveBalance") || "12")
  });

  if (!parsed.success) {
    redirect(`/admin/users/${String(formData.get("id") || "")}?error=invalid-user`);
  }

  if (parsed.data.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect(`/admin/users/${parsed.data.id}?error=invalid-user`);
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, role: true }
  });

  if (!user) {
    redirect("/admin/users?error=user-not-found");
  }

  if (user.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect(`/admin/users/${parsed.data.id}?error=protected-user`);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      id: { not: parsed.data.id },
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }]
    },
    select: { id: true }
  });

  if (existingUser) {
    redirect(`/admin/users/${parsed.data.id}?error=duplicate-user`);
  }

  const updateData: {
    username: string;
    email: string;
    phone: string;
    name: string | undefined;
    role: UserRole;
    department: string;
    reportingManagerId: string | null;
    casualLeaveBalance: number;
    sickLeaveBalance: number;
    paidLeaveBalance: number;
    unpaidLeaveBalance: number;
    passwordHash?: string;
  } = {
    username: parsed.data.username,
    email: parsed.data.email,
    phone: parsed.data.phone,
    name: parsed.data.name,
    role: parsed.data.role,
    department: parsed.data.department,
    reportingManagerId: parsed.data.reportingManagerId || null,
    casualLeaveBalance: 0,
    sickLeaveBalance: 0,
    paidLeaveBalance: Math.round(parsed.data.leaveBalance),
    unpaidLeaveBalance: 0
  };

  if (parsed.data.password) {
    updateData.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  }

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: updateData
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/roles");
  revalidatePath(`/admin/users/${parsed.data.id}`);
  redirect("/admin/users?updated=1");
}

export async function updateRolePermissions(formData: FormData) {
  const session = await requireRoleAccess(canManageRoles);
  ensureDatabase();

  const role = normalizeAdminRoleName(String(formData.get("role") || ""));

  if (!role) {
    redirect("/admin/roles?error=invalid-role");
  }

  if (role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/roles?error=protected-role");
  }

  const permissions = parsePermissionSelection(formData);

  await prisma.role.upsert({
    where: { name: role },
    update: {
      description: String(formData.get("description") || "").trim() || undefined,
      permissions,
      ...toLegacyPermissionFlags(permissions)
    },
    create: {
      name: role,
      description: String(formData.get("description") || "").trim() || undefined,
      permissions,
      ...toLegacyPermissionFlags(permissions)
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/roles");
  redirect("/admin/roles?updated=1");
}

export async function createRoleProfile(formData: FormData) {
  await requireRoleAccess(canManageRoles);
  ensureDatabase();

  const parsed = roleProfileSchema.safeParse({
    roleName: formData.get("roleName"),
    label: formData.get("label"),
    description: formData.get("description") || undefined
  });

  if (!parsed.success) {
    redirect("/admin/roles?error=invalid-role");
  }

  const roleName = normalizeAdminRoleName(parsed.data.roleName);

  if (isSystemRoleName(roleName)) {
    redirect("/admin/roles?error=duplicate-role");
  }

  const existingRole = await prisma.role.findUnique({
    where: { name: roleName },
    select: { id: true }
  });

  if (existingRole) {
    redirect("/admin/roles?error=duplicate-role");
  }

  const permissions = parsePermissionSelection(formData);

  await prisma.role.create({
    data: {
      name: roleName,
      description: parsed.data.description?.trim() || `${parsed.data.label.trim()} custom role profile.`,
      permissions,
      ...toLegacyPermissionFlags(permissions)
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/roles");
  redirect(`/admin/roles?created=${encodeURIComponent(getRoleLabel(roleName))}`);
}

export async function uploadHolidayCalendar(formData: FormData) {
  const session = await requireRoleAccess(canUploadHolidayCalendar);
  ensureDatabase();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/attendance-reports?holidayError=missing-file");
  }

  const bytes = await file.arrayBuffer();
  const workbook = XLSX.read(bytes, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    redirect("/admin/attendance-reports?holidayError=empty-sheet");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<ParsedHolidaySheetRow>(worksheet, { defval: "" });

  const parsedRows = rows.map((row, index) => {
    const date = parseHolidaySheetDate(row.Date);
    const title = row.Title?.trim();

    if (!date || !title) {
      return {
        index,
        valid: false as const
      };
    }

    return {
      index,
      valid: true as const,
      value: {
        date,
        title,
        description: row.Description?.trim()
      }
    };
  });

  const invalidRows = parsedRows.filter((row) => !row.valid).map((row) => row.index + 2);

  if (invalidRows.length > 0) {
    redirect(`/admin/attendance-reports?holidayError=${encodeURIComponent(`invalid-rows:${invalidRows.join(",")}`)}`);
  }

  await replaceHolidayCalendar(
    parsedRows.filter((row): row is Extract<(typeof parsedRows)[number], { valid: true }> => row.valid).map((row) => row.value),
    session.user.id
  );

  revalidatePath("/admin");
  revalidatePath("/admin/attendance-reports");
  redirect("/admin/attendance-reports?holidayUploaded=1");
}

export async function uploadHrmLetterhead(formData: FormData) {
  await requireHrmWorkspaceManager();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/hrm?letterheadError=missing-file");
  }

  if (!isAllowedLetterheadType(file)) {
    redirect("/admin/hrm?letterheadError=invalid-file");
  }

  if (file.size > 5 * 1024 * 1024) {
    redirect("/admin/hrm?letterheadError=file-too-large");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const fileName = `current-letterhead.${extension}`;
  const storageDir = getHrmLetterheadStorageDir();
  const filePath = path.join(storageDir, fileName);
  const fileUrl = `/uploads/hrm-letterheads/${fileName}`;
  const bytes = await file.arrayBuffer();

  await mkdir(storageDir, { recursive: true });
  await writeFile(filePath, Buffer.from(bytes));

  if (process.env.DATABASE_URL) {
    const siteContent = await prisma.siteContent.findFirst({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      select: { id: true }
    });

    if (siteContent) {
      const existing = await prisma.media.findFirst({
        where: {
          entityType: "SITE_CONTENT",
          contentId: siteContent.id,
          alt: "HRM_LETTERHEAD_SAMPLE"
        },
        select: { id: true }
      });

      if (existing) {
        await prisma.media.update({
          where: { id: existing.id },
          data: { url: fileUrl }
        });
      } else {
        await prisma.media.create({
          data: {
            url: fileUrl,
            alt: "HRM_LETTERHEAD_SAMPLE",
            entityType: "SITE_CONTENT",
            contentId: siteContent.id
          }
        });
      }
    }
  }

  revalidatePath("/admin/hrm");
  redirect("/admin/hrm?letterheadUpdated=1");
}

export async function changeCurrentUserPassword(formData: FormData) {
  const session = await auth();
  ensureDatabase();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || newPassword.length < 8 || newPassword !== confirmPassword) {
    redirect("/admin/change-password?error=invalid-password");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      passwordHash: true
    }
  });

  if (!user) {
    redirect("/admin/change-password?error=user-not-found");
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    redirect("/admin/change-password?error=invalid-current-password");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash }
  });

  redirect("/admin/change-password?success=1");
}
