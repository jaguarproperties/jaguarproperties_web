import Link from "next/link";

import { auth } from "@/lib/auth";
import { getAdminDashboardPreview, getDashboardOverview } from "@/lib/data";
import { getAttendanceSummary } from "@/lib/hr";
import {
  canAccessAttendance,
  canAccessLeads,
  canApproveLeave,
  canEditContent,
  canEditProperties,
  canManageJobPostings,
  canManageNews,
  canManageUsers,
  canViewAttendanceReports,
  canViewApplications
} from "@/lib/permissions";
import { getTodayAttendanceForUser } from "@/lib/hr";
import { StatCard } from "@/components/admin/stat-card";
import { TableCard } from "@/components/admin/table-card";
import { Button } from "@/components/ui/button";
import { AttendanceMarker } from "@/components/admin/attendance-marker";

export default async function AdminDashboardPage() {
  const session = await auth();
  const role = session?.user?.role ?? "ADMIN";
  const [
    canAccessAttendancePermission,
    canAccessLeadsPermission,
    canApproveLeavePermission,
    canEditContentPermission,
    canEditPropertiesPermission,
    canManageJobPostingsPermission,
    canManageNewsPermission,
    canManageUsersPermission,
    canViewAttendanceReportsPermission,
    canViewApplicationsPermission
  ] = await Promise.all([
    canAccessAttendance(role),
    canAccessLeads(role),
    canApproveLeave(role),
    canEditContent(role),
    canEditProperties(role),
    canManageJobPostings(role),
    canManageNews(role),
    canManageUsers(role),
    canViewAttendanceReports(role),
    canViewApplications(role)
  ]);
  const [overview, dashboardPreview, attendanceSummary, todayRecord] = await Promise.all([
    getDashboardOverview(),
    getAdminDashboardPreview(),
    canAccessAttendancePermission && session?.user
      ? getAttendanceSummary({ id: session.user.id, role: session.user.role })
      : Promise.resolve(null),
    canAccessAttendancePermission && session?.user ? getTodayAttendanceForUser(session.user.id) : Promise.resolve(null)
  ]);
  const quickActions = [
    {
      href: "/admin/attendance",
      title: "Punch Attendance",
      text: "Open attendance actions to mark check-in, check-out, and review today&apos;s status quickly.",
      visible: canAccessAttendancePermission
    },
    {
      href: "/admin/attendance",
      title: "Attendance Operations",
      text: "Manage check-in, check-out, and attendance review from one operational workspace.",
      visible: canAccessAttendancePermission
    },
    {
      href: "/admin/leave-requests",
      title: "Leave Management",
      text: "Review leave applications, approvals, and workforce leave balances.",
      visible: canApproveLeavePermission
    },
    {
      href: "/admin/attendance-reports",
      title: "Attendance Analytics",
      text: "Open workforce attendance reports, monthly summaries, and export-ready analytics.",
      visible: canViewAttendanceReportsPermission
    },
    {
      href: "/admin/content",
      title: "Content Management",
      text: "Manage homepage content, public page copy, contact details, and footer content.",
      visible: canEditContentPermission
    },
    {
      href: "/admin/properties",
      title: "Property Management",
      text: "Maintain listing inventory, featured records, and public website property content.",
      visible: canEditPropertiesPermission
    },
    {
      href: "/admin/blog",
      title: "News Management",
      text: "Create, publish, and maintain editorial updates for the website news section.",
      visible: canManageNewsPermission
    },
    {
      href: "/admin/jobs",
      title: "Recruitment Management",
      text: "Maintain active openings, hiring demand, and recruitment visibility.",
      visible: canManageJobPostingsPermission
    }
  ].filter((item) => item.visible);
  const recentLeadPreview = dashboardPreview.recentLeads;
  const recentJobPreview = dashboardPreview.recentJobPostings;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Overview</p>
          <h1 className="mt-3 font-display text-5xl text-white">Operations Control Center</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            A unified CRM and HRM workspace for Jaguar Properties. Each module below is filtered by role so teams only
            see the records, reports, and actions they are authorized to manage.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={quickActions[0]?.href ?? "/admin"}>{quickActions[0]?.title ?? "Open Admin"}</Link>
          </Button>
          {canApproveLeavePermission ? (
            <Button asChild variant="secondary" size="lg">
              <Link href="/admin/leave-requests">Open Leave Management</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {canAccessAttendancePermission ? (
        <TableCard title="Attendance Actions">
          <AttendanceMarker todayRecord={todayRecord} />
        </TableCard>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {canAccessAttendancePermission && attendanceSummary ? (
          <StatCard label="Present Today" value={attendanceSummary.totals.presentToday} detail="Attendance check-ins captured today." />
        ) : null}
        {canAccessAttendancePermission && attendanceSummary ? (
          <StatCard label="On Leave" value={attendanceSummary.totals.onLeaveToday} detail="Approved leave covering today." />
        ) : null}
        {canAccessAttendancePermission && attendanceSummary ? (
          <StatCard label="Absent Today" value={attendanceSummary.totals.absentToday} detail="No attendance or leave recorded yet." />
        ) : null}
        {canAccessLeadsPermission ? (
          <StatCard label="CRM Leads" value={overview.leads} detail="Inbound buyer and investor inquiries." />
        ) : null}
        {canEditPropertiesPermission ? (
          <StatCard label="Property Records" value={overview.properties} detail="Live inventory currently listed." />
        ) : null}
        {canManageNewsPermission ? (
          <StatCard label="Published Posts" value={overview.posts} detail="News and market content published." />
        ) : null}
        {canViewApplicationsPermission ? (
          <StatCard label="Applications" value={overview.applications} detail="Career applications received from the website." />
        ) : null}
        {canManageJobPostingsPermission ? (
          <StatCard label="Open Positions" value={overview.jobs} detail="Roles currently visible through the careers flow." />
        ) : null}
        {canManageJobPostingsPermission ? (
          <StatCard label="Total Openings" value={overview.openings} detail="Combined hiring openings managed from job data." />
        ) : null}
        {canManageUsersPermission ? (
          <StatCard label="Admin Areas" value={quickActions.length} detail="Sections currently available to your account." />
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TableCard
          title="Operational Shortcuts"
          description="Your most-used CRM, HRM, and CMS modules stay here for faster daily navigation."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((item) => (
              <Link
                key={`${item.href}:${item.title}`}
                href={item.href}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-primary/40 hover:bg-white/10"
              >
                <p className="font-display text-2xl text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{item.text}</p>
              </Link>
            ))}
          </div>
        </TableCard>
        <TableCard
          title="Website Content Snapshot"
          description="A compact view of the public website content most teams review frequently."
          action={canEditContentPermission ? { href: "/admin/content", label: "See more" } : undefined}
        >
          <div className="space-y-4 text-sm leading-7 text-zinc-300">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Homepage Hero</p>
              <p className="mt-2 text-lg text-white">{dashboardPreview.siteContent?.heroTitle}</p>
            </div>
            {canEditContentPermission ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">Contact</p>
                  <p>{dashboardPreview.siteContent?.contactEmail}</p>
                  <p>{dashboardPreview.siteContent?.contactPhone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">Footer</p>
                  <p>{dashboardPreview.siteContent?.footerBlurb}</p>
                </div>
              </>
            ) : (
              <p className="text-zinc-400">Your account can view the shared hero snapshot, with deeper content editing gated by role.</p>
            )}
          </div>
        </TableCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {canAccessLeadsPermission ? (
          <TableCard
            title="Recent CRM Leads"
            description={`Showing ${recentLeadPreview.length} of ${dashboardPreview.leadCount} total lead records.`}
            action={dashboardPreview.leadCount > recentLeadPreview.length ? { href: "/admin/leads", label: "See more" } : undefined}
          >
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {recentLeadPreview.map((lead) => (
                  <tr key={lead.id} className="border-t border-white/10 text-zinc-300">
                    <td className="py-3">{lead.name}</td>
                    <td className="py-3">{lead.email}</td>
                    <td className="py-3">{lead.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        ) : null}

      </div>

      {canManageJobPostingsPermission ? (
        <TableCard
          title="Active Recruitment Openings"
          description={`Showing ${recentJobPreview.length} of ${dashboardPreview.jobPostingCount} active recruitment records.`}
          action={dashboardPreview.jobPostingCount > recentJobPreview.length ? { href: "/admin/jobs", label: "See more" } : undefined}
        >
          {dashboardPreview.jobPostingCount === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-zinc-400">
              No job postings are available right now.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="pb-3">Job Title</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Openings</th>
                  <th className="pb-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {recentJobPreview.map((job) => (
                  <tr key={job.id} className="border-t border-white/10 text-zinc-300">
                    <td className="py-3 text-white">{job.title}</td>
                    <td className="py-3">{job.department}</td>
                    <td className="py-3">{job.location}</td>
                    <td className="py-3">{job.openings}</td>
                    <td className="py-3">{job.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      ) : null}
    </div>
  );
}
