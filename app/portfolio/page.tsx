import Image from "next/image";
import { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { getSiteContent } from "@/lib/data";
import { parseGalleryItems, resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Completed developments and curated gallery from Jaguar Properties."
};

export default async function PortfolioPage() {
  const siteContent = resolveSiteContent(await getSiteContent());
  const portfolioImages = parseGalleryItems(siteContent.portfolioGallery);

  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow={<Translate id="portfolio.page.eyebrow" defaultText="Portfolio" />}
          title={siteContent.portfolioTitle}
          description={siteContent.portfolioDescription}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {portfolioImages.map((item, index) => (
            <Card key={item.image} className="overflow-hidden">
              <div className="relative h-[420px]">
                <Image src={item.image} alt={`Jaguar portfolio ${index + 1}`} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl text-foreground dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-400">{item.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
