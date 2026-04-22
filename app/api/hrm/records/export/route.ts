import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getHrmWorkspace } from "@/lib/hrm";
import { canAccessAdmin } from "@/lib/permissions";

function toCsvValue(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const employeeId = searchParams.get("employeeId") ?? undefined;
  const workspace = await getHrmWorkspace(
    { id: session.user.id, role: session.user.role },
    { employeeId }
  );

  const headers = [
    "Employee",
    "EmployeeCode",
    "Department",
    "Role",
    "BaseSalary",
    "Bonus",
    "GrossPay",
    "TaxAmount",
    "TotalDeductions",
    "NetPay",
    "KpiScore",
    "ReviewStatus",
    "PromotionReadiness",
    "AvailableDocuments"
  ];

  const rows = workspace.employees.map((employee) =>
    [
      employee.name,
      employee.employeeCode || "",
      employee.department ?? "",
      employee.role,
      employee.payroll.baseSalary,
      employee.payroll.bonus,
      employee.payroll.grossPay,
      employee.payroll.taxAmount,
      employee.payroll.totalDeductions,
      employee.payroll.netPay,
      employee.performance.kpiScore,
      employee.performance.reviewStatus,
      employee.performance.promotionReadiness,
      employee.documents.availableTypes.join(" | ")
    ]
      .map((value) => toCsvValue(value))
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hrm-workspace-records.csv"'
    }
  });
}
