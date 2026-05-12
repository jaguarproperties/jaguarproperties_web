import { Building2, Globe2, Landmark, Newspaper } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectCard } from "@/components/site/project-card";
import { TestimonialsMarquee } from "@/components/site/testimonials-marquee";
import { BlogCard } from "@/components/site/blog-card";
import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { HoverLift } from "@/components/motion/hover-lift";
import { getBlogPosts, getFeaturedProjects, getSiteContent, getTestimonials } from "@/lib/data";
import {
  parseLocationItems,
  parseStatItems,
  resolveSiteContent
} from "@/lib/site-content";

export const dynamic = "force-dynamic";

function getYoutubeEmbedUrl(url: unknown) {
  if (typeof url !== "string" || !url.trim()) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.replace("/", "").trim();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }

      if (parsedUrl.pathname.startsWith("/shorts/") || parsedUrl.pathname.startsWith("/live/")) {
        const videoId = parsedUrl.pathname.split("/")[2]?.trim();
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export default async function HomePage() {
  const [rawSiteContent, projects, posts, testimonials] = await Promise.all([
    getSiteContent(),
    getFeaturedProjects(),
    getBlogPosts(),
    getTestimonials()
  ]);
  const siteContent = resolveSiteContent(rawSiteContent);

  const marketHighlights = parseStatItems(siteContent.homeStats);
  const homeLocations = parseLocationItems(siteContent.homePresenceLocations);
  const featuredVideoEmbedUrl = getYoutubeEmbedUrl(siteContent.homeFeaturedVideoUrl);

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
          title={<TranslateText text={siteContent.aboutTitle} />}
          description={<TranslateText text={siteContent.aboutBody} />}
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {marketHighlights.map((item, index) => (
            <Card key={`${item.value}-${index}`} className="p-6">
              <p className="font-display text-4xl text-foreground dark:text-white">{item.value}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-400">
                <TranslateText text={item.label} />
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
                      <TranslateText text={item.text} />
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
          eyebrow={<Translate id="section.featuredProjects.eyebrow" defaultText="Featured Projects" />}
          title={<TranslateText text={siteContent.homeFeaturedPropertiesTitle} />}
          description={<TranslateText text={siteContent.homeFeaturedPropertiesDescription} />}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.08}>
              <HoverLift>
                <ProjectCard project={project} />
              </HoverLift>
            </FadeIn>
          ))}
        </div>
      </section>

      {testimonials.length ? (
        <section id="client-testimonials" className="container scroll-mt-32 py-16 md:py-20">
          <SectionHeading
            eyebrow={<Translate id="section.testimonials.eyebrow" defaultText="Testimonials" />}
            title={
              <Translate
                id="section.testimonials.title"
                defaultText="What clients say after working with Jaguar."
              />
            }
            description={
              <Translate
                id="section.testimonials.description"
                defaultText="Real client feedback, managed from the Client Testimonials section in your admin panel."
              />
            }
          />
          <TestimonialsMarquee testimonials={testimonials} />
        </section>
      ) : null}

      {featuredVideoEmbedUrl ? (
        <section id="featured-video" className="container scroll-mt-32 py-16 md:py-20">
          <SectionHeading
            eyebrow={<Translate id="home.video.eyebrow" defaultText="Featured Video" />}
            title={<Translate id="home.video.title" defaultText="Watch our latest property update." />}
            description={
              <Translate
                id="home.video.description"
                defaultText="A highlighted video showcase placed right before the latest news and announcements."
              />
            }
          />
          <Card className="mt-10 overflow-hidden p-3 sm:p-4">
            <div className="aspect-video overflow-hidden rounded-[24px] bg-black">
              <iframe
                className="h-full w-full"
                src={featuredVideoEmbedUrl}
                title="Featured Jaguar Properties video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </Card>
        </section>
      ) : null}

      <section id="latest-news" className="container scroll-mt-32 py-16 md:py-20">
        <SectionHeading
          eyebrow={<Translate id="section.news.eyebrow" defaultText="News" />}
          title={<TranslateText text={siteContent.homeNewsTitle} />}
          description={<TranslateText text={siteContent.homeNewsDescription} />}
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
              <TranslateText text={siteContent.homeConciergeTitle} />
            </h2>
          </div>
          <Button asChild size="lg">
            <a href={siteContent.homeConciergeButtonHref}>
              <TranslateText text={siteContent.homeConciergeButtonLabel} />
            </a>
          </Button>
        </Card>
      </section>
    </PageShell>
  );
}
