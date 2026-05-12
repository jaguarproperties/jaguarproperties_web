import { NextResponse } from "next/server";

import { formatDatabaseConnectionError, getDatabaseUrl } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import { getMongoDb } from "@/lib/mongo";

function sanitizeMongoUrl(uri: string) {
  const [schemeAndAuthority, query = ""] = uri.split("?", 2);
  const protocolSeparatorIndex = schemeAndAuthority.indexOf("://");
  const protocol =
    protocolSeparatorIndex === -1 ? "mongodb:" : `${schemeAndAuthority.slice(0, protocolSeparatorIndex)}:`;
  const afterProtocol =
    protocolSeparatorIndex === -1
      ? schemeAndAuthority
      : schemeAndAuthority.slice(protocolSeparatorIndex + 3);
  const slashIndex = afterProtocol.indexOf("/");
  const authority = slashIndex === -1 ? afterProtocol : afterProtocol.slice(0, slashIndex);
  const databasePath = slashIndex === -1 ? "" : afterProtocol.slice(slashIndex + 1);
  const atIndex = authority.lastIndexOf("@");
  const hosts = atIndex === -1 ? authority : authority.slice(atIndex + 1);
  const sanitizedAuthority = atIndex === -1 ? authority : `***:***@${hosts}`;
  const sanitizedQuery = new URLSearchParams(query);

  return {
    protocol,
    hosts,
    database: databasePath || null,
    params: Object.fromEntries(sanitizedQuery.entries()),
    sanitizedUrl: `${protocol}//${sanitizedAuthority}${databasePath ? `/${databasePath}` : ""}${query ? `?${query}` : ""}`
  };
}

function toErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: formatDatabaseConnectionError(error)
    };
  }

  return {
    name: "UnknownError",
    message: String(error)
  };
}

export async function GET() {
  const databaseUrl = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;

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
    getDatabaseUrl();
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
