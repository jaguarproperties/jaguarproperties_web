import { Metadata } from "next";
import { Clock3, Headphones, MapPinned } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { LeadForm } from "@/components/site/lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { getSiteContent } from "@/lib/data";
import { parseHighlightItems, resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Jaguar Properties for premium real estate inquiries."
};

export default async function ContactPage() {
  const siteContent = resolveSiteContent(await getSiteContent());
  const supportPoints = parseHighlightItems(siteContent.contactSupportPoints);
  const icons = [Headphones, Clock3, MapPinned];
  const jaguarMapsLink = "https://www.google.com/maps/search/?api=1&query=13.09840,77.58476";

  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.02fr] lg:gap-10">
          <div>
            <SectionHeading
              eyebrow={<Translate id="contact.eyebrow" defaultText="Contact" />}
              title={siteContent.contactTitle}
              description={siteContent.contactDescription}
            />
            <div className="mt-8 grid gap-4">
              {supportPoints.map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                <Card key={item.title} className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    <Icon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-display text-2xl text-foreground dark:text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{item.text}</p>
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>
            <div className="mt-8 rounded-[28px] border border-black/10 bg-white/35 p-6 text-sm leading-7 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <p>{siteContent?.contactEmail}</p>
              <p>{siteContent?.contactPhone}</p>
              <p>{siteContent?.officeAddress}</p>
            </div>
            <a
              href={jaguarMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-8 block overflow-hidden rounded-[28px] border border-black/10 dark:border-white/10"
              aria-label="Open Jaguar Properties location in Google Maps"
            >
              <iframe
                src={siteContent?.mapEmbedUrl}
                width="100%"
                height="360"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none min-h-[360px] w-full"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/65 px-5 py-3 text-sm text-white backdrop-blur-sm transition group-hover:bg-black/75">
                <span>Open Jaguar Properties in Google Maps</span>
                <span className="font-semibold text-primary">View location</span>
              </div>
            </a>
          </div>
          <Card className="p-6 sm:p-8">
            <LeadForm />
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
