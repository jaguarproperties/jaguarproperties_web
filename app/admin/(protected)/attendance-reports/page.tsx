import { addMonths, format, subMonths } from "date-fns";
import { redirect } from "next/navigation";

import { uploadHolidayCalendar } from "@/app/actions";
import { AttendanceCalendar } from "@/components/admin/attendance-calendar";
import { StatCard } from "@/components/admin/stat-card";
import { TableCard } from "@/components/admin/table-card";
import { auth } from "@/lib/auth";
import { getUserDepartments } from "@/lib/data";
import { formatWorkingHours, getAttendanceRecords, getAttendanceSummary, getDateRange, getLeaveRequests } from "@/lib/hr";
import { getHolidayDateKeySet, getHolidaysInRange, isScheduledWorkingDay, isWeeklyHoliday } from "@/lib/holidays";
import { canUploadHolidayCalendar, canViewAttendanceReports } from "@/lib/permissions";

type SearchParams = {
  month?: string;
  from?: string;
  to?: string;
  employeeId?: string;
  department?: string;
  role?: string;
  search?: string;
};

export default async function AttendanceReportsPage({
  searchParams
}: {
  searchParams?: SearchParams & { holidayUploaded?: string; holidayError?: string };
}) {
  const session = await auth();
  if (!session?.user || !(await canViewAttendanceReports(session.user.role))) {
    redirect("/admin");
  }

  const filters = {
    month: searchParams?.month,
    from: searchParams?.from,
    to: searchParams?.to,
    employeeId: searchParams?.employeeId,
    department: searchParams?.department,
    role: searchParams?.role,
    search: searchParams?.search
  };

  const [summary, attendance, leaves] = await Promise.all([
    getAttendanceSummary({ id: session.user.id, role: session.user.role }, filters),
    getAttendanceRecords({ id: session.user.id, role: session.user.role }, filters),
    getLeaveRequests({ id: session.user.id, role: session.user.role }, filters)
  ]);
  const departments = await getUserDepartments();
  const canUploadHolidaySheet = canUploadHolidayCalendar(session.user.role);
  const scopeDescription =
    session.user.role === "HR" || session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
      ? "You can review attendance for every employee in the company."
      : session.user.role === "MANAGER"
        ? "You can review your own attendance and your reporting team."
        : "You can review your own attendance details here.";

  const selectedEmployeeId =
    filters.employeeId ??
    summary.summary.find((item) => item.employee.id === session.user.id)?.employee.id ??
    summary.summary[0]?.employee.id;
  const selectedEmployee = summary.summary.find((item) => item.employee.id === selectedEmployeeId) ?? summary.summary[0];
  const monthWorkingDays = selectedEmployee?.workingDays ?? summary.summary[0]?.workingDays ?? 0;
  const summaryTotals = summary.summary.reduce(
    (acc, item) => ({
      workingDays: acc.workingDays + item.workingDays,
      presentDays: acc.presentDays + item.presentDays,
      absentDays: acc.absentDays + item.absentDays,
      leaveDays: acc.leaveDays + item.leaveDays,
      halfDays: acc.halfDays + item.halfDays,
      lateMarks: acc.lateMarks + item.lateMarks,
      totalWorkingMinutes: acc.totalWorkingMinutes + item.totalWorkingMinutes
    }),
    {
      workingDays: 0,
      presentDays: 0,
      absentDays: 0,
      leaveDays: 0,
      halfDays: 0,
      lateMarks: 0,
      totalWorkingMinutes: 0
    }
  );
  const range = getDateRange(filters);
  const previousMonth = format(subMonths(range.start, 1), "yyyy-MM");
  const nextMonth = format(addMonths(range.start, 1), "yyyy-MM");
  const [holidays, holidayKeySet] = await Promise.all([
    getHolidaysInRange(range.start, range.end),
    getHolidayDateKeySet(range.start, range.end)
  ]);
  const statusByDay = new Map<string, string>();
  const holidayByDay = new Map(holidays.map((holiday) => [format(holiday.date, "yyyy-MM-dd"), holiday]));

  for (const record of attendance.records) {
    if (record.employeeId === selectedEmployee?.employee.id) {
      statusByDay.set(format(record.date, "yyyy-MM-dd"), record.status);
    }
  }

  for (const leave of leaves.leaves) {
    if (leave.employeeId === selectedEmployee?.employee.id && leave.status === "APPROVED") {
      const cursor = new Date(leave.startDate);
      while (cursor <= leave.endDate) {
        const dateKey = format(cursor, "yyyy-MM-dd");
        if (isScheduledWorkingDay(cursor) && !holidayKeySet.has(dateKey)) {
          statusByDay.set(dateKey, "LEAVE");
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">HR Management</p>
          <h1 className="mt-3 font-display text-5xl text-white">Attendance Reports</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            Use the monthly sheet, employee summaries, and export tools here to review attendance across individuals,
            teams, or the full organization.
          </p>
          <p className="mt-2 text-sm text-zinc-500">{scopeDescription}</p>
        </div>

        <form className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          <input
            name="month"
            type="month"
            defaultValue={searchParams?.month ?? format(new Date(), "yyyy-MM")}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          />
          <select
            name="employeeId"
            defaultValue={selectedEmployee?.employee.id ?? ""}
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            <option value="">All Employees In Scope</option>
            {summary.summary.map((item) => (
              <option key={item.employee.id} value={item.employee.id}>
                {item.employee.name ?? item.employee.email}
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
          <button className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Search 
          </button>
          <a
            href={`/api/attendance/export?format=xlsx&month=${searchParams?.month ?? format(new Date(), "yyyy-MM")}`}
            className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
          >
            Export XLSX
          </a>
          <a
            href="/admin/attendance-reports"
            className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
          >
            Reset
          </a>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Employees" value={summary.totals.totalEmployees} detail="Employees in the active report scope." />
        <StatCard label="Present Today" value={summary.totals.presentToday} detail="Employees with today&apos;s attendance recorded." />
        <StatCard label="On Leave" value={summary.totals.onLeaveToday} detail="Employees currently covered by approved leave." />
        <StatCard label="Absent Today" value={summary.totals.absentToday} detail="Employees still missing attendance for today." />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Working Days This Month"
          value={monthWorkingDays}
          detail="Total scheduled working days in the selected month or date range."
        />
        <StatCard
          label="Total Present Days"
          value={summaryTotals.presentDays}
          detail="Combined present records across all employees in the current summary."
        />
        <StatCard
          label="Total Late Marks"
          value={summaryTotals.lateMarks}
          detail="All late marks captured in the selected summary period."
        />
        <StatCard
          label="Total Working Hours"
          value={formatWorkingHours(summaryTotals.totalWorkingMinutes)}
          detail="Combined tracked working hours across the current summary."
        />
      </div>

      {searchParams?.holidayUploaded ? (
        <div className="rounded-[24px] border border-emerald-400/25 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
          Holiday calendar uploaded successfully.
        </div>
      ) : null}

      {searchParams?.holidayError ? (
        <div className="rounded-[24px] border border-rose-400/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
          {searchParams.holidayError === "missing-file"
            ? "Please choose an Excel sheet before uploading."
            : searchParams.holidayError === "empty-sheet"
              ? "The uploaded holiday sheet is empty."
              : searchParams.holidayError.startsWith("invalid-rows:")
                ? `Some rows are invalid in the holiday sheet: ${searchParams.holidayError.replace("invalid-rows:", "")}.`
                : "Holiday calendar could not be uploaded."}
        </div>
      ) : null}

      <TableCard
        title="Attendance Summary"
        description="Scroll inside this section to review every employee record clearly, with totals visible in the same summary panel."
        contentClassName="max-h-[72vh] rounded-2xl border border-white/10"
      >
        <table className="min-w-[1240px] w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[240px]" />
            <col className="w-[150px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
            <col className="w-[130px]" />
            <col className="w-[160px]" />
          </colgroup>
          <thead className="text-zinc-500">
            <tr>
              <th className="sticky left-0 top-0 z-20 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Employee</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Working Days</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Present</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Absent</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Leave</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Half Days</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Late Marks</th>
              <th className="sticky top-0 z-10 bg-[hsl(var(--card))] px-4 pb-3 pt-4">Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {summary.summary.length === 0 ? (
              <tr className="border-t border-white/10 text-zinc-300">
                <td colSpan={8} className="px-4 py-6 text-center text-zinc-500">
                  No attendance summary records are available for the selected filters.
                </td>
              </tr>
            ) : null}
            {summary.summary.map((item, index) => (
              <tr
                key={item.employee.id}
                className="border-t border-white/10 text-zinc-300 odd:bg-white/[0.02] even:bg-transparent"
              >
                <td className="sticky left-0 z-[1] bg-[hsl(var(--card))] px-4 py-4 align-top">
                  <p className="font-medium text-white">{item.employee.name ?? item.employee.email}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    #{index + 1} • {item.employee.department ?? "No department"}
                  </p>
                </td>
                <td className="px-4 py-4 text-zinc-200">{item.workingDays}</td>
                <td className="px-4 py-4 text-zinc-200">{item.presentDays}</td>
                <td className="px-4 py-4 text-zinc-200">{item.absentDays}</td>
                <td className="px-4 py-4 text-zinc-200">{item.leaveDays}</td>
                <td className="px-4 py-4 text-zinc-200">{item.halfDays}</td>
                <td className="px-4 py-4 text-zinc-200">{item.lateMarks}</td>
                <td className="px-4 py-4 text-zinc-200">{formatWorkingHours(item.totalWorkingMinutes)}</td>
              </tr>
            ))}
          </tbody>
          {summary.summary.length > 0 ? (
            <tfoot>
              <tr className="border-t border-primary/30 bg-primary/10 text-primary-foreground">
                <td className="sticky bottom-0 left-0 z-[2] bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  All Records Total
                </td>
                <td className="sticky bottom-0 bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  {summaryTotals.workingDays}
                </td>
                <td className="sticky bottom-0 bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  {summaryTotals.presentDays}
                </td>
                <td className="sticky bottom-0 bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  {summaryTotals.absentDays}
                </td>
                <td className="sticky bottom-0 bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  {summaryTotals.leaveDays}
                </td>
                <td className="sticky bottom-0 bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  {summaryTotals.halfDays}
                </td>
                <td className="sticky bottom-0 bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  {summaryTotals.lateMarks}
                </td>
                <td className="sticky bottom-0 bg-[hsl(var(--card))] px-4 py-4 font-semibold text-white">
                  {formatWorkingHours(summaryTotals.totalWorkingMinutes)}
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </TableCard>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <TableCard
          title="Company Holiday List"
          description="Employees can review the holiday list for the selected month here, and the same holidays are highlighted inside the attendance calendar."
        >
          {holidays.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-zinc-400">
              No company holidays are uploaded for {format(range.start, "MMMM yyyy")}. Weekly Sunday holidays still appear in the calendar.
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

        {canUploadHolidaySheet ? (
          <TableCard
            title="Holiday Upload"
            description="HR can upload the official holiday sheet for the company and download the sample Excel format from here."
          >
            <form action={uploadHolidayCalendar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-200">Holiday Excel Sheet</label>
                <input
                  name="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  required
                  className="mt-2 block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                />
              </div>
              <p className="text-sm leading-6 text-zinc-400">
                Upload the company holiday list with `Date`, `Title`, and optional `Description`. The calendar and holiday list update from this file.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Upload Holiday List
                </button>
                <a
                  href="/api/holidays/sample"
                  className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/5"
                >
                  Download Sample Excel
                </a>
              </div>
            </form>
          </TableCard>
        ) : null}
      </div>

      {selectedEmployee ? (
        <TableCard
          title={`Monthly Sheet: ${selectedEmployee.employee.name ?? selectedEmployee.employee.email}`}
          description="This calendar shows the full month layout with attendance status, approved leave, Sundays, and uploaded holidays."
        >
          <div className="mb-6 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Selected Month</p>
              <h3 className="mt-2 font-display text-3xl text-white">{format(range.start, "MMMM yyyy")}</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Organized month-wise calendar for {selectedEmployee.employee.name ?? selectedEmployee.employee.email}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`?month=${previousMonth}&employeeId=${selectedEmployee.employee.id}`}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
              >
                Previous Month
              </a>
              <a
                href={`?month=${format(new Date(), "yyyy-MM")}&employeeId=${selectedEmployee.employee.id}`}
                className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                Current Month
              </a>
              <a
                href={`?month=${nextMonth}&employeeId=${selectedEmployee.employee.id}`}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
              >
                Next Month
              </a>
            </div>
          </div>
          <AttendanceCalendar
            monthStart={range.start}
            monthEnd={range.end}
            holidayByDay={holidayByDay}
            statusByDay={statusByDay}
            isScheduledWorkingDay={isScheduledWorkingDay}
            isWeeklyHoliday={isWeeklyHoliday}
          />
        </TableCard>
      ) : null}
    </div>
  );
}
