import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { HOLIDAY_SAMPLE_ROWS } from "@/lib/holidays";

export async function GET() {
  const worksheet = XLSX.utils.json_to_sheet(HOLIDAY_SAMPLE_ROWS);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Holiday Sample");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="holiday-calendar-sample.xlsx"'
    }
  });
}
