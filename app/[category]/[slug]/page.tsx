import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Compass,
  Handshake,
  ShieldCheck
} from "lucide-react";
import { notFound } from "next/navigation";

import { getFooterPage } from "@/lib/footer-pages";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmiCalculator } from "@/components/site/emi-calculator";

const iconMap = {
  "Our Journey": Compass,
  "Buyer's Guide": BadgeIndianRupee,
  "Businesses We Serve": Building2,
  "Quick Links": BookOpen,
  default: ShieldCheck
};

export async function generateMetadata({
  params
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const page = getFooterPage(params.category, params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description
  };
}

export default function FooterContentPage({
  params
}: {
  params: { category: string; slug: string };
}) {
  const page = getFooterPage(params.category, params.slug);
  if (!page) notFound();

  const Icon = iconMap[page.category as keyof typeof iconMap] ?? iconMap.default;

  return (
    <PageShell>
      <section className="container py-20">
        <SectionHeading
          eyebrow={<Translate id={page.eyebrow} defaultText={page.eyebrow} />}
          title={<Translate id={page.title} defaultText={page.title} />}
          description={<Translate id={page.description} defaultText={page.description} />}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <Card className="p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-4xl text-foreground dark:text-white">
                    <Translate id={page.title} defaultText={page.title} />
                  </h2>
                  <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">
                    <Translate id={page.intro} defaultText={page.intro} />
                  </p>
                </div>
              </div>
            </Card>

            {page.href === "/buyers-guide/emi-calculator" ? <EmiCalculator /> : null}

            <div className="grid gap-6">
              {page.sections.map((section) => (
                <Card key={section.heading} className="p-8">
                  <h3 className="font-display text-3xl text-foreground dark:text-white">
                    <Translate id={section.heading} defaultText={section.heading} />
                  </h3>
                  <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">
                    <Translate id={section.body} defaultText={section.body} />
                  </p>
                  {section.bullets?.length ? (
                    <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>
                          <Translate id={bullet} defaultText={bullet} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-primary">
                <Translate id="footer.jaguarHighlights" defaultText="Jaguar Highlights" />
              </p>
              <div className="mt-6 space-y-4">
                {page.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/50 px-4 py-3 dark:border-white/10 dark:bg-black/20"
                  >
                    <Handshake className="h-5 w-5 text-primary" />
                    <span className="text-sm text-zinc-800 dark:text-zinc-200">
                      <Translate id={highlight} defaultText={highlight} />
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-primary">
                <Translate id="footer.continueExploring" defaultText="Continue Exploring" />
              </p>
              <div className="mt-6 space-y-3">
                <Button asChild className="w-full justify-between">
                  <Link href="/properties">
                    <Translate id="button.viewProperties" defaultText="View Properties" />
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full justify-between">
                  <Link href="/contact">
                    <Translate id="button.contactJaguar" defaultText="Contact Jaguar" />
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full justify-between">
                  <Link href="/news">
                    <Translate id="button.readInsights" defaultText="Read Insights" />
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-primary">
                <Translate id="footer.whyMatters" defaultText="Why It Matters" />
              </p>
              <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">
                <Translate
                  id="footer.whyMatters.body"
                  defaultText="Premium real estate decisions benefit from clarity, context, and trusted guidance. Jaguar's knowledge pages are built to support buyers, partners, and stakeholders at every stage of the journey."
                />
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                <Translate
                  id="footer.whyMatters.note"
                  defaultText="Built for Bengaluru, Dubai, and Calicut growth narratives."
                />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
