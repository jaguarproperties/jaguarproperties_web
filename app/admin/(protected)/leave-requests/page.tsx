import { format } from "date-fns";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { LeaveBalanceForm } from "@/components/admin/leave-balance-form";
import { LeaveRequestActions } from "@/components/admin/leave-request-actions";
import { LeaveRequestForm } from "@/components/admin/leave-request-form";
import { StatCard } from "@/components/admin/stat-card";
import { TableCard } from "@/components/admin/table-card";
import { auth } from "@/lib/auth";
import { getLeaveRequests } from "@/lib/hr";
import { canAccessLeave, canApproveLeave, canManageAttendance } from "@/lib/permissions";

type SearchParams = {
  month?: string;
  from?: string;
  to?: string;
  employeeId?: string;
  department?: string;
  search?: string;
};

function getLeaveDurationLabel(duration?: string | null) {
  if (duration === "FIRST_HALF") return "First Half";
  if (duration === "SECOND_HALF") return "Second Half";
  return "Full Day";
}

export default async function LeaveRequestsPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth();
  if (!session?.user || !(await canAccessLeave(session.user.role))) {
    redirect("/admin");
  }
  const [canApproveLeavePermission, canManageAttendancePermission] = await Promise.all([
    canApproveLeave(session.user.role),
    canManageAttendance(session.user.role)
  ]);

  const filters = {
    month: searchParams?.month,
    from: searchParams?.from,
    to: searchParams?.to,
    employeeId: searchParams?.employeeId,
    department: searchParams?.department,
    search: searchParams?.search
  };

  const result = await getLeaveRequests({ id: session.user.id, role: session.user.role }, filters);
  const pendingCount = result.leaves.filter((leave) => leave.status === "PENDING").length;
  const approvedCount = result.leaves.filter((leave) => leave.status === "APPROVED").length;
  const rejectedCount = result.leaves.filter((leave) => leave.status === "REJECTED").length;
  const selfEmployee = result.employees.find((employee) => employee.id === session.user.id);
  const myLeaves = result.leaves.filter((leave) => leave.employeeId === session.user.id);
  const approvalQueue = result.leaves.filter(
    (leave) => canApproveLeavePermission && leave.employeeId !== session.user.id && leave.status === "PENDING"
  );
  const reviewHistory = result.leaves.filter(
    (leave) => leave.employeeId !== session.user.id && leave.status !== "PENDING"
  );
  const approvalSectionTitle =
    session.user.role === UserRole.MANAGER
      ? "Manager Approval Queue"
      : session.user.role === UserRole.HR
        ? "HR Approval Queue"
        : session.user.role === UserRole.ADMIN || session.user.role === UserRole.SUPER_ADMIN
          ? "Admin Approval Queue"
          : "Approval Queue";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">HR Management</p>
          <h1 className="mt-3 font-display text-5xl text-white">Leave Requests</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
            Employees can request leave here, managers can decide for their teams, and HR can manage balances and final
            corrections.
          </p>
        </div>

        <form className="grid gap-3 md:grid-cols-4">
          <input
            name="search"
            defaultValue={searchParams?.search ?? ""}
            placeholder="Search employee"
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-400"
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
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending" value={pendingCount} detail="Requests still awaiting a decision." />
        <StatCard label="Approved" value={approvedCount} detail="Requests approved in the selected range." />
        <StatCard label="Rejected" value={rejectedCount} detail="Requests rejected in the selected range." />
        <StatCard
          label="My Balance"
          value={selfEmployee?.leaveBalance ?? 0}
          detail="Current leave balance for your own account."
        />
      </div>

      <LeaveRequestForm />

      <TableCard title="My Leave Requests" description="Your own leave applications and their current status.">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-300">
            <tr>
              <th className="pb-3">Type</th>
              <th className="pb-3">Duration</th>
              <th className="pb-3">Dates</th>
              <th className="pb-3">Reason</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Remarks</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.length === 0 ? (
              <tr className="border-t border-white/10 text-zinc-200">
                <td colSpan={7} className="py-4 text-center text-zinc-400">
                  You have no leave requests for the current filters.
                </td>
              </tr>
            ) : (
              myLeaves.map((leave) => {
                const canCancel = leave.employeeId === session.user.id && leave.status === "PENDING";

                return (
                  <tr key={leave.id} className="border-t border-white/10 text-zinc-200 align-top">
                    <td className="py-4">{leave.leaveType}</td>
                    <td className="py-4">{getLeaveDurationLabel((leave as { leaveDuration?: string }).leaveDuration)}</td>
                    <td className="py-4">
                      {format(leave.startDate, "dd MMM yyyy")} to {format(leave.endDate, "dd MMM yyyy")}
                    </td>
                    <td className="py-4 text-xs leading-6 text-zinc-300">{leave.reason}</td>
                    <td className="py-4">
                      <p className="font-medium text-white">{leave.status}</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {leave.approvedBy?.name ?? leave.approvedBy?.email ?? "Awaiting action"}
                      </p>
                    </td>
                    <td className="py-4 text-xs leading-6 text-zinc-300">{leave.remarks ?? "—"}</td>
                    <td className="py-4">
                      {canCancel ? <LeaveRequestActions leaveId={leave.id} mode="cancel" /> : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </TableCard>

      {canApproveLeavePermission ? (
        <TableCard
          title={approvalSectionTitle}
          description="Pending leave requests that you can review and approve or reject in your current role."
        >
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-300">
              <tr>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvalQueue.length === 0 ? (
                <tr className="border-t border-white/10 text-zinc-200">
                  <td colSpan={6} className="py-4 text-center text-zinc-400">
                    No pending requests are waiting for your approval.
                  </td>
                </tr>
              ) : (
                approvalQueue.map((leave) => (
                  <tr key={leave.id} className="border-t border-white/10 text-zinc-200 align-top">
                    <td className="py-4">
                      <p className="font-medium text-white">{leave.employee.name ?? leave.employee.email}</p>
                      <p className="mt-1 text-xs text-zinc-400">{leave.employee.department ?? "No department"}</p>
                    </td>
                    <td className="py-4">{leave.leaveType}</td>
                    <td className="py-4">{getLeaveDurationLabel((leave as { leaveDuration?: string }).leaveDuration)}</td>
                    <td className="py-4">
                      {format(leave.startDate, "dd MMM yyyy")} to {format(leave.endDate, "dd MMM yyyy")}
                    </td>
                    <td className="py-4 text-xs leading-6 text-zinc-300">{leave.reason}</td>
                    <td className="py-4">
                      <LeaveRequestActions leaveId={leave.id} mode="approve" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableCard>
      ) : null}

      <TableCard title="Leave Review History" description="Processed leave decisions across the current visible scope.">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-300">
            <tr>
              <th className="pb-3">Employee</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Duration</th>
              <th className="pb-3">Dates</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {reviewHistory.length === 0 ? (
              <tr className="border-t border-white/10 text-zinc-200">
                <td colSpan={6} className="py-4 text-center text-zinc-400">
                  No reviewed leave requests found for the current filters.
                </td>
              </tr>
            ) : (
              reviewHistory.map((leave) => (
                <tr key={leave.id} className="border-t border-white/10 text-zinc-200 align-top">
                  <td className="py-4">
                    <p className="font-medium text-white">{leave.employee.name ?? leave.employee.email}</p>
                    <p className="mt-1 text-xs text-zinc-400">{leave.employee.department ?? "No department"}</p>
                  </td>
                  <td className="py-4">{leave.leaveType}</td>
                  <td className="py-4">{getLeaveDurationLabel((leave as { leaveDuration?: string }).leaveDuration)}</td>
                  <td className="py-4">
                    {format(leave.startDate, "dd MMM yyyy")} to {format(leave.endDate, "dd MMM yyyy")}
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-white">{leave.status}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {leave.approvedBy?.name ?? leave.approvedBy?.email ?? "System"}
                    </p>
                  </td>
                  <td className="py-4 text-xs leading-6 text-zinc-300">{leave.remarks ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>

      {canManageAttendancePermission ? (
        <TableCard title="Leave Balance Management">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-300">
              <tr>
                <th className="pb-3">Employee</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.employees.map((employee) => (
                <tr key={employee.id} className="border-t border-white/10 text-zinc-300 align-top">
                  <td className="py-4">
                    <p className="font-medium text-white">{employee.name ?? employee.email}</p>
                    <p className="mt-1 text-xs text-zinc-500">{employee.email}</p>
                  </td>
                  <td className="py-4">{employee.role}</td>
                  <td className="py-4">{employee.department ?? "—"}</td>
                  <td className="py-4">
                    <LeaveBalanceForm employeeId={employee.id} currentBalance={employee.leaveBalance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      ) : null}
    </div>
  );
}
