"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Property, Project } from "@prisma/client";
import { ArrowRight, MapPin, Ruler, X } from "lucide-react";

import { Translate } from "@/components/site/translate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { propertyShowcaseBySlug } from "@/lib/property-showcase";

export function PropertyCard({
  property
}: {
  property: Property & { project?: Project | null };
}) {
  const details = propertyShowcaseBySlug[property.slug];
  const areaLabel = details?.areaLabel ?? (property.areaSqFt ? `${property.areaSqFt} sq.ft.` : "Size on request");
  const categoryLabel = details?.categoryLabel ?? "Premium Listing";
  const locationLabel = details?.locationLabel ?? property.location;
  const badge = details?.badge ?? "Listing";
  const summary = details?.summary ?? property.description;
  const detailTitle = details?.detailTitle ?? property.title;
  const detailBody = details?.detailBody ?? property.description;
  const highlights = details?.highlights ?? [];

  return (
    <Dialog.Root>
      <Card className="overflow-hidden">
        <div className="relative h-72">
          <Image
            src={property.coverImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute left-5 top-5 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground">
            <Translate id={badge} defaultText={badge} />
          </div>
        </div>
        <div className="space-y-5 p-6">
          <div>
            <p className="text-sm font-medium text-primary">{property.title}, {property.location}</p>
            <h3 className="mt-2 font-display text-3xl text-foreground">
              <Translate id={summary} defaultText={summary} />
            </h3>
          </div>

          <div className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-3">
              <Ruler className="h-4 w-4 text-primary" />
              <Translate id={areaLabel} defaultText={areaLabel} />
            </span>
            <span><Translate id={categoryLabel} defaultText={categoryLabel} /></span>
            <span><Translate id={locationLabel} defaultText={locationLabel} /></span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-foreground">{property.price}</span>
            <Dialog.Trigger asChild>
              <Button variant="secondary">
                <Translate id="property.viewDetails" defaultText="View Details" />
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Dialog.Trigger>
          </div>
        </div>
      </Card>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-2xl outline-none dark:border-white/10 dark:bg-zinc-950">
          <div className="relative h-64 sm:h-80">
            <Image
              src={property.coverImage}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 92vw, 760px"
              className="object-cover"
            />
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-foreground">
                <Translate id={badge} defaultText={badge} />
              </span>
              <span className="rounded-full border border-black/10 px-4 py-2 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
                {property.price}
              </span>
            </div>

            <div>
              <Dialog.Title className="font-display text-4xl text-foreground">
                <Translate id={detailTitle} defaultText={detailTitle} />
              </Dialog.Title>
              <p className="mt-3 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-400">
                <MapPin className="h-4 w-4 text-primary" />
                {property.address}
              </p>
            </div>

            <div className="grid gap-4 rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  <Translate id="filter.size" defaultText="Plot Size" />
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  <Translate id={areaLabel} defaultText={areaLabel} />
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  <Translate id="filter.projectCategory" defaultText="Category" />
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  <Translate id={categoryLabel} defaultText={categoryLabel} />
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  <Translate id="filter.location" defaultText="Location" />
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  <Translate id={locationLabel} defaultText={locationLabel} />
                </p>
              </div>
            </div>

            <Dialog.Description className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
              <Translate id={detailBody} defaultText={detailBody} />
            </Dialog.Description>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">
                <Translate id="property.highlights" defaultText="Project Highlights" />
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-black/10 bg-black/[0.03] p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                  >
                    <Translate id={item} defaultText={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
