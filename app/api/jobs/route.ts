import { NextResponse } from "next/server";

import { getCareerOpenings } from "@/lib/careers";

export async function GET() {
  try {
    const jobs = await getCareerOpenings();
    return NextResponse.json(jobs);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching jobs:", error);
    }
    return NextResponse.json(
      [],
      { status: 200 }
    );
  }
}
