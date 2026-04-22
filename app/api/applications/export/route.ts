import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { exportApplicationsCsv } from "@/app/actions";
import { auth } from "@/lib/auth";
import { canViewApplications } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function getApplicationRows(applications: Awaited<ReturnType<typeof prisma.jobApplication.findMany>>) {
  return applications.map((item) => ({
    Role: item.role,
    FullName: item.fullName,
    Email: item.email,
    Location: item.location,
    Phone: item.phone,
    JoinDate: item.joinDate.toISOString(),
    ResumeUrl: `/api/applications/${item.id}/resume`,
    ResumeName: item.resumeName,
    CreatedAt: item.createdAt.toISOString()
  }));
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canViewApplications(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = new URL(request.url).searchParams.get("format") ?? "csv";

  if (format === "xlsx") {
    const applications = await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } });
    const worksheet = XLSX.utils.json_to_sheet(getApplicationRows(applications));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="jaguar-job-applications.xlsx"'
      }
    });
  }

  const csv = await exportApplicationsCsv();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="jaguar-job-applications.csv"'
    }
  });
}
