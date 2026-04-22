import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, X } from "lucide-react";

import { getSiteContent } from "@/lib/data";
import { footerNavigationColumns } from "@/lib/footer-pages";
import { Translate } from "@/components/site/translate";
import { resolveSiteContent } from "@/lib/site-content";

export async function SiteFooter() {
  const content = resolveSiteContent(await getSiteContent());
  const socialLinks = [
    { label: "Instagram", href: content?.instagramUrl, icon: Instagram },
    { label: "LinkedIn", href: content?.linkedinUrl, icon: Linkedin },
    { label: "Facebook", href: content?.facebookUrl, icon: Facebook },
    { label: "Twitter / X", href: content?.twitterUrl, icon: X },
    { label: "YouTube", href: content?.youtubeUrl, icon: Youtube }
  ];

  return (
    <footer className="border-t border-black/10 bg-black/[0.04] dark:border-white/10 dark:bg-black/30">
      <div className="container grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr_0.9fr]">
        <div className="max-w-md">
          <p className="font-display text-3xl tracking-[0.12em] text-foreground">JAGUAR PROPERTIES</p>
          <p className="mt-5 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {content?.footerBlurb}
          </p>
        </div>
        <div className="rounded-[28px] border border-black/10 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">
            <Translate id="contact.offices" defaultText="Offices" />
          </p>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            {content.officeAddress}
          </div>
        </div>
        <div className="rounded-[28px] border border-black/10 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">
            <Translate id="contact.connect" defaultText="Connect" />
          </p>
          <div className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
            <p>{content?.contactEmail}</p>
            <p>{content?.contactPhone}</p>
            <Link
              href="/admin/login"
              className="inline-block font-semibold hover:text-primary"
            >
              <Translate id="footer.adminLogin" defaultText="Admin Login" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container pb-4">
        <div className="grid gap-8 border-t border-black/10 py-12 dark:border-white/10 md:grid-cols-2 xl:grid-cols-4">
          {footerNavigationColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm uppercase tracking-[0.28em] text-primary">
                <Translate id={column.title} defaultText={column.title} />
              </p>
              <div className="mt-5 space-y-3">
                {column.links.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-sm leading-6 text-zinc-700 transition hover:text-primary dark:text-zinc-300"
                  >
                    <Translate id={label} defaultText={label} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pb-8 pt-2 md:gap-4">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/50 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 md:px-6 md:py-4 md:text-base"
              >
                <Icon className="h-5 w-5" />
                <span>
                  <Translate
                    id={`social.${item.label === "Twitter / X" ? "twitter" : item.label.toLowerCase()}`}
                    defaultText={item.label}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="border-t border-black/10 dark:border-white/10">
        <div className="container space-y-3 py-8 text-center text-zinc-600 dark:text-zinc-400">
          <p className="text-sm leading-6 md:text-base">
            {content?.footerCopyright}
          </p>
          <p className="text-sm leading-6 md:text-base">
            {content?.footerNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
