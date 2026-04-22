import { startOfDay, endOfDay, format, isSunday } from "date-fns";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type HolidayUploadRow = {
  date: Date;
  title: string;
  description?: string;
};

export const HOLIDAY_SAMPLE_ROWS = [
  {
    Date: "2026-01-26",
    Title: "Republic Day",
    Description: "National holiday"
  },
  {
    Date: "2026-08-15",
    Title: "Independence Day",
    Description: "National holiday"
  },
  {
    Date: "2026-10-02",
    Title: "Gandhi Jayanti",
    Description: "National holiday"
  }
];

export function canManageHolidayCalendar(role: UserRole) {
  return role === "HR" || role === "MANAGER" || role === "ADMIN" || role === "SUPER_ADMIN";
}

export function normalizeHolidayDate(date: Date) {
  return startOfDay(date);
}

export function getHolidayDateKey(date: Date) {
  return format(normalizeHolidayDate(date), "yyyy-MM-dd");
}

export function isWeeklyHoliday(date: Date) {
  return isSunday(date);
}

export function isScheduledWorkingDay(date: Date) {
  return !isWeeklyHoliday(date);
}

export async function getHolidaysInRange(start: Date, end: Date) {
  if (!hasDatabase) return [];

  try {
    return await prisma.holiday.findMany({
      where: {
        date: {
          gte: startOfDay(start),
          lte: endOfDay(end)
        }
      },
      orderBy: { date: "asc" }
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to load holidays in range, falling back to weekly holidays only.", error);
    }
    return [];
  }
}

export async function getHolidayDateKeySet(start: Date, end: Date) {
  const holidays = await getHolidaysInRange(start, end);
  return new Set(holidays.map((holiday) => getHolidayDateKey(holiday.date)));
}

export async function getAllHolidays() {
  if (!hasDatabase) return [];

  try {
    return await prisma.holiday.findMany({
      orderBy: { date: "asc" }
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to load holiday calendar, returning an empty list.", error);
    }
    return [];
  }
}

export async function replaceHolidayCalendar(rows: HolidayUploadRow[], uploadedById?: string) {
  if (!hasDatabase) {
    throw new Error("DATABASE_URL is not configured. Configure the database before uploading holidays.");
  }

  const dedupedRows = Array.from(
    rows.reduce((map, row) => {
      const date = normalizeHolidayDate(row.date);
      map.set(getHolidayDateKey(date), {
        date,
        title: row.title.trim(),
        description: row.description?.trim() || null,
        uploadedById
      });
      return map;
    }, new Map<string, { date: Date; title: string; description: string | null; uploadedById?: string }>())
      .values()
  );

  await prisma.$transaction([
    prisma.holiday.deleteMany({}),
    ...(dedupedRows.length > 0
      ? [
          prisma.holiday.createMany({
            data: dedupedRows
          })
        ]
      : [])
  ]);

  return dedupedRows.length;
}
