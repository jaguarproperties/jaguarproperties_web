import Link from "next/link";
import { WalletCards, FileText, TrendingUp, Upload, Printer } from "lucide-react";

import { uploadHrmLetterhead } from "@/app/actions";
import { HrmDocumentLauncher } from "@/components/admin/hrm-document-launcher";
import { HrmRecordFilter } from "@/components/admin/hrm-record-filter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/admin/stat-card";
import { TableCard } from "@/components/admin/table-card";
import { requireAdminSession } from "@/lib/admin-access";
import {
  getHrmWorkspace,
  hasHrmManagementAccess,
  hrmDocumentDefinitions
} from "@/lib/hrm";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function HrmWorkspacePage({
  searchParams
}: {
  searchParams?: {
    employeeId?: string;
    letterheadUpdated?: string;
    letterheadError?: string;
  };
}) {
  const session = await requireAdminSession();
  const canManage = hasHrmManagementAccess(session.user.role);
  const fullWorkspace = await getHrmWorkspace({ id: session.user.id, role: session.user.role });
  const selectedEmployeeId = canManage ? searchParams?.employeeId : session.user.id;
  const workspace = await getHrmWorkspace(
    { id: session.user.id, role: session.user.role },
    { employeeId: selectedEmployeeId }
  );
  const employeeOptions = canManage
    ? fullWorkspace.employees
    : fullWorkspace.employees.filter((employee) => employee.id === session.user.id);
  const visibleEmployees = workspace.employees;
  const selectedEmployee =
    selectedEmployeeId && selectedEmployeeId !== "all"
      ? employeeOptions.find((employee) => employee.id === selectedEmployeeId) ?? null
      : null;
  const uploadErrorMessage =
    searchParams?.letterheadError === "missing-file"
      ? "Please choose a sample letterhead image before uploading."
      : searchParams?.letterheadError === "invalid-file"
        ? "Please upload a PNG, JPG, WEBP, or SVG letterhead image."
        : searchParams?.letterheadError === "file-too-large"
          ? "Please upload a file smaller than 5 MB."
          : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">HRM Documents</p>
          <h1 className="mt-3 font-display text-5xl text-white">Payroll, Performance, and Documents</h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
            Manage salary calculation, payslips, bonuses, deductions, tax calculation, performance reviews, KPI
            tracking, appraisals, promotions, and employee document generation from one role-based workspace.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {canManage
              ? "HR and Admin accounts can generate, print, and download employee documents for the full authorized scope."
              : "Your account can open only the documents available for your employee ID. Management actions stay restricted to HR and Admin."}
          </p>
        </div>

        <Card className="max-w-md p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Letterhead Status</p>
          <div className="mt-4 space-y-2 text-sm text-zinc-300">
            <p className="font-semibold text-white">{workspace.letterhead.companyName}</p>
            <p>{workspace.letterhead.address}</p>
            <p>
              {workspace.letterhead.email} · {workspace.letterhead.phone}
            </p>
            <p className="pt-2 text-zinc-400">{workspace.letterhead.supportNote}</p>
          </div>
          {workspace.letterhead.sampleUrl ? (
            <div className="mt-5 rounded-[20px] border border-white/10 bg-white/5 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={workspace.letterhead.sampleUrl}
                alt="Uploaded HRM letterhead sample"
                className="max-h-44 w-full rounded-2xl object-contain"
              />
            </div>
          ) : null}
          {canManage ? (
            <form action={uploadHrmLetterhead} className="mt-5 space-y-3" encType="multipart/form-data">
              <label className="block text-sm font-semibold text-zinc-200">Upload Sample Letterhead</label>
              <Input name="file" type="file" accept=".png,.jpg,.jpeg,.webp,.svg" className="bg-white/5" required />
              <Button type="submit" variant="secondary" className="w-full">
                <Upload className="h-4 w-4" />
                Save Letterhead Sample
              </Button>
            </form>
          ) : null}
        </Card>
      </div>

      {searchParams?.letterheadUpdated ? (
        <div className="rounded-[24px] border border-emerald-400/25 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
          HRM letterhead sample uploaded successfully and will be used in printable documents.
        </div>
      ) : null}

      {uploadErrorMessage ? (
        <div className="rounded-[24px] border border-rose-400/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
          {uploadErrorMessage}
        </div>
      ) : null}

      <Card className="p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Record Filters</p>
            <h2 className="mt-3 font-display text-4xl text-white">All Employees or Individual Record</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
              Filter the HRM workspace for the full company scope or select one employee to view only that record.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/admin/hrm">
                <Printer className="h-4 w-4" />
                Reset Filter
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/api/hrm/records/export${selectedEmployeeId ? `?employeeId=${encodeURIComponent(selectedEmployeeId)}` : ""}`}>
                Download Records
              </Link>
            </Button>
          </div>
        </div>
        <HrmRecordFilter
          canManage={canManage}
          employeeOptions={employeeOptions.map((employee) => ({
            id: employee.id,
            name: employee.name,
            role: employee.role,
            employeeCode: employee.employeeCode,
            email: employee.email
          }))}
          selectedEmployeeId={selectedEmployeeId ?? (canManage ? "all" : employeeOptions[0]?.id)}
        />
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Employees In Scope"
          value={workspace.stats.employeesInScope}
          detail="Employees currently available in this HRM workspace scope."
        />
        <StatCard
          label="Net Payroll"
          value={formatMoney(workspace.stats.totalNetPayroll)}
          detail={`Estimated payroll for ${workspace.monthLabel} using role and attendance-aware calculations.`}
        />
        <StatCard
          label="Promo Ready"
          value={workspace.stats.promotionReadyCount}
          detail="Employees currently marked ready for promotion letters."
        />
        <StatCard
          label="Pending Docs"
          value={workspace.stats.pendingDocumentItems}
          detail="Missing document inputs or employee details still flagged in the HRM records."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {[
          {
            icon: WalletCards,
            title: "Payroll Management",
            items: ["Salary calculation", "Payslips", "Bonuses", "Deductions", "Tax calculation"]
          },
          {
            icon: TrendingUp,
            title: "Performance Management",
            items: ["Employee reviews", "KPI tracking", "Appraisals", "Promotions"]
          },
          {
            icon: FileText,
            title: "Document Management",
            items: ["Employee documents", "Offer letters", "Contracts", "Employee ID cards"]
          }
        ].map((section) => (
          <Card key={section.title} className="p-6">
            <section.icon className="h-10 w-10 text-primary" />
            <h2 className="mt-5 font-display text-3xl text-white">{section.title}</h2>
            <div className="mt-5 space-y-2 text-sm text-zinc-400">
              {section.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <TableCard
        title="Payroll Summary"
        description="Auto-calculated payroll figures are based on scoped employee records plus the current attendance cycle."
      >
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3">Employee</th>
              <th className="pb-3">Department</th>
              <th className="pb-3">Base Salary</th>
              <th className="pb-3">Bonus</th>
              <th className="pb-3">Deductions</th>
              <th className="pb-3">Tax</th>
              <th className="pb-3">Net Pay</th>
              <th className="pb-3">Payable Ratio</th>
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr key={employee.id} className="border-t border-white/10 text-zinc-300">
                <td className="py-3">
                  <p className="font-semibold text-white">{employee.name}</p>
                  <p className="text-xs text-zinc-500">{employee.employeeCode || "Employee code pending"}</p>
                </td>
                <td className="py-3">{employee.department ?? "Not assigned"}</td>
                <td className="py-3">{formatMoney(employee.payroll.baseSalary)}</td>
                <td className="py-3">{formatMoney(employee.payroll.bonus)}</td>
                <td className="py-3">{formatMoney(employee.payroll.totalDeductions)}</td>
                <td className="py-3">{formatMoney(employee.payroll.taxAmount)}</td>
                <td className="py-3 font-semibold text-white">{formatMoney(employee.payroll.netPay)}</td>
                <td className="py-3">{Math.round(employee.payroll.payableRatio * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <TableCard
        title="Performance Summary"
        description="KPI score, appraisal band, and promotion readiness are surfaced here for the active review cycle."
      >
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3">Employee</th>
              <th className="pb-3">KPI Score</th>
              <th className="pb-3">Review Status</th>
              <th className="pb-3">Appraisal Band</th>
              <th className="pb-3">Promotion Status</th>
              <th className="pb-3">Review Notes</th>
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr key={employee.id} className="border-t border-white/10 text-zinc-300">
                <td className="py-3">
                  <p className="font-semibold text-white">{employee.name}</p>
                  <p className="text-xs text-zinc-500">{employee.role}</p>
                </td>
                <td className="py-3">{employee.performance.kpiScore}%</td>
                <td className="py-3">{employee.performance.reviewStatus}</td>
                <td className="py-3">{employee.performance.appraisalBand}</td>
                <td className="py-3">{employee.performance.promotionReadiness}</td>
                <td className="py-3 text-zinc-400">{employee.performance.achievements[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <TableCard
        title="Document Availability"
        description="Employees can only download documents that are available for their ID. HR and Admin can generate for all visible employees."
      >
        <table className="min-w-[1040px] w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3">Employee</th>
              <th className="pb-3">Available Documents</th>
              <th className="pb-3">Pending Inputs</th>
              <th className="pb-3">Access</th>
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => (
              <tr key={employee.id} className="border-t border-white/10 text-zinc-300">
                <td className="py-3">
                  <p className="font-semibold text-white">{employee.name}</p>
                  <p className="text-xs text-zinc-500">{employee.email}</p>
                </td>
                <td className="py-3">{employee.documents.availableTypes.join(", ")}</td>
                <td className="py-3 text-zinc-400">
                  {employee.documents.pendingItems.length > 0
                    ? employee.documents.pendingItems.join(" ")
                    : "No pending document blockers."}
                </td>
                <td className="py-3">
                  {canManage ? "HR/Admin full access" : "Self-service only"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Generate Documents</p>
          <h2 className="mt-3 font-display text-4xl text-white">Print or Download on Letterhead</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-400">
            Each form asks only for the fields that HR needs to enter manually. The rest of the employee details are
            pulled from the existing HRM data in this workspace.
          </p>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-zinc-500">
            Payroll uses working-day proration from attendance, then applies tax, late deductions, and professional
            deductions once for a cleaner net-pay calculation.
          </p>
        </div>

        <HrmDocumentLauncher
          documents={hrmDocumentDefinitions}
          employees={visibleEmployees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            employeeCode: employee.employeeCode,
            email: employee.email
          }))}
          selectedEmployeeId={selectedEmployee?.id ?? employeeOptions[0]?.id}
        />
      </div>
    </div>
  );
}
