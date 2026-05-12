const DEFAULT_TIMEOUTS = {
  connectTimeoutMS: "5000",
  serverSelectionTimeoutMS: "5000",
  socketTimeoutMS: "10000"
} as const;

const SRV_LOOKUP_ERROR_PATTERNS = [
  "querysrv econnrefused",
  "querysrv enotfound",
  "querysrv etimeout",
  "querysrv eservfail"
] as const;

function parseBooleanEnv(value: string | undefined) {
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function isNextProductionBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function isDatabaseEnabled() {
  return !parseBooleanEnv(process.env.DISABLE_DATABASE);
}

export function isBuildPhaseWithoutDatabase() {
  return isNextProductionBuildPhase() && !hasDatabaseUrl();
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL);
}

export function getDatabaseUrl() {
  const rawUrl = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;

  if (!rawUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const [base, query = ""] = rawUrl.split("?", 2);
  const searchParams = new URLSearchParams(query);

  for (const [key, value] of Object.entries(DEFAULT_TIMEOUTS)) {
    if (!searchParams.has(key)) {
      searchParams.set(key, value);
    }
  }

  if (!searchParams.has("appName")) {
    searchParams.set("appName", "jaguar-properties");
  }

  const serializedQuery = searchParams.toString();
  return serializedQuery ? `${base}?${serializedQuery}` : base;
}

export function formatDatabaseConnectionError(error: unknown) {
  if (!(error instanceof Error) || !error.message) {
    return "The database is currently unreachable.";
  }

  const message = error.message.trim();
  const normalizedMessage = message.toLowerCase();

  if (SRV_LOOKUP_ERROR_PATTERNS.some((pattern) => normalizedMessage.includes(pattern))) {
    return [
      "MongoDB SRV DNS lookup failed.",
      "Set DATABASE_DIRECT_URL to the non-SRV mongodb:// connection string from MongoDB Atlas,",
      "or use a network where SRV DNS lookups are allowed."
    ].join(" ");
  }

  return message;
}
