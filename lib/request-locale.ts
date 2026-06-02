import { cookies, headers } from "next/headers";

import { defaultLocale, locales } from "@/lib/translations";
import { isLocale, normalizeLocale, type Locale } from "@/lib/i18n";

export function getPreferredLocaleFromHeaders(acceptLanguageHeader: string | null) {
  if (!acceptLanguageHeader) return defaultLocale;

  const headerValues = acceptLanguageHeader
    .split(",")
    .map((item) => item.split(";")[0]?.trim())
    .filter(Boolean) as string[];

  for (const candidate of headerValues) {
    const locale = normalizeLocale(candidate);
    if (locales.includes(locale)) return locale;
  }

  return defaultLocale;
}

export function getCookieLocale() {
  try {
    const cookieStore = cookies();
    return normalizeLocale(cookieStore.get("site-language")?.value);
  } catch {
    return defaultLocale;
  }
}

export function getRequestLocale(): Locale {
  try {
    const headerLocale = headers().get("x-site-locale");
    if (isLocale(headerLocale)) return headerLocale;

    const cookieLocale = getCookieLocale();
    if (cookieLocale) return cookieLocale;

    return getPreferredLocaleFromHeaders(headers().get("accept-language"));
  } catch {
    return defaultLocale;
  }
}

