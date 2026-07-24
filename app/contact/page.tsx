import { Metadata } from "next";
import { Clock3, Headphones, MapPinned } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { LeadForm } from "@/components/site/lead-form";
import { FormattedTextLine } from "@/components/site/formatted-text-line";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { Card } from "@/components/ui/card";
import { getSiteContent } from "@/lib/data";
import { JsonLd, buildBreadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getLocalizedPath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { parseHighlightItems, parseOfficeBranches, resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export async function generateMetadata() {
  const locale = getRequestLocale();

  return buildMetadata({
    title: "Contact Jaguar Properties",
    description:
      "Contact Jaguar Properties for premium plots in Bangalore, site visits, pricing, documentation support, and real estate investment guidance.",
    path: "/contact",
    locale,
    keywords: [
      "contact jaguar properties",
      "premium plots near me",
      "plots for sale near me",
      "buy plot near me",
      "plots in bangalore contact",
      "premium plots in bangalore",
      "residential plots in bangalore",
      "plots for sale in bangalore",
      "investment plots in bangalore",
      "best plot developers in bangalore",
      "real estate bangalore contact",
      "plots in Qatar contact",
      "plots in Dubai contact",
      "plots in Calicut contact",
      "site visit jaguar properties"
    ]
  });
}

export default async function ContactPage() {
  const locale = getRequestLocale();
  const siteContent = resolveSiteContent(await getSiteContent());
  const supportPoints = parseHighlightItems(siteContent.contactSupportPoints);
  const officeBranches = parseOfficeBranches(siteContent.officeAddress);
  const icons = [Headphones, Clock3, MapPinned];
  const jaguarMapsLink = "https://www.google.com/maps/search/?api=1&query=13.09840,77.58476";

  return (
    <PageShell>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: getLocalizedPath("/", locale) },
          { name: "Contact", path: getLocalizedPath("/contact", locale) }
        ])}
      />
      <section className="container py-16 md:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.02fr] lg:gap-10">
          <div className="order-2 lg:order-1">
            <SectionHeading
              eyebrow={<Translate id="contact.eyebrow" defaultText="Contact" />}
              title={<TranslateText text={siteContent.contactTitle} />}
              description={<TranslateText text={siteContent.contactDescription} />}
            />
            <div className="mt-8 grid gap-4">
              {supportPoints.map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                <Card key={item.title} className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    <Icon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-display text-2xl text-foreground dark:text-white"><TranslateText text={item.title} /></h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300"><TranslateText text={item.text} /></p>
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>
            <div className="mt-8 rounded-[22px] border border-black/10 bg-white/35 p-5 text-sm leading-7 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 sm:rounded-[28px] sm:p-6">
              <p>{siteContent?.contactEmail}</p>
              <p>
                <bdi dir="ltr">{siteContent?.contactPhone}</bdi>
              </p>
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.28em] text-primary">
                  <Translate id="contact.offices" defaultText="OUR BRANCHES" />
                </p>
                <ul className="mt-4 space-y-5">
                  {officeBranches.map((branch, index) => (
                    <li key={`${branch[0]}-${index}`} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div className="space-y-1">
                        {branch.map((line, lineIndex) => (
                          <p
                            key={line}
                            className={lineIndex === 0 ? "font-semibold text-foreground dark:text-white" : undefined}
                          >
                            <FormattedTextLine text={line} />
                          </p>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <a
              href={jaguarMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-8 block overflow-hidden rounded-[22px] border border-black/10 dark:border-white/10 sm:rounded-[28px]"
              aria-label="Open Jaguar Properties location in Google Maps"
            >
              <iframe
                src={siteContent?.mapEmbedUrl}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none min-h-[320px] w-full sm:min-h-[360px]"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-black/65 px-4 py-3 text-sm text-white backdrop-blur-sm transition group-hover:bg-black/75 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <span><Translate id="contact.map.open" defaultText="Open Jaguar Properties in Google Maps" /></span>
                <span className="font-semibold text-primary"><Translate id="contact.map.viewLocation" defaultText="View location" /></span>
              </div>
            </a>
          </div>
          <Card className="order-1 p-5 sm:p-8 lg:order-2">
            <LeadForm />
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
