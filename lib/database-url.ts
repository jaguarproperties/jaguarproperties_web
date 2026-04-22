const DEFAULT_TIMEOUTS = {
  connectTimeoutMS: "5000",
  serverSelectionTimeoutMS: "5000",
  socketTimeoutMS: "10000"
} as const;

export function getDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL;

  if (!rawUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const url = new URL(rawUrl);

  for (const [key, value] of Object.entries(DEFAULT_TIMEOUTS)) {
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  }

  if (!url.searchParams.has("appName")) {
    url.searchParams.set("appName", "jaguar-properties");
  }

  return url.toString();
}

