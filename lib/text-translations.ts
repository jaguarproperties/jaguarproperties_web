import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { TranslationEntry, Prisma } from "@prisma/client";

import { isDatabaseEnabled } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import { defaultLocale, locales, translations, type Locale } from "@/lib/i18n";

type TranslationStatus = "pending" | "ready" | "manual";

type TranslationPayload = {
  sourceText: string;
  sourceLocale: Locale;
  translations: Partial<Record<Locale, { text: string; status: TranslationStatus; updatedAt: string }>>;
  status: TranslationStatus;
};

type SerializedTranslationEntry = Omit<TranslationEntry, "createdAt" | "updatedAt" | "translations"> & {
  createdAt: string;
  updatedAt: string;
  translations: TranslationPayload | null;
};

const storageDir = path.join(process.cwd(), "data");
const storageFile = path.join(storageDir, "translations.json");
const hasDatabase = isDatabaseEnabled() && Boolean(process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL);

function hashSourceText(text: string) {
  return createHash("sha256").update(text.trim()).digest("hex");
}

function normalizeTranslationPayload(payload: TranslationPayload | null | undefined, sourceText: string): TranslationPayload {
  return {
    sourceText,
    sourceLocale: payload?.sourceLocale ?? defaultLocale,
    translations: payload?.translations ?? {},
    status: payload?.status ?? "pending"
  };
}

function normalizeLookupValue(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function getStaticTranslation(sourceText: string, locale: Locale) {
  const directMatch = translations[locale]?.[sourceText]?.trim();
  if (directMatch) return directMatch;

  const normalizedSource = normalizeLookupValue(sourceText);
  const resolvedKey = Object.entries(translations.en).find(
    ([, englishText]) => normalizeLookupValue(englishText) === normalizedSource
  )?.[0];

  return resolvedKey ? translations[locale]?.[resolvedKey]?.trim() : null;
}

async function ensureLocalFile() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(storageFile, "utf8");
  } catch {
    await writeFile(storageFile, "[]\n", "utf8");
  }
}

async function readLocalEntries() {
  await ensureLocalFile();
  const raw = await readFile(storageFile, "utf8");
  const parsed = JSON.parse(raw) as SerializedTranslationEntry[];

  return parsed.map((entry) => ({
    ...entry,
    createdAt: new Date(entry.createdAt),
    updatedAt: new Date(entry.updatedAt),
    translations: entry.translations ? normalizeTranslationPayload(entry.translations, entry.translations.sourceText) : null
  })) as TranslationEntry[];
}

async function writeLocalEntries(entries: TranslationEntry[]) {
  await mkdir(storageDir, { recursive: true });
  const serialized: SerializedTranslationEntry[] = entries.map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
    translations: entry.translations ? normalizeTranslationPayload(entry.translations as TranslationPayload, entry.sourceText) : null
  }));

  await writeFile(storageFile, `${JSON.stringify(serialized, null, 2)}\n`, "utf8");
}

function normalizeLocaleStatuses(payload: TranslationPayload, sourceText: string) {
  const normalized: TranslationPayload = normalizeTranslationPayload(payload, sourceText);

  for (const locale of locales) {
    if (!normalized.translations[locale]) continue;

    normalized.translations[locale] = {
      text: String(normalized.translations[locale]?.text ?? sourceText),
      status: normalized.translations[locale]?.status ?? "pending",
      updatedAt: normalized.translations[locale]?.updatedAt ?? new Date().toISOString()
    };
  }

  return normalized;
}

async function getEntries() {
  if (!hasDatabase) {
    return readLocalEntries();
  }

  return prisma.translationEntry.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
  });
}

async function saveEntry(entry: TranslationEntry) {
  if (!hasDatabase) {
    const entries = await readLocalEntries();
    const index = entries.findIndex((item) => item.sourceHash === entry.sourceHash);

    if (index === -1) {
      entries.unshift(entry);
    } else {
      entries[index] = entry;
    }

    await writeLocalEntries(entries);
    return entry;
  }

  return prisma.translationEntry.upsert({
    where: { sourceHash: entry.sourceHash },
    create: entry,
    update: entry
  });
}

export function createSourceHash(sourceText: string) {
  return hashSourceText(sourceText);
}

export async function getTranslationEntry(sourceText: string) {
  const sourceHash = hashSourceText(sourceText);
  const entries = await getEntries();
  return entries.find((entry) => entry.sourceHash === sourceHash) ?? null;
}

export async function getTranslatedText(sourceText: string, locale: Locale) {
  const normalizedSource = String(sourceText ?? "");
  if (!normalizedSource || locale === defaultLocale) {
    return normalizedSource;
  }

  const staticTranslation = getStaticTranslation(normalizedSource, locale);
  if (staticTranslation) {
    return staticTranslation;
  }

  const entry = await getTranslationEntry(normalizedSource);
  const payload = normalizeTranslationPayload(entry?.translations as TranslationPayload | null | undefined, normalizedSource);
  const translation = payload.translations[locale]?.text?.trim();

  return translation || normalizedSource;
}

async function generateTranslation(text: string, locale: Locale) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_TRANSLATION_MODEL || "gpt-4.1-mini";

  if (!apiKey || locale === defaultLocale) {
    return text;
  }

  const localeNames: Record<Locale, string> = {
    en: "English",
    ar: "Arabic"
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You translate website content while preserving meaning, tone, formatting, capitalization, punctuation, SEO intent, and line breaks. Return only the translated text."
          },
          {
            role: "user",
            content: `Translate the following English website content into ${localeNames[locale]}. Preserve URLs, email addresses, numbers, brand names, and any markdown-style emphasis or line breaks exactly.\n\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      return text;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch {
    return text;
  }
}

export async function syncTranslationText(sourceText: string, activeLocales: Locale[] = locales) {
  const normalizedSource = String(sourceText ?? "");
  if (!normalizedSource.trim()) {
    return null;
  }

  const sourceHash = hashSourceText(normalizedSource);
  const existingEntry = await getTranslationEntry(normalizedSource);
  const now = new Date().toISOString();
  const currentPayload = normalizeLocaleStatuses(
    (existingEntry?.translations as TranslationPayload | null | undefined) ?? {
      sourceText: normalizedSource,
      sourceLocale: defaultLocale,
      translations: {},
      status: "pending"
    },
    normalizedSource
  );

  const translations: TranslationPayload["translations"] = { ...currentPayload.translations };

  for (const locale of activeLocales) {
    if (locale === defaultLocale) continue;

    const translatedText = await generateTranslation(normalizedSource, locale);
    translations[locale] = {
      text: translatedText,
      status: translatedText === normalizedSource ? "pending" : "ready",
      updatedAt: now
    };
  }

  const payload: TranslationPayload = {
    sourceText: normalizedSource,
    sourceLocale: defaultLocale,
    translations,
    status: Object.values(translations).every((item) => item?.status === "ready") ? "ready" : "pending"
  };

  const entry: TranslationEntry = {
    id: existingEntry?.id ?? sourceHash,
    sourceHash,
    sourceLocale: defaultLocale,
    sourceText: normalizedSource,
    translations: payload as Prisma.JsonValue,
    status: payload.status,
    createdAt: existingEntry?.createdAt ?? new Date(),
    updatedAt: new Date()
  };

  return saveEntry(entry);
}

export async function syncTranslationStrings(values: string[], activeLocales: Locale[] = locales) {
  const uniqueValues = Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));

  const results: Array<TranslationEntry | null> = [];
  for (const value of uniqueValues) {
    results.push(await syncTranslationText(value, activeLocales));
  }

  return results;
}
