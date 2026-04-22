import { UserRole } from "@prisma/client";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const permissionList = [
  "canManageUsers",
  "canManageRoles",
  "canManageCorrections",
  "canEditTheme",
  "canEditContent",
  "canManageImages",
  "canEditBlog",
  "canEditNews",
  "canManageJobPostings",
  "canViewApplications",
  "canEditProjects",
  "canEditProperties",
  "canAccessAttendance",
  "canAccessLeave",
  "canManageAttendance",
  "canApproveLeave",
  "canViewAttendanceReports",
  "canExportAttendance"
] as const;

export type Permission = (typeof permissionList)[number];

export const permissionDetails: Record<
  Permission,
  {
    label: string;
    description: string;
  }
> = {
  canManageUsers: {
    label: "Manage Users",
    description: "Create users, assign roles, and maintain admin account access."
  },
  canManageRoles: {
    label: "Manage Roles",
    description: "Edit the permission checklist for every built-in role."
  },
  canManageCorrections: {
    label: "Manage Corrections",
    description:
      "Open the correction workspace for attendance summaries, leave changes, CRM records, HRM records, and related database-backed updates."
  },
  canEditTheme: {
    label: "Edit Theme",
    description: "Control theme-level styling and shared website presentation settings."
  },
  canEditContent: {
    label: "Edit Content",
    description: "Update homepage sections, shared page copy, footer, and contact content."
  },
  canManageImages: {
    label: "Manage Images",
    description: "Upload and manage shared media used across the site."
  },
  canEditBlog: {
    label: "Edit Blog",
    description: "Create and update editorial blog content."
  },
  canEditNews: {
    label: "Edit News",
    description: "Publish and revise market news and announcements."
  },
  canManageJobPostings: {
    label: "Manage Job Postings",
    description: "Create, edit, and publish careers openings."
  },
  canViewApplications: {
    label: "View Applications",
    description: "Access job applications and resume downloads."
  },
  canEditProjects: {
    label: "Edit Projects",
    description: "Manage project records shown on the public site."
  },
  canEditProperties: {
    label: "Edit Properties",
    description: "Manage property inventory, featured items, and listing content."
  },
  canAccessAttendance: {
    label: "Access Attendance",
    description: "Open attendance pages and review attendance records."
  },
  canAccessLeave: {
    label: "Access Leave",
    description: "Open leave-request pages and view leave activity."
  },
  canManageAttendance: {
    label: "Manage Attendance",
    description: "Edit attendance records and maintain attendance balances."
  },
  canApproveLeave: {
    label: "Approve Leave",
    description: "Approve or reject leave requests."
  },
  canViewAttendanceReports: {
    label: "View Attendance Reports",
    description: "Open attendance reports, dashboards, and summaries."
  },
  canExportAttendance: {
    label: "Export Attendance",
    description: "Download attendance exports for payroll and audit workflows."
  }
};

export const defaultRolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [...permissionList],
  ADMIN: [...permissionList],
  HR: [
    "canManageJobPostings",
    "canViewApplications",
    "canAccessAttendance",
    "canAccessLeave",
    "canManageAttendance",
    "canApproveLeave",
    "canViewAttendanceReports",
    "canExportAttendance"
  ],
  MANAGER: ["canAccessAttendance", "canAccessLeave", "canApproveLeave", "canViewAttendanceReports"],
  EMPLOYEE: ["canAccessAttendance", "canAccessLeave", "canViewAttendanceReports"],
  DEVELOPER: ["canEditTheme", "canEditContent", "canEditProjects", "canEditProperties"],
  DIGITAL: ["canManageImages", "canEditBlog", "canEditNews"]
};

export const systemRoleDetails: Record<
  UserRole,
  {
    label: string;
    description: string;
  }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    description: "Full access to every module, including attendance changes, leave management, user administration, and role permissions."
  },
  ADMIN: {
    label: "Administration",
    description: "Can manage operations, edit attendance sheet details, handle leave workflows, and maintain employee accounts."
  },
  HR: {
    label: "HR",
    description: "Owns attendance, leave, hiring workflows, and employee records."
  },
  MANAGER: {
    label: "Manager",
    description: "Views team attendance, manages leave decisions, and tracks team reports."
  },
  EMPLOYEE: {
    label: "Employee",
    description: "Marks attendance, applies for leave, and reviews personal attendance history."
  },
  DEVELOPER: {
    label: "Developer",
    description: "Manages website structure, shared content, projects, and property inventory."
  },
  DIGITAL: {
    label: "Digital",
    description: "Manages media, editorial content, and public-facing news updates."
  }
};

export type AdminRoleDefinition = {
  name: string;
  label: string;
  description: string;
  isSystem: boolean;
};

const adminRoles = new Set<UserRole>(Object.keys(systemRoleDetails) as UserRole[]);

function isPermission(value: string): value is Permission {
  return (permissionList as readonly string[]).includes(value);
}

function normalizePermissions(values: string[] | null | undefined, fallback: Permission[]): Permission[] {
  const normalized = (values ?? []).filter(isPermission);
  return normalized.length > 0 ? normalized : fallback;
}

function formatRoleLabel(roleName: string) {
  return roleName
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeRoleName(roleName: string) {
  return roleName.trim().replace(/\s+/g, "_").toUpperCase();
}

type StoredRolePermission =
  | "canManageUsers"
  | "canManageRoles"
  | "canEditTheme"
  | "canEditContent"
  | "canManageImages"
  | "canEditBlog"
  | "canEditNews"
  | "canManageJobPostings"
  | "canViewApplications"
  | "canEditProjects"
  | "canEditProperties";

type LegacyRolePermissionRecord = {
  name: string;
  description?: string | null;
  permissions?: string[];
} & Record<StoredRolePermission, boolean>;

const storedRolePermissionList: StoredRolePermission[] = [
  "canManageUsers",
  "canManageRoles",
  "canEditTheme",
  "canEditContent",
  "canManageImages",
  "canEditBlog",
  "canEditNews",
  "canManageJobPostings",
  "canViewApplications",
  "canEditProjects",
  "canEditProperties"
];
const storedRolePermissionSet = new Set<Permission>(storedRolePermissionList);

export function toLegacyPermissionFlags(permissions: Permission[]) {
  return Object.fromEntries(
    storedRolePermissionList.map((permission) => [permission, permissions.includes(permission)])
  ) as Record<StoredRolePermission, boolean>;
}

export async function ensureSystemRoles() {
  if (!process.env.DATABASE_URL) return;

  try {
    await Promise.all(
      (Object.keys(systemRoleDetails) as UserRole[]).map((role) => {
        const defaults = defaultRolePermissions[role];
        return prisma.role.upsert({
          where: { name: role },
          update: {
            description: systemRoleDetails[role].description,
            permissions: defaults,
            ...toLegacyPermissionFlags(defaults)
          },
          create: {
            name: role,
            description: systemRoleDetails[role].description,
            permissions: defaults,
            ...toLegacyPermissionFlags(defaults)
          }
        });
      })
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to ensure system roles, using default role permissions.", error);
    }
  }
}

function extractPermissionsFromLegacyRole(role: LegacyRolePermissionRecord | null | undefined, fallback: Permission[]) {
  if (!role) return fallback;

  const explicitPermissions = normalizePermissions(role.permissions, []);
  if (explicitPermissions.length > 0) {
    return explicitPermissions;
  }

  const storedPermissions = storedRolePermissionList.filter((permission) => Boolean(role[permission]));
  const fallbackOnlyPermissions = fallback.filter((permission) => !storedRolePermissionSet.has(permission));
  const merged = [...storedPermissions, ...fallbackOnlyPermissions];

  return merged.length > 0 ? merged : fallback;
}

const getRolePermissionsCached = cache(async (role: UserRole): Promise<Permission[]> => {
  if (!process.env.DATABASE_URL) {
    return defaultRolePermissions[role] ?? [];
  }

  try {
    const record = await prisma.role.findUnique({
      where: { name: role },
      select: {
        name: true,
        description: true,
        permissions: true,
        canManageUsers: true,
        canManageRoles: true,
        canEditTheme: true,
        canEditContent: true,
        canManageImages: true,
        canEditBlog: true,
        canEditNews: true,
        canManageJobPostings: true,
        canViewApplications: true,
        canEditProjects: true,
        canEditProperties: true
      }
    });

    return extractPermissionsFromLegacyRole(record as LegacyRolePermissionRecord | null, defaultRolePermissions[role] ?? []);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Unable to read permissions for role ${role}, using defaults.`, error);
    }
    return defaultRolePermissions[role] ?? [];
  }
});

export async function getRolePermissions(role: UserRole): Promise<Permission[]> {
  return getRolePermissionsCached(role);
}

export async function getAllRolePermissions(): Promise<Record<UserRole, Permission[]>> {
  if (!process.env.DATABASE_URL) {
    return (Object.keys(systemRoleDetails) as UserRole[]).reduce(
      (acc, role) => {
        acc[role] = defaultRolePermissions[role];
        return acc;
      },
      {} as Record<UserRole, Permission[]>
    );
  }

  try {
    const records = await prisma.role.findMany({
      where: { name: { in: Object.keys(systemRoleDetails) } },
      select: {
        name: true,
        description: true,
        permissions: true,
        canManageUsers: true,
        canManageRoles: true,
        canEditTheme: true,
        canEditContent: true,
        canManageImages: true,
        canEditBlog: true,
        canEditNews: true,
        canManageJobPostings: true,
        canViewApplications: true,
        canEditProjects: true,
        canEditProperties: true
      }
    });
    const byRole = new Map(records.map((record) => [record.name as UserRole, record as LegacyRolePermissionRecord]));

    return (Object.keys(systemRoleDetails) as UserRole[]).reduce(
      (acc, role) => {
        acc[role] = extractPermissionsFromLegacyRole(byRole.get(role), defaultRolePermissions[role]);
        return acc;
      },
      {} as Record<UserRole, Permission[]>
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to read all role permissions, using defaults.", error);
    }
    return (Object.keys(systemRoleDetails) as UserRole[]).reduce(
      (acc, role) => {
        acc[role] = defaultRolePermissions[role];
        return acc;
      },
      {} as Record<UserRole, Permission[]>
    );
  }
}

export async function getManageableRoles(): Promise<Array<AdminRoleDefinition & { permissions: Permission[] }>> {
  const systemRoleNames = Object.keys(systemRoleDetails) as UserRole[];

  if (!process.env.DATABASE_URL) {
    return systemRoleNames.map((role) => ({
      name: role,
      label: systemRoleDetails[role].label,
      description: systemRoleDetails[role].description,
      isSystem: true,
      permissions: defaultRolePermissions[role]
    }));
  }

  try {
    const records = await prisma.role.findMany({
      orderBy: [{ createdAt: "asc" }],
      select: {
        name: true,
        description: true,
        permissions: true,
        canManageUsers: true,
        canManageRoles: true,
        canEditTheme: true,
        canEditContent: true,
        canManageImages: true,
        canEditBlog: true,
        canEditNews: true,
        canManageJobPostings: true,
        canViewApplications: true,
        canEditProjects: true,
        canEditProperties: true
      }
    });

    const customRoles = records
      .filter((record) => !systemRoleNames.includes(record.name as UserRole))
      .map((record) => ({
        name: record.name,
        label: formatRoleLabel(record.name),
        description: record.description?.trim() || "Custom role profile with a permission checklist.",
        isSystem: false,
        permissions: extractPermissionsFromLegacyRole(record as LegacyRolePermissionRecord, [])
      }));

    const systemRoles = systemRoleNames.map((role) => {
      const record = records.find((item) => item.name === role);
      return {
        name: role,
        label: systemRoleDetails[role].label,
        description: record?.description?.trim() || systemRoleDetails[role].description,
        isSystem: true,
        permissions: extractPermissionsFromLegacyRole(record as LegacyRolePermissionRecord | undefined, defaultRolePermissions[role])
      };
    });

    return [...systemRoles, ...customRoles];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to read manageable roles, using system defaults only.", error);
    }

    return systemRoleNames.map((role) => ({
      name: role,
      label: systemRoleDetails[role].label,
      description: systemRoleDetails[role].description,
      isSystem: true,
      permissions: defaultRolePermissions[role]
    }));
  }
}

export function isSystemRoleName(roleName: string): roleName is UserRole {
  return (Object.keys(systemRoleDetails) as string[]).includes(roleName);
}

export function normalizeAdminRoleName(roleName: string) {
  return normalizeRoleName(roleName);
}

export function getRoleLabel(roleName: string) {
  return isSystemRoleName(roleName) ? systemRoleDetails[roleName].label : formatRoleLabel(roleName);
}

export async function hasPermission(role: UserRole, permission: Permission): Promise<boolean> {
  const permissions = await getRolePermissions(role);
  return permissions.includes(permission);
}

export function canAccessAdmin(role: UserRole): boolean {
  return adminRoles.has(role);
}

export async function canManageUsers(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canManageUsers");
}

export async function canManageRoles(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canManageRoles");
}

export async function canManageCorrections(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canManageCorrections");
}

export async function canEditTheme(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canEditTheme");
}

export async function canEditContent(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canEditContent");
}

export async function canManageImages(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canManageImages");
}

export async function canEditBlog(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canEditBlog");
}

export async function canEditNews(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canEditNews");
}

export async function canManageNews(role: UserRole): Promise<boolean> {
  const [blog, news] = await Promise.all([canEditBlog(role), canEditNews(role)]);
  return blog || news;
}

export async function canManageJobPostings(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canManageJobPostings");
}

export async function canViewApplications(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canViewApplications");
}

export async function canEditProjects(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canEditProjects");
}

export async function canEditProperties(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canEditProperties");
}

export async function canAccessLeads(role: UserRole): Promise<boolean> {
  const [manageUsers, manageRoles] = await Promise.all([canManageUsers(role), canManageRoles(role)]);
  return manageUsers || manageRoles;
}

export async function canUploadMedia(role: UserRole): Promise<boolean> {
  const [manageImages, editContent, editProjects, editProperties, manageNews] = await Promise.all([
    canManageImages(role),
    canEditContent(role),
    canEditProjects(role),
    canEditProperties(role),
    canManageNews(role)
  ]);

  return manageImages || editContent || editProjects || editProperties || manageNews;
}

export async function canAccessAttendance(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canAccessAttendance");
}

export async function canAccessLeave(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canAccessLeave");
}

export async function canManageAttendance(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canManageAttendance");
}

export async function canApproveLeave(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canApproveLeave");
}

export async function canViewAttendanceReports(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canViewAttendanceReports");
}

export async function canExportAttendance(role: UserRole): Promise<boolean> {
  return hasPermission(role, "canExportAttendance");
}

export function canUploadHolidayCalendar(role: UserRole): boolean {
  return role === "HR" || role === "MANAGER" || role === "ADMIN" || role === "SUPER_ADMIN";
}
