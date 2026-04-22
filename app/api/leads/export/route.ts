import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { exportLeadsCsv } from "@/app/actions";
import { auth } from "@/lib/auth";
import { canAccessLeads } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function getLeadRows(leads: Awaited<ReturnType<typeof prisma.lead.findMany>>) {
  return leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    City: lead.city ?? "",
    InquiryType: lead.inquiryType ?? "",
    Status: lead.status,
    Message: lead.message,
    CreatedAt: lead.createdAt.toISOString()
  }));
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canAccessLeads(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = new URL(request.url).searchParams.get("format") ?? "csv";

  if (format === "xlsx") {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    const worksheet = XLSX.utils.json_to_sheet(getLeadRows(leads));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="jaguar-leads.xlsx"'
      }
    });
  }

  const csv = await exportLeadsCsv();

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="jaguar-leads.csv"'
    }
  });
}
