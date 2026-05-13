import { Metadata } from "next";
import { FileText, LineChart, Newspaper } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { BlogCard } from "@/components/site/blog-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { Card } from "@/components/ui/card";
import { getBlogPosts, getSiteContent } from "@/lib/data";
import { JsonLd, buildBreadcrumbSchema, buildMetadata } from "@/lib/seo";
import { parseHighlightItems, resolveSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Bangalore Real Estate News",
  description:
    "Read Jaguar Properties updates, Bangalore real estate insights, plot investment guidance, and market news focused on North Bengaluru growth corridors.",
  path: "/news",
  keywords: [
    "bangalore real estate news",
    "plot investment news",
    "north bangalore real estate updates",
    "property investment insights"
  ]
});

export default async function NewsPage() {
  const [posts, rawSiteContent] = await Promise.all([getBlogPosts(), getSiteContent()]);
  const siteContent = resolveSiteContent(rawSiteContent);
  const editorialTracks = parseHighlightItems(siteContent.newsHighlights);
  const icons = [Newspaper, LineChart, FileText];

  return (
    <PageShell>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News", path: "/news" }
        ])}
      />
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow={<Translate id="news.page.eyebrow" defaultText="Editorial" />}
          title={<TranslateText text={siteContent.newsTitle} />}
          description={<TranslateText text={siteContent.newsDescription} />}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {editorialTracks.map((track, index) => {
            const Icon = icons[index % icons.length];
            return (
            <Card key={track.title} className="h-full p-6">
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-2xl text-foreground dark:text-white">
                <TranslateText text={track.title} />
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-400">
                <TranslateText text={track.text} />
              </p>
            </Card>
            );
          })}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
