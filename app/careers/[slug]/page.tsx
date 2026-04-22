import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCareerBySlug } from "@/lib/careers";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { CareerApplicationForm } from "@/components/site/career-application-form";

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const job = await getCareerBySlug(params.slug);
  if (!job) return {};

  return {
    title: `${job.title} Careers`,
    description: `Apply for the ${job.title} role at Jaguar Properties.`
  };
}

export default async function CareerDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const job = await getCareerBySlug(params.slug);
  if (!job) notFound();

  return (
    <PageShell>
      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow={<Translate id="career.detail.eyebrow" defaultText="Career Opening" />}
              title={job.title}
              description={
                <>
                  <Translate id="career.detail.openings" defaultText="Number of Opening Positions:" />{" "}
                  {job.openings}
                </>
              }
            />
            <Card className="mt-8 p-8">
              <div className="space-y-5 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
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
                <p>
                  <span className="font-semibold text-foreground dark:text-white">
                    <Translate id="career.qualifications" defaultText="Qualification:" />
                  </span>{" "}
                  <Translate id={job.qualification} defaultText={job.qualification} />
                </p>
                <p>
                  <span className="font-semibold text-foreground dark:text-white">
                    <Translate id="career.experience" defaultText="Experience:" />
                  </span>{" "}
                  <Translate id={job.experience} defaultText={job.experience} />
                </p>
              </div>
            </Card>
          </div>
          <Card className="p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              <Translate id="career.jobApplicationHeading" defaultText="Job Application Form" />
            </p>
            <h2 className="mt-4 font-display text-4xl text-foreground dark:text-white">
              <Translate id="career.applyForRole" defaultText="Apply For" /> <Translate id={job.title} defaultText={job.title} />
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              <Translate
                id="career.formDescription"
                defaultText="Fill out the application below and attach your resume. The application will be emailed with your role details and stored in the admin panel for export."
              />
            </p>
            <div className="mt-8">
              <CareerApplicationForm role={job.title} />
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
