import { defaultLocale, getDirection, locales, rtlLocales, translations, type Locale } from "@/lib/translations";

export { defaultLocale, getDirection, locales, rtlLocales, translations, type Locale } from "@/lib/translations";

export const localePrefixPattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`, "i");
export const publicRoutePrefixes = [
  "/",
  "/contact",
  "/properties",
  "/premium-plots-in-bangalore",
  "/residential-plots-in-bangalore",
  "/investment-plots-in-bangalore",
  "/premium-plots-in-calicut",
  "/property-investment-qatar",
  "/property-investment-dubai",
  "/news",
  "/careers",
  "/our-journey",
  "/buyers-guide",
  "/businesses-we-serve",
  "/quick-links"
];

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return defaultLocale;

  const normalized = value.trim().toLowerCase();
  if (isLocale(normalized)) return normalized;

  const languageCode = normalized.split("-")[0];
  return isLocale(languageCode) ? languageCode : defaultLocale;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const match = pathname.match(localePrefixPattern);
  if (!match) return null;
  return normalizeLocale(match[1]);
}

export function stripLocalePrefix(pathname: string) {
  return pathname.replace(localePrefixPattern, "") || "/";
}

export function withLocalePrefix(pathname: string, locale: Locale) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const stripped = stripLocalePrefix(normalizedPath);
  const trailingSlash = stripped.endsWith("/") && stripped !== "/";
  const basePath = stripped === "/" ? "" : stripped.replace(/\/$/, "");
  const prefixed = `/${locale}${basePath}`;

  return trailingSlash ? `${prefixed}/` : prefixed || `/${locale}`;
}

export function isPublicPath(pathname: string) {
  return publicRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function getLocalizedPath(pathname: string, locale?: Locale) {
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/uploads")
  ) {
    return pathname;
  }

  const nextLocale = locale ?? defaultLocale;
  const cleanPath = stripLocalePrefix(pathname);
  return withLocalePrefix(cleanPath, nextLocale);
}

export function getLocalizedHref(pathname: string, locale?: Locale) {
  return getLocalizedPath(pathname, locale);
}

export function getLocalePathSegments(pathname: string) {
  const cleanPath = stripLocalePrefix(pathname);
  return cleanPath.split("/").filter(Boolean);
}
