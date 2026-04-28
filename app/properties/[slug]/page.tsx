import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Ruler, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { PropertyGallery } from "@/components/site/property-gallery";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPropertyBySlug } from "@/lib/data";
import { propertyShowcaseBySlug } from "@/lib/property-showcase";

function dedupeImages(images: string[]) {
  return Array.from(new Set(images.map((image) => image.trim()).filter(Boolean)));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) return {};

  return {
    title: property.title,
    description: property.description
  };
}

export default async function PropertyDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) notFound();

  const details = propertyShowcaseBySlug[property.slug];
  const areaLabel = details?.areaLabel ?? (property.areaSqFt ? `${property.areaSqFt} sq.ft.` : "Size on request");
  const categoryLabel = details?.categoryLabel ?? "Premium Listing";
  const locationLabel = details?.locationLabel ?? property.location;
  const badge = details?.badge ?? "Listing";
  const detailTitle = details?.detailTitle ?? property.title;
  const detailBody = details?.detailBody ?? property.description;
  const highlights = details?.highlights ?? [];
  const galleryImages = dedupeImages([
    property.coverImage,
    ...(property.gallery ?? []),
    ...(details?.gallery ?? [])
  ]);

  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <div className="space-y-8">
          <Button asChild variant="ghost" className="w-fit">
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Link>
          </Button>

          <SectionHeading
            eyebrow={<Translate id={badge} defaultText={badge} />}
            title={detailTitle}
            description={detailBody}
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <PropertyGallery images={galleryImages} title={property.title} />

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground">
                    <Translate id={badge} defaultText={badge} />
                  </span>
                  <span className="rounded-full border border-black/10 px-4 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                    {property.price}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{property.address}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <Ruler className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{areaLabel}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <Building2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{categoryLabel}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{locationLabel}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-display text-3xl text-foreground dark:text-white">Overview</h2>
                <p className="mt-4 text-base leading-8 text-zinc-700 dark:text-zinc-300">{property.description}</p>
              </Card>

              {highlights.length ? (
                <Card className="p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">
                    <Translate id="property.highlights" defaultText="Project Highlights" />
                  </p>
                  <div className="mt-4 grid gap-3">
                    {highlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-[20px] border border-black/10 bg-black/[0.03] p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                      >
                        <Translate id={item} defaultText={item} />
                      </div>
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
