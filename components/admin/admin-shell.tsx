import Link from "next/link";
import { UserRole } from "@prisma/client";

import { AdminFeedbackToast } from "@/components/admin/admin-feedback-toast";
import { NotificationBell } from "@/components/admin/notification-bell";
import { signOut } from "@/lib/auth";
import { canSendAnnouncements } from "@/lib/notifications";
import {
  canAccessAttendance,
  canAccessLeave,
  canAccessLeads,
  canEditContent,
  canEditProperties,
  canExportAttendance,
  canManageJobPostings,
  canManageCorrections,
  canManageNews,
  canManageRoles,
  canManageUsers,
  canViewApplications,
  canViewAttendanceReports,
  systemRoleDetails
} from "@/lib/permissions";

const navGroups = [
  {
    title: "Executive Dashboard",
    links: [
      {
        href: "/admin",
        label: "Control Center",
        detail: "Operational overview, workforce highlights, and priority actions.",
        permission: null
      },
      {
        href: "/admin/attendance",
        label: "Attendance Operations",
        detail: "Check-in, check-out, attendance history, and attendance control workflows.",
        permission: "canAccessAttendance"
      },
      {
        href: "/admin/leave-requests",
        label: "Leave Management",
        detail: "Leave applications, approvals, and balance review.",
        permission: "canAccessLeave"
      }
    ]
  },
  {
    title: "Website CMS",
    links: [
      {
        href: "/admin/content",
        label: "Content Management",
        detail: "Homepage sections, page copy, footer content, and contact details.",
        permission: "canEditContent"
      },
      {
        href: "/admin/properties",
        label: "Property Management",
        detail: "Listing inventory, featured records, and public property search content.",
        permission: "canEditProperties"
      },
      {
        href: "/admin/blog",
        label: "News Management",
        detail: "Articles, updates, and editorial publishing for the news section.",
        permission: "canManageNews"
      }
    ]
  },
  {
    title: "HRM Workspace",
    links: [
      {
        href: "/admin/hrm",
        label: "HRM Documents",
        detail: "Payroll, performance, employee documents, and letterhead-based downloads.",
        permission: "canAccessAttendance"
      },
      {
        href: "/admin/jobs",
        label: "Recruitment Management",
        detail: "Open positions, recruitment demand, and hiring visibility.",
        permission: "canManageJobPostings"
      },
      {
        href: "/admin/applications",
        label: "Application Tracking",
        detail: "Candidate applications received from the careers portal.",
        permission: "canViewApplications"
      },
      {
        href: "/admin/attendance-reports",
        label: "Attendance Analytics",
        detail: "Monthly summaries, calendar reports, and organization-wide attendance analysis.",
        permission: "canViewAttendanceReports"
      },
      {
        href: "/admin/notifications",
        label: "Internal Communications",
        detail: "Broadcast announcements and review employee notification activity.",
        permission: "canSendAnnouncements"
      }
    ]
  },
  {
    title: "CRM Workspace",
    links: [
      {
        href: "/admin/leads",
        label: "Lead Management",
        detail: "Inbound inquiries, contact records, and follow-up pipeline visibility.",
        permission: "canAccessLeads"
      }
    ]
  },
  {
    title: "Access Control",
    links: [
      {
        href: "/admin/users",
        label: "User Administration",
        detail: "Employee accounts, access ownership, and workforce records.",
        permission: "canManageUsers"
      },
      {
        href: "/admin/roles",
        label: "Role & Permission Matrix",
        detail: "Permission governance and role-based access configuration.",
        permission: "canManageRoles"
      },
      {
        href: "/admin/corrections",
        label: "Corrections Workspace",
        detail: "Attendance summary corrections, leave updates, CRM and HRM record correction routing.",
        permission: "canManageCorrections"
      }
    ]
  }
] as const;

export async function AdminShell({
  user,
  children
}: {
  user: {
    id: string;
    role: UserRole;
    name?: string | null;
    email?: string | null;
    employeeCode: string;
  };
  children: React.ReactNode;
}) {
  const role = user.role;
  const [
    accessAttendance,
    accessLeave,
    accessLeads,
    editContent,
    editProperties,
    exportAttendance,
    manageJobPostings,
    manageCorrections,
    manageNews,
    manageRoles,
    manageUsers,
    viewApplications,
    viewAttendanceReports
  ] = await Promise.all([
    canAccessAttendance(role),
    canAccessLeave(role),
    canAccessLeads(role),
    canEditContent(role),
    canEditProperties(role),
    canExportAttendance(role),
    canManageJobPostings(role),
    canManageCorrections(role),
    canManageNews(role),
    canManageRoles(role),
    canManageUsers(role),
    canViewApplications(role),
    canViewAttendanceReports(role)
  ]);
  const visibility = {
    canAccessAttendance: accessAttendance,
    canAccessLeave: accessLeave,
    canAccessLeads: accessLeads,
    canEditContent: editContent,
    canEditProperties: editProperties,
    canExportAttendance: exportAttendance,
    canManageJobPostings: manageJobPostings,
    canManageCorrections: manageCorrections,
    canManageNews: manageNews,
    canManageRoles: manageRoles,
    canManageUsers: manageUsers,
    canSendAnnouncements: canSendAnnouncements(role),
    canViewApplications: viewApplications,
    canViewAttendanceReports: viewAttendanceReports
  };
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.permission === null || visibility[link.permission])
    }))
    .filter((group) => group.links.length > 0);

  return (
    <div className="dark min-h-screen bg-zinc-950 text-white">
      <AdminFeedbackToast />
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden h-screen overflow-y-auto border-r border-white/10 bg-black/40 p-6 scrollbar-thin lg:block">
          <Link href="/admin" className="font-display text-3xl tracking-[0.08em] text-white">
            JAGUAR PROPERTIES
          </Link>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Unified CRM, HRM, and website operations console for Jaguar Properties.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.28em] text-zinc-500">
            Signed in as {systemRoleDetails[role].label}
          </p>

          <div className="mt-10 space-y-6">
            {visibleGroups.map((group) => (
              <details key={group.title} className="group rounded-2xl border border-white/10 bg-white/[0.03]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-200">
                  <span>{group.title}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 group-open:text-primary">
                    Open
                  </span>
                </summary>
                <nav className="space-y-2 border-t border-white/10 px-3 py-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-2xl border border-transparent px-4 py-3 transition hover:border-white/10 hover:bg-white/5"
                    >
                      <p className="text-sm font-semibold text-zinc-200">{link.label}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{link.detail}</p>
                    </Link>
                  ))}
                </nav>
              </details>
            ))}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="mt-10"
          >
            <button className="w-full rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-300/50 hover:bg-rose-500/20">
              Sign out
            </button>
          </form>
        </aside>
        <div className="min-w-0 p-6 lg:h-screen lg:overflow-y-auto lg:p-10 scrollbar-thin">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <details className="group lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
                <span>Menu</span>
                <span className="text-xs uppercase tracking-[0.2em] text-primary">Open</span>
              </summary>
              <div className="scrollbar-thin mt-3 max-h-[70vh] overflow-y-auto rounded-[24px] border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
                <Link href="/admin" className="font-display text-2xl tracking-[0.08em] text-white">
                  JAGUAR PROPERTIES
                </Link>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Unified CRM, HRM, and website operations console for Jaguar Properties.
                </p>
                <div className="mt-6 space-y-4">
                  {visibleGroups.map((group) => (
                    <details key={group.title} className="group rounded-2xl border border-white/10 bg-white/[0.03]">
                      <summary className="flex list-none items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-200">
                        <span>{group.title}</span>
                        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 group-open:text-primary">
                          Open
                        </span>
                      </summary>
                      <nav className="space-y-2 border-t border-white/10 px-3 py-3">
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block rounded-2xl border border-transparent px-4 py-3 transition hover:border-white/10 hover:bg-white/5"
                          >
                            <p className="text-sm font-semibold text-zinc-200">{link.label}</p>
                            <p className="mt-1 text-xs leading-5 text-zinc-500">{link.detail}</p>
                          </Link>
                        ))}
                      </nav>
                    </details>
                  ))}
                </div>
                <div className="mt-6 space-y-2">
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/admin/login" });
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-left text-sm font-semibold text-rose-200 transition hover:border-rose-300/50 hover:bg-rose-500/20"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </details>

            <div className="ml-auto flex w-full max-w-xl items-center justify-end gap-3">
              <NotificationBell canSendAnnouncements={canSendAnnouncements(role)} />
              <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.4)]">
                <p className="truncate text-base font-semibold text-white">{user.name ?? user.email ?? "Employee"}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{user.employeeCode}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 hidden items-center justify-end gap-2 lg:flex">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-300/50 hover:bg-rose-500/20"
              >
                Sign out
              </button>
            </form>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
