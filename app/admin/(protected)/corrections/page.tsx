import Link from "next/link";

import { CorrectionsAttendanceManager } from "@/components/admin/corrections-attendance-manager";
import { TableCard } from "@/components/admin/table-card";
import { requireAdminSession } from "@/lib/admin-access";
import { getAttendanceRecords, getScopedEmployees } from "@/lib/hr";
import { canManageAttendance } from "@/lib/permissions";

export default async function CorrectionsPage() {
  const session = await requireAdminSession();
  const [employees, attendance, canManageAttendancePermission] = await Promise.all([
    getScopedEmployees({ id: session.user.id, role: session.user.role }),
    getAttendanceRecords({ id: session.user.id, role: session.user.role }),
    canManageAttendance(session.user.role)
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Access Control</p>
        <h1 className="mt-3 font-display text-5xl text-white">Corrections Workspace</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
          Edit attendance directly from this page. Existing rows can be updated from Edit, and Add Attendance is only
          needed when no record exists yet.
        </p>
      </div>

      {canManageAttendancePermission ? (
        <TableCard
          title="Attendance Punch & Status Correction"
          description="Use Edit for existing data, or Add Attendance when a record is missing. The employee ID shown here matches the exact MongoDB-linked employee ID."
        >
          <div className="space-y-4">
            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-5 text-sm leading-7 text-emerald-100">
              Every existing attendance row includes an edit option. When you save changes, the updated values replace the
              current database data for that employee and date. If no attendance record is available, click Add Attendance
              and enter the relevant details once.
            </div>

            <CorrectionsAttendanceManager
              employees={employees.map((employee) => ({
                id: employee.id,
                name: employee.name,
                email: employee.email,
                employeeCode: employee.employeeCode
              }))}
              records={attendance.records.map((record) => ({
                id: record.id,
                employeeId: record.employeeId,
                employeeCode: record.employee.employeeCode ?? null,
                employeeName: record.employee.name ?? record.employee.email,
                employeeEmail: record.employee.email,
                date: record.date.toISOString(),
                checkInTime: record.checkInTime?.toISOString() ?? null,
                checkOutTime: record.checkOutTime?.toISOString() ?? null,
                workType: record.workType ?? null,
                status: record.status,
                notes: record.editReason ?? null
              }))}
            />
          </div>
        </TableCard>
      ) : null}

      <div>
        <Link href="/admin/attendance" className="text-sm text-primary hover:underline">
          Open full attendance page
        </Link>
      </div>
    </div>
  );
}
