import { Metadata } from "next";
import { CircleDollarSign, MapPinned, Sparkles } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { Card } from "@/components/ui/card";
import { getProjects, getSiteContent } from "@/lib/data";
import { parseHighlightItems, resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse Jaguar projects and premium opportunities across North Bengaluru."
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
    getProjects({
      search: searchParams?.search,
      location: searchParams?.location,
      status: searchParams?.status
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
            eyebrow={<Translate id="projects.page.eyebrow" defaultText="Projects" />}
            title={<TranslateText text={siteContent.propertiesTitle} />}
            description={<TranslateText text={siteContent.propertiesDescription} />}
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {advantages.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
              <Card key={item.title} className="h-full p-6">
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-2xl text-foreground dark:text-white">
                  <TranslateText text={item.title} />
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-400">
                  <TranslateText text={item.text} />
                </p>
              </Card>
              );
            })}
          </div>
        </div>
        <div className="mt-6 text-sm text-zinc-700 dark:text-zinc-400">
          {properties.length}{" "}
          <Translate
            id={properties.length === 1 ? "filter.projectFound" : "filter.projectsFound"}
            defaultText={properties.length === 1 ? "project found" : "projects found"}
          />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {properties.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {properties.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-black/10 bg-black/[0.03] p-8 text-center text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            <Translate
              id="filter.noProjects"
              defaultText="No projects match the selected filters. Try resetting or broadening your search."
            />
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
