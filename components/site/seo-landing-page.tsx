import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { ProjectCard } from "@/components/site/project-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProjects } from "@/lib/data";
import { getLocalizedPath } from "@/lib/i18n";
import { resolveImageSrc, shouldBypassImageOptimization } from "@/lib/image";
import { getRequestLocale } from "@/lib/request-locale";
import { getLocalizedSeoLandingPage } from "@/lib/seo-landing-pages";
import {
  JsonLd,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildMetadata
} from "@/lib/seo";

export function generateSeoLandingMetadata(slug: string): Metadata {
  const locale = getRequestLocale();
  const page = getLocalizedSeoLandingPage(slug, locale);
  if (!page) return {};

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
    locale,
    image: page.image,
    keywords: page.keywords
  });
}

export async function SeoLandingPageContent({ slug }: { slug: string }) {
  const locale = getRequestLocale();
  const page = getLocalizedSeoLandingPage(slug, locale);
  if (!page) notFound();
  const labels =
    locale === "ar"
      ? {
          home: "الرئيسية",
          viewPlotProjects: "عرض مشاريع الأراضي",
          enquire: "استفسر عن شراء الأرض",
          related: "مشاريع أراضٍ مميزة ذات صلة",
          relatedTitle: `استكشف مشاريع جاكوار العقارية المرتبطة بـ ${page.location}.`,
          relatedDescription:
            "قارن بين قطع الأراضي السكنية وقطع الاستثمار وقطع الفلل وخيارات الأراضي في المجتمعات المسورة من جاكوار العقارية.",
          popularSearches: "عمليات بحث شائعة ندعمها",
          faqs: "الأسئلة الشائعة",
          faqTitle: `أسئلة حول ${page.title}`,
          brand: "جاكوار العقارية",
          ctaTitle:
            "تحدث مع فريقنا حول قطع الأراضي المميزة وشراء الأراضي واستثمار الأراضي.",
          contact: "تواصل مع جاكوار العقارية"
        }
      : {
          home: "Home",
          viewPlotProjects: "View Plot Projects",
          enquire: "Enquire About Plot Purchase",
          related: "Related Premium Plot Projects",
          relatedTitle: `Explore Jaguar Properties projects connected to ${page.location}.`,
          relatedDescription:
            "Compare residential plots, investment plots, villa plots, and gated community plot options from Jaguar Properties.",
          popularSearches: "Popular Searches We Support",
          faqs: "FAQs",
          faqTitle: `Questions About ${page.title}`,
          brand: "Jaguar Properties",
          ctaTitle:
            "Speak with our team about premium plots, plot purchase, and land investment.",
          contact: "Contact Jaguar Properties"
        };

  const projects = await getProjects();
  const relatedProjects = projects.filter((project) => page.relatedProjectSlugs.includes(project.slug));
  const imageSrc = resolveImageSrc(page.image);

  return (
    <PageShell>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: labels.home, path: getLocalizedPath("/", locale) },
            { name: page.title, path: getLocalizedPath(`/${page.slug}`, locale) }
          ]),
          buildFaqSchema(page.faqs)
        ]}
      />
      <section className="container py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-primary">
              <MapPin className="h-4 w-4" />
              {page.location} · {page.intent}
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-tight text-foreground dark:text-white sm:text-5xl lg:text-6xl">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-700 dark:text-zinc-300">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={getLocalizedPath("/properties", locale)}>
                  {labels.viewPlotProjects}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={getLocalizedPath("/contact", locale)}>
                  {labels.enquire}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-black/10">
              <Image
                src={imageSrc}
                alt={`${page.title} by Jaguar Properties for ${page.intent}, land investment, and property investment`}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                priority
                unoptimized={shouldBypassImageOptimization(imageSrc)}
              />
            </div>
          </Card>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {page.highlights.map((highlight) => (
            <Card key={highlight} className="p-6">
              <CheckCircle2 className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-display text-2xl text-foreground dark:text-white">
                {highlight}
              </h2>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {page.sections.map((section) => (
            <Card key={section.heading} className="p-8">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h2 className="mt-5 font-display text-3xl text-foreground dark:text-white">
                {section.heading}
              </h2>
              <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">
                {section.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {relatedProjects.length ? (
        <section className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              {labels.related}
            </p>
            <h2 className="mt-4 font-display text-[2.15rem] leading-tight text-foreground dark:text-white sm:text-5xl">
              {labels.relatedTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-700 dark:text-zinc-400">
              {labels.relatedDescription}
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {relatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-8">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="mt-5 font-display text-3xl text-foreground dark:text-white">
              {labels.popularSearches}
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {page.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">{labels.faqs}</p>
            <h2 className="mt-4 font-display text-3xl text-foreground dark:text-white">
              {labels.faqTitle}
            </h2>
            <div className="mt-6 space-y-6">
              {page.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-display text-2xl text-foreground dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="container pb-20 md:pb-24">
        <Card className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              {labels.brand}
            </p>
            <h2 className="mt-4 font-display text-3xl text-foreground dark:text-white">
              {labels.ctaTitle}
            </h2>
          </div>
          <Button asChild size="lg">
            <Link href={getLocalizedPath("/contact", locale)}>
              {labels.contact}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </PageShell>
  );
}
