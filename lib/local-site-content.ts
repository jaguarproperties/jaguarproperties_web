import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { demoSiteContent } from "@/lib/demo-data";

type LocalSiteContentRecord = typeof demoSiteContent;

type SerializedLocalSiteContentRecord = Omit<LocalSiteContentRecord, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

const storageDir = path.join(process.cwd(), "data");
const storageFile = path.join(storageDir, "site-content.json");

function normalizeLocalSiteContent(
  content: SerializedLocalSiteContentRecord | LocalSiteContentRecord
): LocalSiteContentRecord {
  return {
    ...demoSiteContent,
    ...content,
    id: String(content.id ?? demoSiteContent.id),
    createdAt:
      content.createdAt instanceof Date ? content.createdAt : new Date(content.createdAt ?? demoSiteContent.createdAt),
    updatedAt:
      content.updatedAt instanceof Date ? content.updatedAt : new Date(content.updatedAt ?? demoSiteContent.updatedAt)
  };
}

async function ensureLocalSiteContentFile() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(storageFile, "utf8");
  } catch {
    await writeLocalSiteContent(demoSiteContent);
  }
}

export async function readLocalSiteContent() {
  await ensureLocalSiteContentFile();
  const raw = await readFile(storageFile, "utf8");
  return normalizeLocalSiteContent(JSON.parse(raw) as SerializedLocalSiteContentRecord);
}

export async function writeLocalSiteContent(content: LocalSiteContentRecord) {
  await mkdir(storageDir, { recursive: true });
  const serialized: SerializedLocalSiteContentRecord = {
    ...content,
    createdAt: content.createdAt.toISOString(),
    updatedAt: content.updatedAt.toISOString()
  };
  await writeFile(storageFile, `${JSON.stringify(serialized, null, 2)}\n`, "utf8");
}

export async function upsertLocalSiteContent(
  content: Partial<Omit<LocalSiteContentRecord, "createdAt" | "updatedAt">> & { id: string }
) {
  const existing = await readLocalSiteContent();
  const now = new Date();
  const nextContent = normalizeLocalSiteContent({
    ...existing,
    ...content,
    createdAt: existing.createdAt,
    updatedAt: now
  });

  await writeLocalSiteContent(nextContent);
  return nextContent;
}
