import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Ruler } from "lucide-react";
import type { ProjectStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { resolveImageSrc, shouldBypassImageOptimization } from "@/lib/image";
import { getLocalizedPath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

type ProjectCardRecord = {
  title: string;
  slug: string;
  coverImage: string;
  summary: string;
  location: string;
  city: string;
  areaSqFt?: number | null;
  areaLabel?: string | null;
  tags?: string[];
  status: ProjectStatus | "UPCOMING" | "LAUNCHING" | "COMPLETED";
  priceRange: string;
};

function getPrimaryTag(project: Pick<ProjectCardRecord, "tags" | "status">) {
  return project.tags?.[0] ?? project.status.replaceAll("_", " ");
}

export function ProjectCard({ project }: { project: ProjectCardRecord }) {
  const locale = getRequestLocale();
  const coverImageSrc = resolveImageSrc(project.coverImage);
  const areaLabel = project.areaLabel ?? (project.areaSqFt ? `${project.areaSqFt} sq ft` : "Size on request");
  const tags = project.tags ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="relative h-56 sm:h-72">
        <Link
          href={getLocalizedPath(`/properties/${project.slug}`, locale)}
          aria-label={`View ${project.title} project details`}
          className="absolute inset-0 block"
        >
          <Image
            src={coverImageSrc}
            alt={`${project.title} premium residential plots, villa plots, and gated community plots in ${project.location}, ${project.city}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
            unoptimized={shouldBypassImageOptimization(coverImageSrc)}
          />
        </Link>
        <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground sm:left-5 sm:top-5 sm:px-4 sm:tracking-[0.28em]">
          <TranslateText text={getPrimaryTag(project)} />
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-primary">
            <TranslateText text={project.location} />, <TranslateText text={project.city} />
          </p>
          <h3 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            <Link href={getLocalizedPath(`/properties/${project.slug}`, locale)} className="hover:text-primary">
              <TranslateText text={project.title} />
            </Link>
          </h3>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            <TranslateText text={project.summary} />
          </p>
        </div>

        <div className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
          <span className="flex items-center gap-3">
            <Ruler className="h-4 w-4 text-primary" />
            <span><TranslateText text={areaLabel} /></span>
          </span>
          <span className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span><TranslateText text={project.location} /></span>
          </span>
          {tags.length ? (
            <span>
              {tags.map((tag, index) => (
                <span key={tag}>
                  {index > 0 ? " • " : ""}
                  <TranslateText text={tag} />
                </span>
              ))}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
          <span className="text-lg font-semibold text-foreground sm:text-xl">
            <TranslateText text={project.priceRange} />
          </span>
          <Button asChild variant="secondary" className="w-full min-[430px]:w-auto">
            <Link href={getLocalizedPath(`/properties/${project.slug}`, locale)}>
              <Translate id="property.viewDetails" defaultText="View Details" />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
