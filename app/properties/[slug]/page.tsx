import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Ruler, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { PropertyGallery } from "@/components/site/property-gallery";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProjectBySlug } from "@/lib/data";

function dedupeImages(images: string[]) {
  return Array.from(new Set(images.map((image) => image.trim()).filter(Boolean)));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary
  };
}

export default async function ProjectDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const galleryImages = dedupeImages([project.coverImage, ...(project.gallery ?? [])]);
  const areaLabel = project.areaLabel ?? (project.areaSqFt ? `${project.areaSqFt} sq ft` : "Size on request");
  const tags = project.tags.length ? project.tags : [project.status.replaceAll("_", " ")];

  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <div className="space-y-8">
          <Button asChild variant="ghost" className="w-fit">
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4" />
              <Translate id="button.backToProjects" defaultText="Back to Projects" />
            </Link>
          </Button>

          <SectionHeading
            eyebrow={<TranslateText text={tags[0]} />}
            title={<TranslateText text={project.title} />}
            description={<TranslateText text={project.summary} />}
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <PropertyGallery images={galleryImages} title={project.title} />

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-wrap items-center gap-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground"
                    >
                      <TranslateText text={tag} />
                    </span>
                  ))}
                  <span className="rounded-full border border-black/10 px-4 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                    <TranslateText text={project.priceRange} />
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <span><TranslateText text={project.location} />, <TranslateText text={project.city} />, <TranslateText text={project.country} /></span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <Ruler className="mt-0.5 h-4 w-4 text-primary" />
                    <span><TranslateText text={areaLabel} /></span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <Building2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span><TranslateText text={project.status.replaceAll("_", " ")} /></span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <span><TranslateText text={project.priceRange} /></span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-display text-3xl text-foreground dark:text-white">
                  <Translate id="project.overview" defaultText="Overview" />
                </h2>
                <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300"><TranslateText text={project.description} /></p>
              </Card>

              {project.tags.length ? (
                <Card className="p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">
                    <Translate id="project.tags" defaultText="Project Tags" />
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                      >
                        <TranslateText text={tag} />
                      </span>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
