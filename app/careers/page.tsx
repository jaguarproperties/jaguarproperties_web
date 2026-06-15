import type { Metadata } from "next";
import Link from "next/link";

import { getCareerOpenings } from "@/lib/careers";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverLift } from "@/components/motion/hover-lift";
import { getSiteContent } from "@/lib/data";
import { JsonLd, buildBreadcrumbSchema, buildMetadata } from "@/lib/seo";
import { getLocalizedPath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

const employmentTypeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship"
};

function formatEmploymentType(type?: string | null) {
  if (!type) return "Full Time";
  return employmentTypeLabels[type] ?? type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const careerCulturePoints = [
  {
    id: "careers.culture.1",
    text: "A fast-moving real estate environment with exposure to sales, customer advisory, and project operations."
  },
  {
    id: "careers.culture.2",
    text: "Opportunities to grow with a brand focused on premium housing, plotted developments, and market expansion."
  },
  {
    id: "careers.culture.3",
    text: "A team culture built around ownership, relationship-building, and consistent client experience."
  }
];

export async function generateMetadata() {
  const locale = getRequestLocale();

  return buildMetadata({
    title: "Careers at Jaguar Properties",
    description:
      "Explore Jaguar Properties careers across sales, marketing, HR, and customer engagement in Bengaluru and growing real estate markets.",
    path: "/careers",
    locale,
    keywords: [
      "jaguar properties careers",
      "real estate jobs bangalore",
      "sales jobs bengaluru",
      "property careers"
    ]
  });
}

export default async function CareersPage() {
  const locale = getRequestLocale();
  const [careerOpenings, rawSiteContent] = await Promise.all([
    getCareerOpenings(),
    getSiteContent()
  ]);
  const typedCareerOpenings = careerOpenings as Array<{
    slug: string;
    title: string;
    openings: number;
    requirements: string[];
    qualification: string;
    experience: string;
    salary?: string | null;
    type?: string | null;
  }>;
  const siteContent = resolveSiteContent(rawSiteContent);

  return (
    <PageShell>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: getLocalizedPath("/", locale) },
          { name: "Careers", path: getLocalizedPath("/careers", locale) }
        ])}
      />
      <section className="container py-20">
        <SectionHeading
          eyebrow={<Translate id="careers.page.eyebrow" defaultText="Careers" />}
          title={<TranslateText text={siteContent.careersTitle} />}
          description={<TranslateText text={siteContent.careersDescription} />}
        />
        <Card className="mt-10 p-8">
          <h2 className="font-display text-4xl text-foreground dark:text-white">
            <Translate id="careers.whyWork" defaultText="Why work with JaguarProperties" />
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {careerCulturePoints.map((point) => (
              <p key={point.id} className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 text-sm leading-7 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                <Translate id={point.id} defaultText={point.text} />
              </p>
            ))}
          </div>
        </Card>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {typedCareerOpenings.map((job) => (
            <HoverLift key={job.slug}>
              <Card className="h-full p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-primary">
                  <Translate id="career.openings" defaultText="Openings:" /> {job.openings}
                </p>
                <h2 className="mt-4 font-display text-4xl text-foreground dark:text-white">
                  <Translate id={job.title} defaultText={job.title} />
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                  <p><span className="font-semibold text-foreground dark:text-white"><Translate id="career.qualifications" defaultText="Qualification:" /></span> <Translate id={job.qualification} defaultText={job.qualification} /></p>
                  <p><span className="font-semibold text-foreground dark:text-white"><Translate id="career.experience" defaultText="Experience:" /></span> <Translate id={job.experience} defaultText={job.experience} /></p>
                  <p><span className="font-semibold text-foreground dark:text-white"><Translate id="career.salary" defaultText="Salary Range:" /></span> <Translate id={job.salary ?? "Salary range will be shared during screening."} defaultText={job.salary ?? "Salary range will be shared during screening."} /></p>
                  <p><span className="font-semibold text-foreground dark:text-white"><Translate id="career.employmentType" defaultText="Employment Type:" /></span> <Translate id={formatEmploymentType(job.type)} defaultText={formatEmploymentType(job.type)} /></p>
                  <div>
                    <p className="font-semibold text-foreground dark:text-white">
                      <Translate id="career.requirements" defaultText="Requirements" />
                    </p>
                    <ul className="mt-2 list-decimal space-y-2 pl-5">
                      {job.requirements.map((item) => (
                        <li key={item}>
                          <Translate id={item} defaultText={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button asChild className="mt-8">
                  <Link href={`/careers/${job.slug}`}>
                    <Translate id="button.applyNow" defaultText="Apply Now" />
                  </Link>
                </Button>
              </Card>
            </HoverLift>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
