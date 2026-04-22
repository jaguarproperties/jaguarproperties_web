import type { Metadata } from "next";
import Link from "next/link";

import { getCareerOpenings } from "@/lib/careers";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverLift } from "@/components/motion/hover-lift";
import { getSiteContent } from "@/lib/data";
import { parseLocationItems, resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore careers and current openings at Jaguar Properties."
};

export default async function CareersPage() {
  const [careerOpenings, rawSiteContent] = await Promise.all([getCareerOpenings(), getSiteContent()]);
  const siteContent = resolveSiteContent(rawSiteContent);
  const culturePoints = parseLocationItems(siteContent.careersCulturePoints);

  return (
    <PageShell>
      <section className="container py-20">
        <SectionHeading
          eyebrow={<Translate id="careers.page.eyebrow" defaultText="Careers" />}
          title={siteContent.careersTitle}
          description={siteContent.careersDescription}
        />
        <Card className="mt-10 p-8">
          <h2 className="font-display text-4xl text-foreground dark:text-white">
            <Translate id="careers.whyWork" defaultText="Why work with JaguarProperties" />
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {culturePoints.map((point, index) => (
              <p key={point} className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 text-sm leading-7 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                <Translate id={`careers.culture.${index + 1}`} defaultText={point} />
              </p>
            ))}
          </div>
        </Card>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {careerOpenings.map((job) => (
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
