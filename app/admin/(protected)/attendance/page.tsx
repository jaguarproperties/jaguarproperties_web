import { format } from "date-fns";
import { redirect } from "next/navigation";

import { AttendanceMarker } from "@/components/admin/attendance-marker";
import { ManualAttendanceForm } from "@/components/admin/manual-attendance-form";
import { StatCard } from "@/components/admin/stat-card";
import { TableCard } from "@/components/admin/table-card";
import { auth } from "@/lib/auth";
import { getUserDepartments } from "@/lib/data";
import {
  formatWorkingHours,
  getAttendanceLocation,
  getAttendanceRecords,
  getAttendanceSummary,
  getDateRange,
  getTodayAttendanceForUser
} from "@/lib/hr";
import { getHolidaysInRange } from "@/lib/holidays";
import { canAccessAttendance, canManageAttendance } from "@/lib/permissions";

type SearchParams = {
  month?: string;
  from?: string;
  to?: string;
  employeeId?: string;
  department?: string;
  role?: string;
  search?: string;
  page?: string;
};

function formatCoordinate(value?: number) {
  return typeof value === "number" ? value.toFixed(5) : null;
}

function formatAttendanceLocationSummary(location: ReturnType<typeof getAttendanceLocation>) {
  const latestLocation = location?.checkOut ?? location?.checkIn;

  if (!latestLocation) {
    return {
      label: "Location unavailable",
      coordinates: null
    };
  }

  if (latestLocation.address === "WFH") {
    return {
      label: "Work from home",
      coordinates: "WFH"
    };
  }

  const latitude = formatCoordinate(latestLocation.latitude);
  const longitude = formatCoordinate(latestLocation.longitude);

  return {
    label: location?.checkOut ? "Check-out location" : "Check-in location",
    coordinates: latitude && longitude ? `${latitude}, ${longitude}` : "Coordinates unavailable"
  };
}

export default async function AttendancePage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  if (!session?.user || !(await canAccessAttendance(session.user.role))) {
    redirect("/admin");
  }
  const canManageAttendancePermission = await canManageAttendance(session.user.role);

  const filters = {
    month: searchParams?.month,
    from: searchParams?.from,
    to: searchParams?.to,
    employeeId: searchParams?.employeeId,
    department: searchParams?.department,
    role: searchParams?.role,
    search: searchParams?.search
  };

  const [attendance, summary, todayRecord] = await Promise.all([
    getAttendanceRecords({ id: session.user.id, role: session.user.role }, filters),
    getAttendanceSummary({ id: session.user.id, role: session.user.role }, filters),
    getTodayAttendanceForUser(session.user.id)
  ]);
  const departments = await getUserDepartments();
  const range = getDateRange(filters);
  const holidays = await getHolidaysInRange(range.start, range.end);
  const scopeDescription =
    session.user.role === "HR" || session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
      ? "You can review attendance for every employee in the company."
      : session.user.role === "MANAGER"
        ? "You can review your own attendance and your reporting team."
        : "You can review your own attendance details here.";

  const selectedEmployeeId =
    filters.employeeId ?? summary.summary.find((item) => item.employee.id === session.user.id)?.employee.id ?? "";
  const selectedSummary = summary.summary.find((item) => item.employee.id === selectedEmployeeId) ?? summary.summary[0];
  const showSelectedEmployeeDetails = Boolean(filters.employeeId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">HR Management</p>
          <h1 className="mt-3 font-display text-5xl text-white">Attendance</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            Server-timed attendance, geo capture, work type tracking, and role-based attendance visibility all live
            here inside the admin panel.
          </p>
          <p className="mt-2 text-sm text-zinc-500">{scopeDescription}</p>
        </div>

        <form className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <select
            name="employeeId"
            defaultValue={selectedEmployeeId ?? ""}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">All Employees In Scope</option>
            {attendance.employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.id === session.user.id ? "My Attendance" : employee.name ?? employee.email}
              </option>
            ))}
          </select>
          <select
            name="department"
            defaultValue={searchParams?.department ?? ""}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <input
            name="search"
            defaultValue={searchParams?.search ?? ""}
            placeholder="Search employee"
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          />
          <input
            name="from"
            type="date"
            defaultValue={searchParams?.from ?? ""}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          />
          <input
            name="to"
            type="date"
            defaultValue={searchParams?.to ?? ""}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          />
          <button className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Apply Filters
          </button>
          <a
            href="/admin/attendance"
            className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
          >
            Reset
          </a>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={showSelectedEmployeeDetails ? "Present Days" : "Total Employees"}
          value={showSelectedEmployeeDetails ? selectedSummary?.presentDays ?? 0 : summary.totals.totalEmployees}
          detail={
            showSelectedEmployeeDetails
              ? "Days marked present in the selected period."
              : "Employees in your current attendance scope."
          }
        />
        <StatCard
          label={showSelectedEmployeeDetails ? "Leave Days" : "Present Today"}
          value={showSelectedEmployeeDetails ? selectedSummary?.leaveDays ?? 0 : summary.totals.presentToday}
          detail={
            showSelectedEmployeeDetails
              ? "Approved leave days in the selected period."
              : "Employees who have already checked in today."
          }
        />
        <StatCard
          label={showSelectedEmployeeDetails ? "Late Marks" : "On Leave"}
          value={showSelectedEmployeeDetails ? selectedSummary?.lateMarks ?? 0 : summary.totals.onLeaveToday}
          detail={
            showSelectedEmployeeDetails
              ? "Late arrivals based on the configured threshold."
              : "Employees currently covered by approved leave."
          }
        />
        <StatCard
          label={showSelectedEmployeeDetails ? "Working Hours" : "Absent Today"}
          value={
            showSelectedEmployeeDetails
              ? formatWorkingHours(selectedSummary?.totalWorkingMinutes ?? 0)
              : summary.totals.absentToday
          }
          detail={
            showSelectedEmployeeDetails
              ? "Total tracked work duration."
              : "Employees without attendance or leave today."
          }
        />
      </div>

      <AttendanceMarker todayRecord={todayRecord} />

      {canManageAttendancePermission ? (
        <ManualAttendanceForm
          employees={attendance.employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            email: employee.email
          }))}
        />
      ) : null}

      <TableCard
        title="Company Holiday List"
        description="Employees can review the current holiday list here. These dates are also used inside the attendance calendar."
      >
        {holidays.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-zinc-400">
            No company holidays are uploaded for this period yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Holiday</th>
                <th className="pb-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr key={holiday.id} className="border-t border-white/10 text-zinc-300">
                  <td className="py-4">{format(holiday.date, "dd MMM yyyy")}</td>
                  <td className="py-4 font-medium text-white">{holiday.title}</td>
                  <td className="py-4">{holiday.description ?? "Company holiday"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      <TableCard
        title="Attendance History"
        description="Scroll inside this history section to review the latest attendance records while keeping each cell easy to read."
        contentClassName="max-h-[72vh] rounded-2xl border border-white/10"
      >
        <table className="min-w-[1360px] w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[220px]" />
            <col className="w-[130px]" />
            <col className="w-[180px]" />
            <col className="w-[180px]" />
            <col className="w-[130px]" />
            <col className="w-[150px]" />
            <col className="w-[260px]" />
            <col className="w-[170px]" />
          </colgroup>
          <thead className="text-zinc-500">
            <tr>
              <th className="sticky left-0 top-0 z-20 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Employee</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Date</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Check In</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Check Out</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Work Type</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Status</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Location</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Edited By</th>
            </tr>
          </thead>
          <tbody>
            {attendance.records.length === 0 ? (
              <tr className="border-t border-white/10 text-zinc-300">
                <td colSpan={8} className="px-4 py-6 text-center text-zinc-500">
                  No attendance records found for the current filters.
                </td>
              </tr>
            ) : (
              attendance.records.map((record, index) => {
                const locationSummary = formatAttendanceLocationSummary(getAttendanceLocation(record.location));

                return (
                  <tr
                    key={record.id}
                    className="border-t border-white/10 text-zinc-300 align-top odd:bg-white/[0.02] even:bg-transparent"
                  >
                  <td className="sticky left-0 z-[1] bg-[hsl(var(--card))] px-4 py-4">
                    <p className="font-medium text-white">{record.employee.name ?? record.employee.email}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      #{index + 1} • {record.employee.department ?? "No department"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-zinc-200">{format(record.date, "dd MMM yyyy")}</td>
                  <td className="px-4 py-4 break-words leading-6 text-zinc-200">
                    {record.checkInTime ? format(record.checkInTime, "dd MMM, hh:mm a") : "—"}
                  </td>
                  <td className="px-4 py-4 break-words leading-6 text-zinc-200">
                    {record.checkOutTime ? format(record.checkOutTime, "dd MMM, hh:mm a") : "—"}
                  </td>
                  <td className="px-4 py-4 break-words text-zinc-200">{record.workType ?? "—"}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{record.status}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {record.isLate ? "Late mark" : formatWorkingHours(record.workingMinutes)}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-xs leading-6 text-zinc-400 break-words">
                    <p className="font-medium text-zinc-300">{locationSummary.label}</p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-500">{locationSummary.coordinates ?? "—"}</p>
                  </td>
                  <td className="px-4 py-4 text-xs leading-6 text-zinc-500 break-words">
                    {record.editedBy?.name ?? record.editedBy?.email ?? "System"}
                  </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
