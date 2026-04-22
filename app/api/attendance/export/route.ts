import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { format } from "date-fns";

import { auth } from "@/lib/auth";
import { getAttendanceLocation, getAttendanceRecords, getAttendanceSummary } from "@/lib/hr";
import { canExportAttendance } from "@/lib/permissions";

function toExportRows(records: Awaited<ReturnType<typeof getAttendanceRecords>>["records"]) {
  return records.map((record) => ({
    Employee: record.employee.name ?? record.employee.email,
    Department: record.employee.department ?? "",
    Role: record.employee.role,
    Date: format(record.date, "yyyy-MM-dd"),
    CheckIn: record.checkInTime?.toISOString() ?? "",
    CheckOut: record.checkOutTime?.toISOString() ?? "",
    WorkType: record.workType ?? "",
    Status: record.status,
    LateMark: record.isLate ? "Yes" : "No",
    WorkingMinutes: record.workingMinutes,
    CheckInAddress: getAttendanceLocation(record.location)?.checkIn?.address ?? "",
    CheckOutAddress: getAttendanceLocation(record.location)?.checkOut?.address ?? "",
    EditedBy: record.editedBy?.name ?? record.editedBy?.email ?? ""
  }));
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || !(await canExportAttendance(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const formatType = searchParams.get("format") ?? "csv";
  const filters = {
    month: searchParams.get("month") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    employeeId: searchParams.get("employeeId") ?? undefined,
    department: searchParams.get("department") ?? undefined,
    role: searchParams.get("role") ?? undefined
  };

  const [attendance, summary] = await Promise.all([
    getAttendanceRecords({ id: session.user.id, role: session.user.role }, filters),
    getAttendanceSummary({ id: session.user.id, role: session.user.role }, filters)
  ]);

  const rows = [
    ...toExportRows(attendance.records),
    ...summary.summary.map((item) => ({
      Employee: item.employee.name ?? item.employee.email,
      Department: item.employee.department ?? "",
      Role: item.employee.role,
      Date: "SUMMARY",
      CheckIn: "",
      CheckOut: "",
      WorkType: "",
      Status: `Present ${item.presentDays} | Absent ${item.absentDays} | Leave ${item.leaveDays} | Half ${item.halfDays}`,
      LateMark: String(item.lateMarks),
      WorkingMinutes: item.totalWorkingMinutes,
      CheckInAddress: "",
      CheckOutAddress: "",
      EditedBy: ""
    }))
  ];

  if (formatType === "xlsx") {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="attendance-report.xlsx"'
      }
    });
  }

  const headerKeys = Object.keys(rows[0] ?? {
    Employee: "",
    Department: "",
    Role: "",
    Date: "",
    CheckIn: "",
    CheckOut: "",
    WorkType: "",
    Status: "",
    LateMark: "",
    WorkingMinutes: "",
    CheckInAddress: "",
    CheckOutAddress: "",
    EditedBy: ""
  });

  const csv = [
    headerKeys.join(","),
    ...rows.map((row) =>
      headerKeys.map((key) => `"${String(row[key as keyof typeof row] ?? "").replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="attendance-report.csv"'
    }
  });
}
