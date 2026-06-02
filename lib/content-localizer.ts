import { defaultLocale, type Locale } from "@/lib/i18n";
import { getTranslatedText, syncTranslationStrings } from "@/lib/text-translations";

type UnknownRecord = Record<string, unknown>;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

async function translateString(value: unknown, locale: Locale) {
  if (typeof value !== "string" || !value.trim() || locale === defaultLocale) {
    return value;
  }

  return getTranslatedText(value, locale);
}

async function translateStringArray(values: unknown, locale: Locale) {
  if (!isStringArray(values) || locale === defaultLocale) {
    return values;
  }

  return Promise.all(values.map((value) => translateString(value, locale)));
}

export async function translateFields<T extends UnknownRecord>(
  record: T | null | undefined,
  locale: Locale,
  fieldNames: Array<keyof T>
): Promise<T | null> {
  if (!record) return null;
  if (locale === defaultLocale) {
    return record;
  }

  const nextRecord = { ...record };

  for (const fieldName of fieldNames) {
    const value = nextRecord[fieldName];
    if (typeof value === "string") {
      nextRecord[fieldName] = (await translateString(value, locale)) as T[keyof T];
    } else if (isStringArray(value)) {
      nextRecord[fieldName] = (await translateStringArray(value, locale)) as T[keyof T];
    }
  }

  return nextRecord;
}

export async function syncTranslationFields(record: UnknownRecord, fieldNames: string[]) {
  const values = fieldNames.flatMap((fieldName) => {
    const value = record[fieldName];
    if (typeof value === "string") {
      return [value];
    }
    if (isStringArray(value)) {
      return value;
    }
    return [];
  });

  return syncTranslationStrings(values);
}

