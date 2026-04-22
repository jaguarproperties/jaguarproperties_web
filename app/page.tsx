import { Building2, Globe2, Landmark, Newspaper } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { PropertyCard } from "@/components/site/property-card";
import { BlogCard } from "@/components/site/blog-card";
import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { HoverLift } from "@/components/motion/hover-lift";
import { getBlogPosts, getFeaturedProperties, getSiteContent } from "@/lib/data";
import {
  parseLocationItems,
  parsePortfolioItems,
  parseStatItems,
  resolveSiteContent
} from "@/lib/site-content";

export const revalidate = 300;

export default async function HomePage() {
  const [rawSiteContent, properties, posts] = await Promise.all([
    getSiteContent(),
    getFeaturedProperties(),
    getBlogPosts()
  ]);
  const siteContent = resolveSiteContent(rawSiteContent);

  const marketHighlights = parseStatItems(siteContent.homeStats);
  const portfolioStories = parsePortfolioItems(siteContent.homePortfolioItems);
  const homeLocations = parseLocationItems(siteContent.homePresenceLocations);

  return (
    <PageShell>
      <Hero
        title={siteContent.heroTitle}
        subtitle={siteContent.heroSubtitle}
        image={siteContent.heroImage}
        primaryCta={{
          label: siteContent.homePrimaryCtaLabel,
          href: siteContent.homePrimaryCtaHref
        }}
        secondaryCta={{
          label: siteContent.homeSecondaryCtaLabel,
          href: siteContent.homeSecondaryCtaHref
        }}
        locations={homeLocations}
        signatureText={siteContent.homeSignatureText}
        spotlight={{
          label: siteContent.homeSpotlightLabel,
          title: siteContent.homeSpotlightTitle,
          text: siteContent.homeSpotlightText,
          price: siteContent.homeSpotlightPrice
        }}
      />

      <section id="about" className="container scroll-mt-32 py-16 md:py-20">
        <SectionHeading
          eyebrow={<Translate id="about.eyebrow" defaultText="About Us" />}
          title={siteContent.aboutTitle}
          description={siteContent.aboutBody}
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {marketHighlights.map((item, index) => (
            <Card key={`${item.value}-${index}`} className="p-6">
              <p className="font-display text-4xl text-foreground dark:text-white">{item.value}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-400">
                {item.label}
              </p>
            </Card>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Landmark,
              title: "Mission",
              text: siteContent?.mission
            },
            {
              icon: Globe2,
              title: "Vision",
              text: siteContent.vision
            },
            {
              icon: Building2,
              title: "Presence",
              text: siteContent.presenceText
            }
          ].map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08}>
              <HoverLift>
                <Card className="h-full p-6">
                  <item.icon className="h-10 w-10 text-primary" />
                  <h3 className="mt-6 font-display text-3xl text-foreground">
                    <Translate
                      id={`home.values.${item.title.toLowerCase()}`}
                      defaultText={item.title}
                    />
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-400">
                    {item.title === "Presence" ? (
                      <Translate id="about.presence.text" defaultText={item.text ?? ""} />
                    ) : (
                      item.text
                    )}
                  </p>
                </Card>
              </HoverLift>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="featured-properties" className="container scroll-mt-32 py-16 md:py-20">
        <SectionHeading
          eyebrow={<Translate id="section.properties.eyebrow" defaultText="Properties" />}
          title={siteContent.homeFeaturedPropertiesTitle}
          description={siteContent.homeFeaturedPropertiesDescription}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {properties.map((property, index) => (
            <FadeIn key={property.id} delay={index * 0.08}>
              <HoverLift>
                <PropertyCard property={property} />
              </HoverLift>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="portfolio-highlights" className="container scroll-mt-32 py-16 md:py-20">
        <div className="grid gap-6 rounded-[32px] border border-black/10 bg-mesh-gold p-10 dark:border-white/10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              <Translate id="section.portfolio.eyebrow" defaultText="Portfolio" />
            </p>
            <h2 className="mt-4 font-display text-5xl text-foreground dark:text-white">
              {siteContent.homePortfolioTitle}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
              {siteContent.homePortfolioDescription}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {portfolioStories.map((item, index) => (
              <HoverLift key={`${item.label}-${index}`}>
                <Card className="p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">
                    {item.label}
                  </p>
                  <p className="mt-4 font-display text-4xl text-foreground dark:text-white">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-400">
                    {item.text}
                  </p>
                </Card>
              </HoverLift>
            ))}
          </div>
        </div>
      </section>

      <section id="latest-news" className="container scroll-mt-32 py-16 md:py-20">
        <SectionHeading
          eyebrow={<Translate id="section.news.eyebrow" defaultText="News" />}
          title={siteContent.homeNewsTitle}
          description={siteContent.homeNewsDescription}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <FadeIn key={post.id} delay={index * 0.08}>
              <HoverLift>
                <BlogCard post={post} />
              </HoverLift>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="concierge" className="container scroll-mt-32 pb-20 md:pb-24">
        <Card className="flex flex-col items-start justify-between gap-6 p-10 md:flex-row md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-primary">
              <Newspaper className="h-4 w-4" />
              <Translate id="home.concierge.eyebrow" defaultText="Concierge Support" />
            </p>
            <h2 className="mt-4 font-display text-4xl text-foreground dark:text-white">
              {siteContent.homeConciergeTitle}
            </h2>
          </div>
          <Button asChild size="lg">
            <a href={siteContent.homeConciergeButtonHref}>
              <Translate id="section.concierge.button" defaultText={siteContent.homeConciergeButtonLabel} />
            </a>
          </Button>
        </Card>
      </section>
    </PageShell>
  );
}
