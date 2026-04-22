import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { canViewApplications } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function getPrivateResumePath(filename: string) {
  return path.join(process.cwd(), "storage", "resumes", path.basename(filename));
}

function getLegacyPublicResumePath(filename: string) {
  return path.join(process.cwd(), "public", "uploads", "resumes", path.basename(filename));
}

function getMimeType(filename: string) {
  const extension = path.extname(filename).toLowerCase();

  if (extension === ".pdf") return "application/pdf";
  if (extension === ".doc") return "application/msword";
  if (extension === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "application/octet-stream";
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user || !(await canViewApplications(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: params.id },
    select: {
      resumeName: true,
      resumeUrl: true
    }
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const storedFilename = path.basename(application.resumeUrl);
  const candidatePaths = [
    getPrivateResumePath(storedFilename),
    getLegacyPublicResumePath(storedFilename)
  ];

  for (const filePath of candidatePaths) {
    try {
      const file = await readFile(filePath);

      return new NextResponse(file, {
        headers: {
          "Content-Type": getMimeType(application.resumeName),
          "Content-Disposition": `attachment; filename="${application.resumeName.replace(/"/g, "")}"`
        }
      });
    } catch {
      // Try the next candidate path.
    }
  }

  return NextResponse.json({ error: "Resume file not found" }, { status: 404 });
}
