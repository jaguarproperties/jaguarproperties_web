import { z } from "zod";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const imageSourceSchema = z
  .string()
  .trim()
  .min(1, "Image is required.")
  .refine((value) => value.startsWith("/") || isValidUrl(value), {
    message: "Use a public image path like /images/file.jpg or a full image URL."
  });

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  message: z.string().min(10),
  city: z.string().optional(),
  inquiryType: z.string().optional()
});

export const careerApplicationSchema = z.object({
  role: z.string().min(2),
  fullName: z.string().min(2),
  email: z.string().email(),
  location: z.string().min(2),
  phone: z.string().min(8),
  joinDate: z.string().min(1)
});

export const userManagementSchema = z.object({
  username: z.string().trim().min(3),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(20),
  password: z.string().min(8),
  name: z.string().trim().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "HR", "MANAGER", "EMPLOYEE", "DEVELOPER", "DIGITAL"]),
  department: z.string().trim().min(2),
  reportingManagerId: z.string().trim().optional(),
  leaveBalance: z.coerce.number().min(0).max(365).default(12)
});

export const userUpdateSchema = z.object({
  id: z.string().min(1),
  username: z.string().trim().min(3),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(20),
  password: z.union([z.string().trim().min(8), z.literal("")]).optional(),
  name: z.string().trim().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "HR", "MANAGER", "EMPLOYEE", "DEVELOPER", "DIGITAL"]),
  department: z.string().trim().min(2),
  reportingManagerId: z.string().trim().optional(),
  leaveBalance: z.coerce.number().min(0).max(365).default(12)
});

export const roleProfileSchema = z.object({
  roleName: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[A-Za-z][A-Za-z0-9 _-]*$/, "Use letters, numbers, spaces, hyphens, or underscores only."),
  label: z.string().trim().min(2).max(60),
  description: z.string().trim().min(5).max(220).optional()
});

export const attendanceMarkSchema = z.object({
  action: z.enum(["check-in", "check-out"]),
  workType: z.enum(["OFFICE", "WFH"]).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().trim().max(300).optional()
});

export const attendanceEditSchema = z.object({
  employeeId: z.string().min(1),
  date: z.string().min(1),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  workType: z.enum(["OFFICE", "WFH"]).optional(),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HALF_DAY"]),
  notes: z.string().trim().max(500).optional()
});

export const leaveApplicationSchema = z
  .object({
    leaveType: z.enum(["CASUAL", "SICK", "PAID", "UNPAID", "OTHER"]),
    leaveDuration: z.enum(["FULL_DAY", "FIRST_HALF", "SECOND_HALF"]),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    reason: z.string().trim().min(5).max(1000)
  })
  .refine((value) => new Date(value.endDate).getTime() >= new Date(value.startDate).getTime(), {
    message: "End date must be on or after the start date.",
    path: ["endDate"]
  })
  .refine(
    (value) =>
      value.leaveDuration === "FULL_DAY" ||
      new Date(value.startDate).toDateString() === new Date(value.endDate).toDateString(),
    {
      message: "First-half and second-half leave can only be applied for a single date.",
      path: ["endDate"]
    }
  )
  .refine(
    (value) =>
      value.leaveDuration !== "FIRST_HALF" ||
      value.leaveType !== "SICK" ||
      Boolean(value.reason.trim()),
    {
      message: "Please include a reason for half-day leave.",
      path: ["reason"]
  });

export const leaveDecisionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  remarks: z.string().trim().max(500).optional()
});

export const leaveBalanceSchema = z.object({
  employeeId: z.string().min(1),
  leaveBalance: z.coerce.number().min(0).max(365),
  note: z.string().trim().max(300).optional()
});

export const jobPostingSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3),
  department: z.string().trim().min(2),
  location: z.string().trim().min(2),
  description: z.string().trim().min(10),
  requirements: z.string().trim().min(5),
  openings: z.coerce.number().int().min(1).default(1),
  qualification: z.string().trim().optional(),
  experience: z.string().trim().optional(),
  salary: z.string().trim().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  postedAt: z.string().optional(),
  isActive: z.boolean().default(true)
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  summary: z.string().min(10),
  description: z.string().min(20),
  city: z.string().min(2),
  location: z.string().min(2),
  country: z.string().min(2),
  priceRange: z.string().min(2),
  status: z.enum(["UPCOMING", "LAUNCHING", "COMPLETED"]),
  completionDate: z.string().optional(),
  featured: z.boolean().default(false),
  coverImage: imageSourceSchema,
  gallery: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const propertySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string().min(20),
  city: z.string().min(2),
  location: z.string().min(2),
  address: z.string().min(5),
  price: z.string().min(2),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  areaSqFt: z.coerce.number().optional(),
  status: z.enum(["AVAILABLE", "SOLD", "HOLD"]),
  featured: z.boolean().default(false),
  coverImage: imageSourceSchema,
  gallery: z.string().optional(),
  projectId: z.string().optional()
});

export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  excerpt: z.string().min(10),
  content: z.string().min(30),
  coverImage: imageSourceSchema,
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  published: z.boolean().default(true)
});

export const siteContentSchema = z.object({
  id: z.string().optional(),
  heroTitle: z.string().min(5),
  heroSubtitle: z.string().min(10),
  heroImage: imageSourceSchema,
  homePrimaryCtaLabel: z.string().min(2),
  homePrimaryCtaHref: z.string().min(1),
  homeSecondaryCtaLabel: z.string().min(2),
  homeSecondaryCtaHref: z.string().min(1),
  homePresenceLocations: z.string().min(5),
  homeSignatureText: z.string().min(10),
  homeSpotlightLabel: z.string().min(2),
  homeSpotlightTitle: z.string().min(5),
  homeSpotlightText: z.string().min(10),
  homeSpotlightPrice: z.string().min(2),
  homeStats: z.string().min(10),
  aboutTitle: z.string().min(5),
  aboutBody: z.string().min(20),
  mission: z.string().min(10),
  vision: z.string().min(10),
  presenceText: z.string().min(10),
  homeFeaturedPropertiesTitle: z.string().min(5),
  homeFeaturedPropertiesDescription: z.string().min(10),
  homePortfolioTitle: z.string().min(5),
  homePortfolioDescription: z.string().min(10),
  homePortfolioItems: z.string().min(10),
  homeNewsTitle: z.string().min(5),
  homeNewsDescription: z.string().min(10),
  homeConciergeTitle: z.string().min(5),
  homeConciergeButtonLabel: z.string().min(2),
  homeConciergeButtonHref: z.string().min(1),
  propertiesTitle: z.string().min(5),
  propertiesDescription: z.string().min(10),
  propertiesHighlights: z.string().min(10),
  newsTitle: z.string().min(5),
  newsDescription: z.string().min(10),
  newsHighlights: z.string().min(10),
  portfolioTitle: z.string().min(5),
  portfolioDescription: z.string().min(10),
  portfolioGallery: z.string().min(10),
  contactTitle: z.string().min(5),
  contactDescription: z.string().min(10),
  contactSupportPoints: z.string().min(10),
  careersTitle: z.string().min(5),
  careersDescription: z.string().min(10),
  careersCulturePoints: z.string().min(10),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(8),
  officeAddress: z.string().min(5),
  mapEmbedUrl: z.string().url(),
  footerBlurb: z.string().min(10),
  footerCopyright: z.string().min(10),
  footerNote: z.string().min(10),
  instagramUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  facebookUrl: z.string().url(),
  twitterUrl: z.string().url(),
  youtubeUrl: z.string().url()
});
