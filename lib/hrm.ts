import { MediaEntityType, UserRole } from "@prisma/client";
import { format } from "date-fns";

import { getSiteContent } from "@/lib/data";
import { getAttendanceSummary, getScopedEmployees, type ViewerSession } from "@/lib/hr";
import { prisma } from "@/lib/prisma";

export type HrmDocumentType =
  | "payslip"
  | "appraisal-letter"
  | "promotion-letter"
  | "offer-letter"
  | "contract"
  | "employee-id-card"
  | "id-proof";

export type HrmDocumentField = {
  name: string;
  label: string;
  type: "text" | "date" | "month" | "textarea";
  placeholder?: string;
  required?: boolean;
};

export type HrmDocumentDefinition = {
  type: HrmDocumentType;
  label: string;
  category: "Payroll" | "Performance" | "Documents";
  description: string;
  requiredFields: HrmDocumentField[];
};

type HrmPayrollRecord = {
  month: string;
  baseSalary: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  grossPay: number;
  taxAmount: number;
  absenceDeduction: number;
  lateDeduction: number;
  professionalDeduction: number;
  totalDeductions: number;
  netPay: number;
  payableRatio: number;
};

type HrmPerformanceRecord = {
  reviewCycle: string;
  kpiScore: number;
  reviewStatus: string;
  appraisalBand: string;
  promotionReadiness: string;
  achievements: string[];
};

type HrmDocumentRecord = {
  availableTypes: HrmDocumentType[];
  pendingItems: string[];
};

export type HrmEmployeeWorkspaceRecord = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  department: string | null;
  reportingManagerName: string | null;
  payroll: HrmPayrollRecord;
  performance: HrmPerformanceRecord;
  documents: HrmDocumentRecord;
};

export type HrmWorkspaceData = {
  month: string;
  monthLabel: string;
  letterhead: {
    companyName: string;
    address: string;
    email: string;
    phone: string;
    logoUrl: string;
    sampleUrl: string | null;
    supportNote: string;
  };
  stats: {
    employeesInScope: number;
    totalNetPayroll: number;
    pendingDocumentItems: number;
    promotionReadyCount: number;
  };
  employees: HrmEmployeeWorkspaceRecord[];
};

export type HrmWorkspaceFilters = {
  employeeId?: string;
};

export function filterHrmWorkspaceEmployees(
  workspace: HrmWorkspaceData,
  employeeId?: string
) {
  if (!employeeId || employeeId === "all") {
    return workspace;
  }

  const filteredEmployees = workspace.employees.filter((employee) => employee.id === employeeId);

  return {
    ...workspace,
    stats: {
      employeesInScope: filteredEmployees.length,
      totalNetPayroll: filteredEmployees.reduce((total, employee) => total + employee.payroll.netPay, 0),
      pendingDocumentItems: filteredEmployees.reduce((total, employee) => total + employee.documents.pendingItems.length, 0),
      promotionReadyCount: filteredEmployees.filter((employee) => employee.performance.promotionReadiness === "Recommended").length
    },
    employees: filteredEmployees
  };
}

export const hrmDocumentDefinitions: HrmDocumentDefinition[] = [
  {
    type: "payslip",
    label: "Salary Slip",
    category: "Payroll",
    description: "Calculates salary, bonuses, deductions, and tax for the selected employee and month.",
    requiredFields: [
      { name: "payrollMonth", label: "Payroll Month", type: "month", required: true },
      {
        name: "payrollNote",
        label: "Payroll Note",
        type: "textarea",
        placeholder: "Optional note for arrears, incentives, or payroll remarks."
      }
    ]
  },
  {
    type: "appraisal-letter",
    label: "Appraisal Letter",
    category: "Performance",
    description: "Generates an appraisal letter using KPI score, review band, and manager remarks.",
    requiredFields: [
      { name: "reviewPeriod", label: "Review Period", type: "text", required: true, placeholder: "Apr 2025 - Mar 2026" },
      {
        name: "appraisalSummary",
        label: "Appraisal Summary",
        type: "textarea",
        required: true,
        placeholder: "Summarize the review outcome, strengths, and expectations."
      }
    ]
  },
  {
    type: "promotion-letter",
    label: "Promotion Letter",
    category: "Performance",
    description: "Creates a promotion confirmation letter for employees marked ready in the review cycle.",
    requiredFields: [
      { name: "newTitle", label: "New Designation", type: "text", required: true, placeholder: "Senior HR Executive" },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true }
    ]
  },
  {
    type: "offer-letter",
    label: "Offer Letter",
    category: "Documents",
    description: "Generates a branded offer letter using employee data plus role-specific joining details.",
    requiredFields: [
      { name: "designation", label: "Designation", type: "text", required: true, placeholder: "Payroll Executive" },
      { name: "joiningDate", label: "Joining Date", type: "date", required: true },
      { name: "compensation", label: "Annual Compensation", type: "text", required: true, placeholder: "INR 6,80,000 CTC" }
    ]
  },
  {
    type: "contract",
    label: "Employment Contract",
    category: "Documents",
    description: "Builds a printable employment contract with the selected dates and terms.",
    requiredFields: [
      { name: "contractStart", label: "Contract Start", type: "date", required: true },
      { name: "contractEnd", label: "Contract End", type: "date", required: true },
      {
        name: "contractTerms",
        label: "Terms",
        type: "textarea",
        required: true,
        placeholder: "Add role scope, notice period, confidentiality, or other terms."
      }
    ]
  },
  {
    type: "employee-id-card",
    label: "Employee ID Card",
    category: "Documents",
    description: "Creates a company-style employee ID card with only the essential identification details.",
    requiredFields: [
      { name: "validUntil", label: "Valid Until", type: "date", required: true },
      {
        name: "emergencyContact",
        label: "Emergency Contact",
        type: "text",
        required: true,
        placeholder: "+91 98765 43210"
      },
      {
        name: "bloodGroup",
        label: "Blood Group",
        type: "text",
        placeholder: "B+"
      }
    ]
  },
  {
    type: "id-proof",
    label: "ID Proof Acknowledgement",
    category: "Documents",
    description: "Issues a receipt-style acknowledgement for employee identity documents.",
    requiredFields: [
      { name: "documentName", label: "Document Name", type: "text", required: true, placeholder: "Aadhaar Card" },
      { name: "documentId", label: "Document Number", type: "text", required: true, placeholder: "XXXX-XXXX-1234" },
      { name: "issuedDate", label: "Received Date", type: "date", required: true }
    ]
  }
];

const COMPANY_ROLES_WITH_MANAGEMENT_ACCESS = new Set<UserRole>(["SUPER_ADMIN", "ADMIN", "HR"]);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getRoleSummary(role: UserRole, department: string | null) {
  const departmentLabel = department ?? "Operations";

  switch (role) {
    case "HR":
      return {
        workSummary: `The employee contributes to ${departmentLabel} operations by supporting hiring coordination, employee engagement, attendance governance, and people-process compliance.`,
        responsibilities: [
          "Maintain employee records, attendance follow-up, and leave workflow accuracy.",
          "Coordinate recruitment, onboarding, employee communication, and HR documentation.",
          "Support appraisal cycles, internal policy alignment, and day-to-day people operations."
        ]
      };
    case "ADMIN":
      return {
        workSummary: `The employee supports ${departmentLabel} administration by coordinating operational control, internal approvals, workforce reporting, and business-process continuity.`,
        responsibilities: [
          "Oversee daily operations, approvals, and internal coordination across business teams.",
          "Review workforce records, reporting visibility, and administrative documentation.",
          "Support timely execution of compliance, communication, and management decisions."
        ]
      };
    case "MANAGER":
      return {
        workSummary: `The employee leads ${departmentLabel} execution by guiding team performance, delivery discipline, and reporting visibility across assigned functions.`,
        responsibilities: [
          "Manage team execution, productivity follow-up, and cross-functional coordination.",
          "Review employee performance, working priorities, and operational escalations.",
          "Drive accountability against monthly goals, quality benchmarks, and business timelines."
        ]
      };
    case "DEVELOPER":
      return {
        workSummary: `The employee contributes to ${departmentLabel} systems delivery through platform improvements, implementation support, and dependable technical execution.`,
        responsibilities: [
          "Build and maintain application features, integrations, and business workflow tooling.",
          "Support bug fixes, optimization, and reliability improvements across internal systems.",
          "Collaborate with operations teams to convert business requirements into working software."
        ]
      };
    case "DIGITAL":
      return {
        workSummary: `The employee supports ${departmentLabel} growth by managing digital communication, brand visibility, and campaign execution across channels.`,
        responsibilities: [
          "Coordinate content, digital campaigns, and audience communication workflows.",
          "Maintain brand consistency across internal updates and public-facing materials.",
          "Track execution quality, publishing cadence, and campaign support deliverables."
        ]
      };
    case "EMPLOYEE":
    default:
      return {
        workSummary: `The employee contributes to ${departmentLabel} work through assigned deliverables, daily process execution, and coordination with the reporting manager and team.`,
        responsibilities: [
          "Complete assigned work with accuracy, timeliness, and process discipline.",
          "Coordinate with the reporting manager on priorities, progress, and issue resolution.",
          "Support team goals, documentation, and day-to-day operational continuity."
        ]
      };
  }
}

function getBaseSalary(role: UserRole, department: string | null) {
  const departmentKey = department?.toLowerCase() ?? "";
  const departmentBoost =
    departmentKey.includes("sales") || departmentKey.includes("business")
      ? 9000
      : departmentKey.includes("human") || departmentKey.includes("hr")
        ? 7000
        : departmentKey.includes("digital") || departmentKey.includes("marketing")
          ? 8000
          : 5000;

  switch (role) {
    case "SUPER_ADMIN":
      return 90000 + departmentBoost;
    case "ADMIN":
      return 65000 + departmentBoost;
    case "HR":
      return 52000 + departmentBoost;
    case "MANAGER":
      return 58000 + departmentBoost;
    case "DEVELOPER":
      return 62000 + departmentBoost;
    case "DIGITAL":
      return 50000 + departmentBoost;
    case "EMPLOYEE":
    default:
      return 32000 + departmentBoost;
  }
}

function getDocumentAvailability(record: {
  employeeCode: string;
  phone: string | null;
  performance: HrmPerformanceRecord;
}) {
  const availableTypes: HrmDocumentType[] = [
    "payslip",
    "appraisal-letter",
    "offer-letter",
    "contract"
  ];

  if (record.phone) {
    availableTypes.push("employee-id-card");
    availableTypes.push("id-proof");
  }

  if (record.performance.promotionReadiness === "Recommended") {
    availableTypes.push("promotion-letter");
  }

  const pendingItems = [
    !record.phone ? "Phone number missing for employee ID card and ID-proof acknowledgement." : null,
    !record.employeeCode ? "Employee code missing for branded document indexing." : null,
    record.performance.promotionReadiness === "Review cycle"
      ? "Promotion letter is pending final approval."
      : null
  ].filter(Boolean) as string[];

  return {
    availableTypes,
    pendingItems
  };
}

async function getFallbackEmployees(viewer: ViewerSession) {
  const fallbackRecord = {
    id: viewer.id,
    employeeCode: "JP2026A0001",
    name: "Jaguar Admin",
    email: "admin@jaguarproperties.in",
    phone: "+91 78299 56789",
    role: viewer.role,
    department: "Operations",
    reportingManagerName: null
  };

  return [fallbackRecord];
}

async function getEmployeesInScope(viewer: ViewerSession) {
  try {
    const scoped = await getScopedEmployees(viewer);
    if (scoped.length > 0) {
      return scoped.map((employee) => ({
        id: employee.id,
        employeeCode: "employeeCode" in employee ? String((employee as { employeeCode?: string }).employeeCode ?? "") : "",
        name: employee.name ?? employee.email,
        email: employee.email,
        phone: "phone" in employee ? ((employee as { phone?: string | null }).phone ?? null) : null,
        role: employee.role,
        department: employee.department ?? null,
        reportingManagerName: employee.reportingManagerName ?? null
      }));
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("HRM workspace is using fallback employee data.", error);
    }
  }

  return getFallbackEmployees(viewer);
}

async function getMonthlyAttendanceMap(viewer: ViewerSession, month: string) {
  try {
    const summary = await getAttendanceSummary(viewer, { month });
    return new Map(summary.summary.map((item) => [item.employee.id, item]));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("HRM workspace is using fallback attendance data.", error);
    }
    return new Map();
  }
}

async function getStoredLetterheadSample(siteContentId?: string | null) {
  if (!process.env.DATABASE_URL || !siteContentId) {
    return null;
  }

  try {
    const media = await prisma.media.findFirst({
      where: {
        entityType: MediaEntityType.SITE_CONTENT,
        contentId: siteContentId,
        alt: "HRM_LETTERHEAD_SAMPLE"
      },
      orderBy: { createdAt: "desc" },
      select: {
        url: true
      }
    });

    return media?.url ?? null;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to read stored HRM letterhead sample.", error);
    }
    return null;
  }
}

export function hasHrmManagementAccess(role: UserRole) {
  return COMPANY_ROLES_WITH_MANAGEMENT_ACCESS.has(role);
}

export function isHrmDocumentType(value: string): value is HrmDocumentType {
  return hrmDocumentDefinitions.some((item) => item.type === value);
}

export function getHrmDocumentDefinition(type: HrmDocumentType) {
  return hrmDocumentDefinitions.find((item) => item.type === type) ?? hrmDocumentDefinitions[0];
}

export async function getHrmDocumentContext(
  viewer: ViewerSession,
  type: HrmDocumentType,
  employeeId: string
) {
  const workspace = await getHrmWorkspace(viewer);
  const employee = workspace.employees.find((item) => item.id === employeeId);

  if (!employee) {
    throw new Error("Employee not found in the current access scope.");
  }

  if (!hasHrmManagementAccess(viewer.role)) {
    if (employee.id !== viewer.id) {
      throw new Error("You can download documents only for your own employee ID.");
    }

    if (!employee.documents.availableTypes.includes(type)) {
      throw new Error("This document is not available for your account.");
    }
  }

  return { workspace, employee };
}

export async function getHrmWorkspace(
  viewer: ViewerSession,
  filters: HrmWorkspaceFilters = {}
): Promise<HrmWorkspaceData> {
  const month = format(new Date(), "yyyy-MM");
  const monthLabel = format(new Date(), "MMMM yyyy");
  const [siteContent, employees, attendanceByEmployee] = await Promise.all([
    getSiteContent(),
    getEmployeesInScope(viewer),
    getMonthlyAttendanceMap(viewer, month)
  ]);
  const letterheadSampleUrl = await getStoredLetterheadSample(siteContent?.id ?? null);

  const records = employees.map((employee) => {
    const attendance = attendanceByEmployee.get(employee.id);
    const workingDays = attendance?.workingDays ?? 26;
    const presentUnits =
      (attendance?.presentDays ?? Math.max(workingDays - 2, 22)) +
      (attendance?.leaveDays ?? 1) +
      (attendance?.halfDays ?? 0) * 0.5;
    const payableRatio = workingDays > 0 ? clamp(presentUnits / workingDays, 0.65, 1) : 1;
    const baseSalary = getBaseSalary(employee.role, employee.department);
    const hra = 0;
    const specialAllowance = 0;
    const bonus = 0;
    const grossPay = baseSalary + hra + specialAllowance + bonus;
    const proratedGrossPay = Math.round(grossPay * payableRatio);
    const absenceDeduction = Math.max(grossPay - proratedGrossPay, 0);
    const lateDeduction = Math.round((attendance?.lateMarks ?? 1) * 350);
    const professionalDeduction = 200;
    const taxAmount = Math.round(proratedGrossPay * 0.08);
    const totalDeductions = Math.round(absenceDeduction + lateDeduction + professionalDeduction + taxAmount);
    const netPay = Math.max(Math.round(proratedGrossPay - taxAmount - professionalDeduction - lateDeduction), 0);
    const kpiScore = clamp(
      Math.round(72 + payableRatio * 18 - (attendance?.lateMarks ?? 0) * 1.5 - (attendance?.absentDays ?? 0) * 2),
      58,
      97
    );
    const performance: HrmPerformanceRecord = {
      reviewCycle: "Annual Review",
      kpiScore,
      reviewStatus: kpiScore >= 88 ? "Exceeds expectations" : kpiScore >= 76 ? "On track" : "Needs coaching",
      appraisalBand: kpiScore >= 90 ? "A" : kpiScore >= 80 ? "B+" : kpiScore >= 70 ? "B" : "C",
      promotionReadiness: kpiScore >= 88 ? "Recommended" : kpiScore >= 76 ? "Review cycle" : "Not ready",
      achievements: [
        `Attendance compliance at ${formatPercent(payableRatio)} for ${monthLabel}.`,
        `${attendance?.lateMarks ?? 0} late marks reviewed in the current cycle.`,
        `${attendance?.presentDays ?? Math.max(workingDays - 2, 22)} attended workdays captured in the HRM summary.`
      ]
    };
    const documents = getDocumentAvailability({
      employeeCode: employee.employeeCode,
      phone: employee.phone,
      performance
    });

    return {
      ...employee,
      payroll: {
        month,
        baseSalary,
        hra,
        specialAllowance,
        bonus,
        grossPay,
        taxAmount,
        absenceDeduction,
        lateDeduction,
        professionalDeduction,
        totalDeductions,
        netPay,
        payableRatio
      },
      performance,
      documents
    };
  });
  return filterHrmWorkspaceEmployees({
    month,
    monthLabel,
    letterhead: {
      companyName: siteContent?.footerCopyright?.replace(/^©\s*\d{4}\s*/u, "").split(".")[0]?.trim() || "Jaguar Properties",
      address: siteContent?.officeAddress ?? "5, First Main Road, Second Floor, KHB Layout, Yelahanka New Town, Bengaluru",
      email: siteContent?.contactEmail ?? "info@jaguarproperties.in",
      phone: siteContent?.contactPhone ?? "+91 78299 56789",
      logoUrl: "/images/jaguar-properties-logo.svg",
      sampleUrl: letterheadSampleUrl,
      supportNote: "Letterhead details are pulled into every generated HRM document automatically."
    },
    stats: {
      employeesInScope: records.length,
      totalNetPayroll: records.reduce((total, employee) => total + employee.payroll.netPay, 0),
      pendingDocumentItems: records.reduce((total, employee) => total + employee.documents.pendingItems.length, 0),
      promotionReadyCount: records.filter((employee) => employee.performance.promotionReadiness === "Recommended").length
    },
    employees: records
  }, filters.employeeId);
}

function sanitizeFilePart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderKeyValueRows(rows: Array<{ label: string; value: string }>) {
  return rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.label)}</td>
          <td>${escapeHtml(row.value)}</td>
        </tr>
      `
    )
    .join("");
}

function renderDocumentBody(
  type: HrmDocumentType,
  employee: HrmEmployeeWorkspaceRecord,
  workspace: HrmWorkspaceData,
  inputs: Record<string, string>
) {
  const payrollMonth = inputs.payrollMonth || workspace.month;
  const issueDate = format(new Date(), "dd MMM yyyy");
  const roleSummary = getRoleSummary(employee.role, employee.department);
  const overviewRows = [
    { label: "Employee", value: employee.name },
    { label: "Employee Code", value: employee.employeeCode || "Pending" },
    { label: "Department", value: employee.department ?? "Not assigned" },
    { label: "Designation / Role", value: employee.role },
    { label: "Official Email", value: employee.email }
  ];

  if (type === "employee-id-card") {
    const employeeInitials = employee.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

    return `
      <div class="id-card-shell">
        <div class="id-card">
          <div class="id-card-top">
            <div>
              <p class="id-card-brand">${escapeHtml(workspace.letterhead.companyName)}</p>
              <p class="id-card-subtitle">Employee Identity Card</p>
            </div>
            <img src="${escapeHtml(workspace.letterhead.logoUrl)}" alt="${escapeHtml(workspace.letterhead.companyName)} logo" />
          </div>
          <div class="id-card-body">
            <div class="id-card-avatar">${escapeHtml(employeeInitials || "JP")}</div>
            <div class="id-card-main">
              <h1>${escapeHtml(employee.name)}</h1>
              <p>${escapeHtml(employee.role)}</p>
              <div class="id-card-grid">
                <div><span>Employee ID</span><strong>${escapeHtml(employee.employeeCode || "Pending")}</strong></div>
                <div><span>Department</span><strong>${escapeHtml(employee.department ?? "Operations")}</strong></div>
                <div><span>Phone</span><strong>${escapeHtml(employee.phone ?? "Pending")}</strong></div>
                <div><span>Valid Until</span><strong>${escapeHtml(inputs.validUntil || issueDate)}</strong></div>
                <div><span>Blood Group</span><strong>${escapeHtml(inputs.bloodGroup || "N/A")}</strong></div>
                <div><span>Emergency</span><strong>${escapeHtml(inputs.emergencyContact || "Pending")}</strong></div>
              </div>
            </div>
          </div>
          <div class="id-card-footer">
            <p>This card remains the property of ${escapeHtml(workspace.letterhead.companyName)} and must be carried during official duty.</p>
          </div>
        </div>
      </div>
    `;
  }

  if (type === "payslip") {
    return `
      <h1>${escapeHtml(getHrmDocumentDefinition(type).label)}</h1>
      <p class="lede">This salary slip is issued for the payroll month of ${escapeHtml(payrollMonth)} and reflects the approved salary structure, attendance-linked proration, and statutory deductions applicable for the period.</p>
      <p>${escapeHtml(roleSummary.workSummary)}</p>
      <div class="grid two">
        <table>${renderKeyValueRows(overviewRows)}</table>
        <table>
          ${renderKeyValueRows([
            { label: "Payroll Month", value: payrollMonth },
            { label: "Payable Ratio", value: formatPercent(employee.payroll.payableRatio) },
            { label: "Gross Pay", value: formatMoney(employee.payroll.grossPay) },
            { label: "Net Pay", value: formatMoney(employee.payroll.netPay) }
          ])}
        </table>
      </div>
      <h2>Salary Calculation</h2>
      <table>
        ${renderKeyValueRows([
          { label: "Base Salary", value: formatMoney(employee.payroll.baseSalary) },
          { label: "House Rent Allowance", value: formatMoney(employee.payroll.hra) },
          { label: "Special Allowance", value: formatMoney(employee.payroll.specialAllowance) },
          { label: "Bonus / Variable Pay", value: formatMoney(employee.payroll.bonus) },
          { label: "Tax Calculation", value: formatMoney(employee.payroll.taxAmount) },
          { label: "Absence Deduction", value: formatMoney(employee.payroll.absenceDeduction) },
          { label: "Late Mark Deduction", value: formatMoney(employee.payroll.lateDeduction) },
          { label: "Professional Deduction", value: formatMoney(employee.payroll.professionalDeduction) },
          { label: "Total Deductions", value: formatMoney(employee.payroll.totalDeductions) },
          { label: "Net Payable", value: formatMoney(employee.payroll.netPay) }
        ])}
      </table>
      <h2>Work Summary</h2>
      <p>${escapeHtml(roleSummary.workSummary)}</p>
      <h2>Key Responsibilities</h2>
      <ul>${roleSummary.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      ${
        inputs.payrollNote
          ? `<h2>Payroll Note</h2><p>${escapeHtml(inputs.payrollNote)}</p>`
          : ""
      }
    `;
  }

  if (type === "appraisal-letter") {
    return `
      <h1>${escapeHtml(getHrmDocumentDefinition(type).label)}</h1>
      <p class="lede">This appraisal letter records the performance review outcome for ${escapeHtml(inputs.reviewPeriod || employee.performance.reviewCycle)} and recognizes the employee’s contribution to current business priorities.</p>
      <p>${escapeHtml(roleSummary.workSummary)}</p>
      <table>${renderKeyValueRows(overviewRows)}</table>
      <h2>Review Outcome</h2>
      <table>
        ${renderKeyValueRows([
          { label: "Review Period", value: inputs.reviewPeriod || employee.performance.reviewCycle },
          { label: "KPI Score", value: `${employee.performance.kpiScore}%` },
          { label: "Review Status", value: employee.performance.reviewStatus },
          { label: "Appraisal Band", value: employee.performance.appraisalBand },
          { label: "Promotion Readiness", value: employee.performance.promotionReadiness }
        ])}
      </table>
      <h2>Appraisal Summary</h2>
      <p>${escapeHtml(inputs.appraisalSummary || "Performance reviewed successfully.")}</p>
      <h2>Key Responsibilities Considered</h2>
      <ul>${roleSummary.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <h2>Key Highlights</h2>
      <ul>${employee.performance.achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    `;
  }

  if (type === "promotion-letter") {
    return `
      <h1>${escapeHtml(getHrmDocumentDefinition(type).label)}</h1>
      <p class="lede">Based on the latest appraisal cycle, Jaguar Properties is pleased to issue this promotion letter in recognition of the employee’s performance, accountability, and contribution to team goals.</p>
      <p>${escapeHtml(roleSummary.workSummary)}</p>
      <table>${renderKeyValueRows(overviewRows)}</table>
      <h2>Promotion Details</h2>
      <table>
        ${renderKeyValueRows([
          { label: "New Designation", value: inputs.newTitle || "Updated designation" },
          { label: "Effective Date", value: inputs.effectiveDate || issueDate },
          { label: "KPI Score", value: `${employee.performance.kpiScore}%` },
          { label: "Current Review Status", value: employee.performance.reviewStatus }
        ])}
      </table>
      <p>The employee has been assessed as <strong>${escapeHtml(employee.performance.promotionReadiness)}</strong> in the current cycle, and this update reflects continued trust in the employee’s ability to handle higher responsibility.</p>
      <h2>Key Responsibilities</h2>
      <ul>${roleSummary.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    `;
  }

  if (type === "offer-letter") {
    return `
      <h1>${escapeHtml(getHrmDocumentDefinition(type).label)}</h1>
      <p class="lede">Jaguar Properties is pleased to confirm the offer details below. This letter outlines the proposed role, reporting structure, and the broad responsibility areas expected from the employee on joining.</p>
      <table>${renderKeyValueRows(overviewRows)}</table>
      <h2>Offer Details</h2>
      <table>
        ${renderKeyValueRows([
          { label: "Designation", value: inputs.designation || employee.role },
          { label: "Joining Date", value: inputs.joiningDate || issueDate },
          { label: "Annual Compensation", value: inputs.compensation || formatMoney(employee.payroll.netPay * 12) },
          { label: "Reporting Manager", value: employee.reportingManagerName ?? "Assigned by HR" }
        ])}
      </table>
      <h2>Role Overview</h2>
      <p>${escapeHtml(roleSummary.workSummary)}</p>
      <h2>Key Responsibilities</h2>
      <ul>${roleSummary.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p>This offer is subject to company policy, document verification, onboarding completion, and role-specific compliance requirements.</p>
    `;
  }

  if (type === "contract") {
    return `
      <h1>${escapeHtml(getHrmDocumentDefinition(type).label)}</h1>
      <p class="lede">This employment contract summary is issued on the official company letterhead and records the broad terms, role scope, and responsibility expectations applicable to the employee.</p>
      <table>${renderKeyValueRows(overviewRows)}</table>
      <h2>Contract Terms</h2>
      <table>
        ${renderKeyValueRows([
          { label: "Contract Start", value: inputs.contractStart || issueDate },
          { label: "Contract End", value: inputs.contractEnd || "Until revised by HR" },
          { label: "Role", value: employee.role },
          { label: "Department", value: employee.department ?? "Operations" }
        ])}
      </table>
      <h2>Role Overview</h2>
      <p>${escapeHtml(roleSummary.workSummary)}</p>
      <h2>Key Responsibilities</h2>
      <ul>${roleSummary.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p>${escapeHtml(inputs.contractTerms || "Standard employment terms, notice period, and confidentiality obligations apply.")}</p>
    `;
  }

  return `
    <h1>${escapeHtml(getHrmDocumentDefinition(type).label)}</h1>
    <p class="lede">This acknowledgement confirms that the employee document listed below has been received and noted by HR for record and verification purposes.</p>
    <table>${renderKeyValueRows(overviewRows)}</table>
    <h2>Document Receipt</h2>
    <table>
      ${renderKeyValueRows([
        { label: "Document Name", value: inputs.documentName || "Identity Document" },
        { label: "Document Number", value: inputs.documentId || "Pending" },
        { label: "Received Date", value: inputs.issuedDate || issueDate },
        { label: "Employee Phone", value: employee.phone ?? "Pending update" }
      ])}
    </table>
    <h2>Role Overview</h2>
    <p>${escapeHtml(roleSummary.workSummary)}</p>
  `;
}

export async function buildHrmDocument(
  viewer: ViewerSession,
  type: HrmDocumentType,
  employeeId: string,
  inputs: Record<string, string>
) {
  const { workspace, employee } = await getHrmDocumentContext(viewer, type, employeeId);

  const label = getHrmDocumentDefinition(type).label;
  const fileName = `${sanitizeFilePart(label)}-${sanitizeFilePart(employee.name)}-${workspace.month}.html`;
  const body = renderDocumentBody(type, employee, workspace, inputs);
  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(label)} - ${escapeHtml(employee.name)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #f4efe6;
            color: #201815;
            font-family: Georgia, "Times New Roman", serif;
            line-height: 1.6;
          }
          .page {
            width: min(960px, calc(100vw - 32px));
            margin: 24px auto;
            background: #fffdf9;
            border: 1px solid #e6d8bf;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 24px 80px rgba(26, 18, 8, 0.12);
          }
          .letterhead {
            padding: 28px 36px;
            background: linear-gradient(135deg, #f7f1e5 0%, #f0ddaa 100%);
            border-bottom: 1px solid #e5cf95;
          }
          .brand {
            display: flex;
            gap: 20px;
            align-items: center;
            justify-content: space-between;
          }
          .brand-copy {
            max-width: 70%;
          }
          .brand h2 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .brand p {
            margin: 6px 0 0;
            font-size: 13px;
          }
          .brand img {
            width: 110px;
            max-height: 72px;
            object-fit: contain;
          }
          .content {
            padding: 32px 36px 40px;
          }
          h1 {
            margin: 0;
            font-size: 34px;
          }
          h2 {
            margin: 28px 0 10px;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .lede {
            margin-top: 10px;
            font-size: 15px;
          }
          .meta {
            display: flex;
            gap: 18px;
            flex-wrap: wrap;
            margin-top: 18px;
            color: #6b5840;
            font-size: 13px;
          }
          .grid.two {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }
          td {
            border: 1px solid #eadfca;
            padding: 10px 12px;
            vertical-align: top;
            font-size: 14px;
          }
          td:first-child {
            width: 42%;
            color: #6b5840;
            font-weight: 700;
          }
          ul {
            margin: 8px 0 0;
            padding-left: 20px;
          }
          .footer {
            padding: 20px 36px 34px;
            color: #6b5840;
            font-size: 13px;
          }
          .id-card-shell {
            margin-top: 24px;
            display: flex;
            justify-content: center;
          }
          .id-card {
            width: min(100%, 540px);
            border-radius: 28px;
            overflow: hidden;
            border: 1px solid #d8bf8a;
            background: linear-gradient(180deg, #1d1814 0%, #11100f 100%);
            color: #fff8eb;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
          }
          .id-card-top {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: center;
            padding: 20px 24px;
            background: linear-gradient(135deg, #d9b267 0%, #b88d3b 100%);
            color: #1b140d;
          }
          .id-card-top img {
            width: 72px;
            height: 72px;
            object-fit: contain;
          }
          .id-card-brand {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .id-card-subtitle {
            margin: 6px 0 0;
            font-size: 12px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .id-card-body {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 20px;
            padding: 24px;
            align-items: start;
          }
          .id-card-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 140px;
            border-radius: 22px;
            background: linear-gradient(180deg, #f6dfb0 0%, #d6ae61 100%);
            color: #23180c;
            font-size: 38px;
            font-weight: 700;
          }
          .id-card-main h1 {
            margin: 0;
            font-size: 28px;
            color: #ffffff;
          }
          .id-card-main > p {
            margin: 6px 0 0;
            color: #d5c0a0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
          }
          .id-card-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-top: 18px;
          }
          .id-card-grid div {
            padding: 12px 14px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
          .id-card-grid span {
            display: block;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #c5b08c;
          }
          .id-card-grid strong {
            display: block;
            margin-top: 7px;
            font-size: 14px;
            color: #fff8eb;
          }
          .id-card-footer {
            padding: 0 24px 22px;
            font-size: 12px;
            color: #c9b798;
          }
          .signature {
            margin-top: 36px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
            align-items: end;
          }
          .signature-box {
            border-top: 1px solid #bca57a;
            padding-top: 10px;
            min-height: 78px;
          }
          .signature-name {
            font-weight: 700;
            color: #201815;
          }
          .signature-role {
            font-size: 12px;
            color: #6b5840;
          }
          @media print {
            body {
              background: #ffffff;
            }
            .page {
              width: 100%;
              margin: 0;
              box-shadow: none;
              border-radius: 0;
              border: none;
            }
          }
          @media (max-width: 720px) {
            .grid.two {
              grid-template-columns: 1fr;
            }
            .id-card-body {
              grid-template-columns: 1fr;
            }
            .id-card-avatar {
              width: 100%;
              max-width: 140px;
              margin: 0 auto;
            }
            .id-card-grid {
              grid-template-columns: 1fr;
            }
            .signature {
              grid-template-columns: 1fr;
            }
            .brand {
              align-items: flex-start;
              flex-direction: column-reverse;
            }
            .brand-copy {
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <main class="page">
          <section class="letterhead">
            <div class="brand">
              <div class="brand-copy">
                <h2>${escapeHtml(workspace.letterhead.companyName)}</h2>
                <p>${escapeHtml(workspace.letterhead.address)}</p>
                <p>Email: ${escapeHtml(workspace.letterhead.email)} | Phone: ${escapeHtml(workspace.letterhead.phone)}</p>
              </div>
              <img src="${escapeHtml(workspace.letterhead.logoUrl)}" alt="${escapeHtml(workspace.letterhead.companyName)} logo" />
            </div>
            ${
              workspace.letterhead.sampleUrl
                ? `<div style="margin-top:18px;border-top:1px solid #e5cf95;padding-top:18px;"><img src="${escapeHtml(
                    workspace.letterhead.sampleUrl
                  )}" alt="Uploaded HRM letterhead sample" style="width:100%;max-height:180px;object-fit:contain;border-radius:16px;background:#fff8e9;padding:8px;" /></div>`
                : ""
            }
          </section>
          <section class="content">
            <div class="meta">
              <span>Issued: ${escapeHtml(format(new Date(), "dd MMM yyyy"))}</span>
              <span>Generated via HRM Workspace</span>
              <span>Employee ID: ${escapeHtml(employee.employeeCode || "Pending")}</span>
            </div>
            ${body}
            ${
              type === "employee-id-card"
                ? ""
                : `<div class="signature">
              <div class="signature-box">
                <div class="signature-name">${escapeHtml(employee.name)}</div>
                <div class="signature-role">Employee Acknowledgement</div>
              </div>
              <div class="signature-box">
                <div class="signature-name">HR Department</div>
                <div class="signature-role">${escapeHtml(workspace.letterhead.companyName)}</div>
              </div>
            </div>`
            }
          </section>
          <section class="footer">
            ${escapeHtml(workspace.letterhead.supportNote)}
          </section>
        </main>
      </body>
    </html>
  `;

  return {
    fileName,
    html
  };
}
