import Link from "next/link";
import Image from "next/image";

import { LanguageSelector } from "@/components/site/language-selector";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Translate } from "@/components/site/translate";

const navItems = [
  { href: "/", id: "nav.home", label: "Home" },
  { href: "/properties", id: "nav.properties", label: "Properties" },
  { href: "/careers", id: "nav.careers", label: "Careers" },
  { href: "/portfolio", id: "nav.portfolio", label: "Portfolio" },
  { href: "/news", id: "nav.news", label: "News" },
  { href: "/contact", id: "nav.contact", label: "Contact" }
];

const mobileSectionLinks = [
  { href: "/#about", label: "About" },
  { href: "/#featured-properties", label: "Featured" },
  { href: "/#portfolio-highlights", label: "Portfolio" },
  { href: "/#latest-news", label: "News Section" },
  { href: "/#concierge", label: "Support" }
];

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/88 backdrop-blur-2xl dark:border-white/10">
      <div className="container flex min-h-[88px] items-center justify-between gap-6 py-3 md:min-h-[96px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/jaguar-properties-logo.svg"
            alt="Jaguar Properties"
            width={935}
            height={424}
            priority
            className="h-auto w-auto max-h-[64px] object-contain md:max-h-[78px]"
          />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-semibold text-zinc-700 hover:text-primary dark:text-zinc-300 xl:text-lg"
            >
              <Translate id={item.id} defaultText={item.label} />
            </Link>
          ))}
        </nav>
        <div className="relative flex shrink-0 items-center gap-2 md:gap-3">
          <details className="group lg:hidden">
            <summary className="flex h-11 cursor-pointer list-none items-center rounded-full border border-black/10 bg-black/[0.03] px-4 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
              Menu
            </summary>
            <div className="scrollbar-thin absolute right-5 top-[calc(100%-0.25rem)] z-50 mt-3 max-h-[75vh] w-[min(92vw,360px)] overflow-y-auto rounded-[28px] border border-black/10 bg-background/95 p-5 shadow-2xl dark:border-white/10">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl border border-black/5 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-primary/30 hover:bg-black/[0.03] dark:border-white/5 dark:text-zinc-200 dark:hover:bg-white/5"
                  >
                    <Translate id={item.id} defaultText={item.label} />
                  </Link>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.28em] text-primary">Home Sections</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {mobileSectionLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
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
