import { Metadata } from "next";
import { CircleDollarSign, MapPinned, Sparkles } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { FilterBar } from "@/components/site/filter-bar";
import { PropertyCard } from "@/components/site/property-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { getProperties, getSiteContent } from "@/lib/data";
import { parseHighlightItems, resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Property Listings",
  description: "Browse premium property listings across North Bengaluru."
};

export default async function PropertiesPage({
  searchParams
}: {
  searchParams?: {
    search?: string;
    location?: string;
    budget?: string;
    size?: string;
    status?: string;
    category?: string;
  };
}) {
  const [properties, rawSiteContent] = await Promise.all([
    getProperties({
      search: searchParams?.search,
      location: searchParams?.location,
      budget: searchParams?.budget,
      size: searchParams?.size,
      status: searchParams?.status,
      category: searchParams?.category
    }),
    getSiteContent()
  ]);
  const siteContent = resolveSiteContent(rawSiteContent);
  const advantages = parseHighlightItems(siteContent.propertiesHighlights);
  const icons = [MapPinned, CircleDollarSign, Sparkles];

  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={<Translate id="properties.page.eyebrow" defaultText="Listings" />}
            title={siteContent.propertiesTitle}
            description={siteContent.propertiesDescription}
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {advantages.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
              <Card key={item.title} className="h-full p-6">
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-2xl text-foreground dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-400">
                  {item.text}
                </p>
              </Card>
              );
            })}
          </div>
          <FilterBar />
        </div>
        <div className="mt-6 text-sm text-zinc-700 dark:text-zinc-400">
          {properties.length}{" "}
          <Translate
            id={properties.length === 1 ? "filter.propertyFound" : "filter.propertiesFound"}
            defaultText={properties.length === 1 ? "property found" : "properties found"}
          />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {properties.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-black/10 bg-black/[0.03] p-8 text-center text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            <Translate
              id="filter.noProperties"
              defaultText="No properties match the selected filters. Try resetting or broadening your search."
            />
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
