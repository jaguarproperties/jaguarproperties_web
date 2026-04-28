import Image from "next/image";
import { Property, Project } from "@prisma/client";
import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";

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

  return (
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
          <h3 className="mt-2 font-display text-3xl text-foreground">{property.title}</h3>
          <p className="mt-3 line-clamp-5 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            <Translate id={summary} defaultText={summary} />
          </p>
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
          <Button asChild variant="secondary">
            <Link href={`/properties/${property.slug}`}>
              <Translate id="property.viewDetails" defaultText="View Details" />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
