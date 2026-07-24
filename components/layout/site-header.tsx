import Link from "next/link";
import Image from "next/image";

import { LanguageSelector } from "@/components/site/language-selector";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Translate } from "@/components/site/translate";
import { getLocalizedPath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

const navItems = [
  { href: "/", id: "nav.home", label: "Home" },
  { href: "/properties", id: "nav.projects", label: "Projects" },
  { href: "/careers", id: "nav.careers", label: "Careers" },
  { href: "/news", id: "nav.news", label: "News" },
  { href: "/contact", id: "nav.contact", label: "Contact" }
];

const mobileSectionLinks = [
  { href: "/#about", label: "About" },
  { href: "/#featured-properties", label: "Projects" },
  { href: "/#latest-news", label: "News Section" },
  { href: "/#concierge", label: "Support" }
];

export async function SiteHeader() {
  const locale = getRequestLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/88 backdrop-blur-2xl dark:border-white/10">
      <div className="container flex min-h-[76px] items-center justify-between gap-2 py-0 sm:min-h-[88px] sm:gap-4 lg:min-h-[112px] lg:gap-6 xl:min-h-[128px]">
        <Link
          href={getLocalizedPath("/", locale)}
          className="flex h-[76px] min-w-0 shrink items-center sm:h-[88px] lg:h-[112px] xl:h-[128px]"
        >
          <Image
            src="/uploads/site-media/jaguarlogo.png"
            alt="Jaguar Properties"
            width={1536}
            height={1024}
            priority
            className="h-full w-auto max-w-[46vw] object-contain sm:max-w-none"
            unoptimized
          />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navItems.map((item) => (
              <Link
                key={item.href}
              href={getLocalizedPath(item.href, locale)}
                className="text-base font-semibold text-zinc-700 hover:text-primary dark:text-zinc-300 xl:text-lg"
              >
              <Translate id={item.id} defaultText={item.label} />
            </Link>
          ))}
        </nav>
        <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
          <details className="group lg:hidden">
            <summary className="flex h-10 cursor-pointer list-none items-center rounded-full border border-black/10 bg-black/[0.03] px-3 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 sm:h-11 sm:px-4">
              <Translate id="nav.menu" defaultText="Menu" />
            </summary>
            <div className="scrollbar-thin absolute right-0 top-[calc(100%-0.25rem)] z-50 mt-3 max-h-[75vh] w-[min(92vw,360px)] overflow-y-auto rounded-[22px] border border-black/10 bg-background/95 p-4 shadow-2xl dark:border-white/10 sm:rounded-[28px] sm:p-5">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={getLocalizedPath(item.href, locale)}
                    className="block rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-primary/30 hover:bg-black/[0.03] dark:border-white/5 dark:text-zinc-200 dark:hover:bg-white/5"
                  >
                    <Translate id={item.id} defaultText={item.label} />
                  </Link>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.28em] text-primary">
                  <Translate id="nav.homeSections" defaultText="Home Sections" />
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {mobileSectionLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={getLocalizedPath(item.href, locale)}
                      className="rounded-2xl border border-black/5 px-3 py-3 text-center text-sm text-zinc-700 transition hover:border-primary/30 hover:bg-black/[0.03] dark:border-white/5 dark:text-zinc-200 dark:hover:bg-white/5"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </details>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
