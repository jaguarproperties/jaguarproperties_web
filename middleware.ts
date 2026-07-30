import { NextRequest, NextResponse } from "next/server";

import {
  defaultLocale,
  getLocaleFromPathname,
  isLocale,
  isPublicPath,
  stripLocalePrefix,
  withLocalePrefix,
  type Locale
} from "@/lib/i18n";
import { getPreferredLocaleFromHeaders } from "@/lib/request-locale";

const bypassPrefixes = ["/api", "/_next", "/admin", "/uploads", "/media", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

function shouldBypass(pathname: string) {
  return bypassPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function shouldRedirectToHttps(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  const host = request.headers.get("host") ?? request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const isLocalhost =
    host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]");

  return protocol === "http" && !isLocalhost;
}

function getRequestedLocale(request: NextRequest, pathname: string) {
  const pathLocale = getLocaleFromPathname(pathname);
  if (isLocale(pathLocale)) {
    return pathLocale;
  }

  const cookieLocale = request.cookies.get("site-language")?.value;
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return getPreferredLocaleFromHeaders(request.headers.get("accept-language"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldRedirectToHttps(request)) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";

    return NextResponse.redirect(httpsUrl, 301);
  }

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const requestedLocale = getRequestedLocale(request, pathname);
  const pathLocale = getLocaleFromPathname(pathname);

  if (pathLocale) {
    const rewrittenPath = stripLocalePrefix(pathname) || "/";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-site-locale", pathLocale);

    const response = NextResponse.rewrite(new URL(rewrittenPath, request.url), {
      request: {
        headers: requestHeaders
      }
    });

    response.cookies.set("site-language", pathLocale, {
      path: "/",
      sameSite: "lax"
    });

    return response;
  }

  if (isPublicPath(pathname)) {
    const targetLocale = requestedLocale || defaultLocale;
    const redirectPath = withLocalePrefix(pathname, targetLocale as Locale);
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    response.cookies.set("site-language", targetLocale, {
      path: "/",
      sameSite: "lax"
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"]
};
