import { NextResponse } from "next/server";
import { getCareerBySlug } from "@/lib/careers";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id: params.id }
    }).catch(async () => {
      return getCareerBySlug(params.id);
    });

    if (!job) {
      const fallbackJob = await getCareerBySlug(params.id);

      if (fallbackJob) {
        return NextResponse.json(fallbackJob);
      }

      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching job:", error);
    }

    const fallbackJob = await getCareerBySlug(params.id);
    if (fallbackJob) {
      return NextResponse.json(fallbackJob);
    }

    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const job = await prisma.jobPosting.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json(job);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating job:", error);
    }
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.jobPosting.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting job:", error);
    }
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
