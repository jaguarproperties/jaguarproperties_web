import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Ruler } from "lucide-react";
import type { ProjectStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { resolveImageSrc, shouldBypassImageOptimization } from "@/lib/image";

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
  const coverImageSrc = resolveImageSrc(project.coverImage);
  const areaLabel = project.areaLabel ?? (project.areaSqFt ? `${project.areaSqFt} sq ft` : "Size on request");
  const tags = project.tags ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="relative h-72">
        <Image
          src={coverImageSrc}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          unoptimized={shouldBypassImageOptimization(coverImageSrc)}
        />
        <div className="absolute left-5 top-5 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground">
          <TranslateText text={getPrimaryTag(project)} />
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <p className="text-sm font-medium text-primary">
            <TranslateText text={project.location} />, <TranslateText text={project.city} />
          </p>
          <h3 className="mt-2 font-display text-3xl text-foreground"><TranslateText text={project.title} /></h3>
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
          {tags.length ? <span>{tags.map((tag) => tag).join(" • ")}</span> : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xl font-semibold text-foreground">{project.priceRange}</span>
          <Button asChild variant="secondary">
            <Link href={`/properties/${project.slug}`}>
              <Translate id="property.viewDetails" defaultText="View Details" />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
