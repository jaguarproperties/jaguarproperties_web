import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getMongoDb } from "@/lib/mongo";

function sanitizeMongoUrl(uri: string) {
  const sanitized = new URL(uri);

  if (sanitized.username) sanitized.username = "***";
  if (sanitized.password) sanitized.password = "***";

  return {
    protocol: sanitized.protocol,
    hosts: sanitized.host,
    database: sanitized.pathname.replace(/^\//, "") || null,
    params: Object.fromEntries(sanitized.searchParams.entries()),
    sanitizedUrl: sanitized.toString()
  };
}

function toErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    };
  }

  return {
    name: "UnknownError",
    message: String(error)
  };
}

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: "DATABASE_URL is not configured."
      },
      { status: 500 }
    );
  }

  const diagnostics = {
    ok: true,
    configured: true,
    connection: sanitizeMongoUrl(databaseUrl),
    checks: {
      mongoDriver: { ok: false as boolean, details: null as Record<string, string> | null },
      prisma: { ok: false as boolean, details: null as Record<string, string> | null }
    }
  };

  try {
    const db = await getMongoDb();
    await db.admin().command({ ping: 1 });
    diagnostics.checks.mongoDriver.ok = true;
  } catch (error) {
    diagnostics.ok = false;
    diagnostics.checks.mongoDriver.details = toErrorDetails(error);
  }

  try {
    await prisma.siteContent.findFirst({
      select: { id: true },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });
    diagnostics.checks.prisma.ok = true;
  } catch (error) {
    diagnostics.ok = false;
    diagnostics.checks.prisma.details = toErrorDetails(error);
  }

  return NextResponse.json(diagnostics, { status: diagnostics.ok ? 200 : 503 });
}
