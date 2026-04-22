import { updateSiteContent } from "@/app/actions";
import { PortfolioGalleryEditor } from "@/components/admin/portfolio-gallery-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CmsHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-6 text-zinc-400">{children}</p>;
}

function SectionCard({
  id,
  title,
  description,
  children
}: {
  id?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl text-white">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-zinc-400">{description}</p>
      </div>
      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
}

export function ContentForm({ content }: { content?: Record<string, any> | null }) {
  const pageSections = [
    ["#homepage-hero", "Homepage"],
    ["#properties-page", "Properties"],
    ["#news-page", "News"],
    ["#portfolio-page", "Portfolio"],
    ["#contact-page", "Contact"],
    ["#careers-page", "Careers"],
    ["#footer-social", "Footer"]
  ];

  return (
    <form action={updateSiteContent} className="space-y-6">
      <input type="hidden" name="id" defaultValue={content?.id} />

      <div className="rounded-[28px] border border-primary/20 bg-primary/10 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Website page options</p>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          Edit the content for each public page below, then click Save Website Content once. The website refreshes after save.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {pageSections.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-primary/40 hover:bg-white/10"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <SectionCard
        id="homepage-hero"
        title="Homepage Hero"
        description="These fields control the homepage banner, its background image, the top CTA buttons, and the right-side highlight cards."
      >
        <CmsHint>The homepage background image is the large image behind the main banner text.</CmsHint>
        <Input name="heroTitle" placeholder="Hero title" defaultValue={content?.heroTitle} required />
        <Textarea name="heroSubtitle" placeholder="Hero subtitle" defaultValue={content?.heroSubtitle} required />
        <div className="space-y-3">
          <Input
            id="hero-image"
            name="heroImage"
            placeholder="Homepage background image path or URL"
            defaultValue={content?.heroImage}
            required
          />
          <CmsHint>Use a static path like `/images/example.jpg` or a full image URL.</CmsHint>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="homePrimaryCtaLabel"
            placeholder="Primary button label"
            defaultValue={content?.homePrimaryCtaLabel}
            required
          />
          <Input
            name="homePrimaryCtaHref"
            placeholder="Primary button link"
            defaultValue={content?.homePrimaryCtaHref}
            required
          />
          <Input
            name="homeSecondaryCtaLabel"
            placeholder="Secondary button label"
            defaultValue={content?.homeSecondaryCtaLabel}
            required
          />
          <Input
            name="homeSecondaryCtaHref"
            placeholder="Secondary button link"
            defaultValue={content?.homeSecondaryCtaHref}
            required
          />
        </div>
        <Textarea
          name="homePresenceLocations"
          placeholder="One location per line"
          defaultValue={content?.homePresenceLocations}
          required
          rows={4}
        />
        <Textarea
          name="homeSignatureText"
          placeholder="Signature living text"
          defaultValue={content?.homeSignatureText}
          required
          rows={3}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="homeSpotlightLabel"
            placeholder="Spotlight label"
            defaultValue={content?.homeSpotlightLabel}
            required
          />
          <Input
            name="homeSpotlightPrice"
            placeholder="Spotlight price"
            defaultValue={content?.homeSpotlightPrice}
            required
          />
        </div>
        <Textarea
          name="homeSpotlightTitle"
          placeholder="Spotlight title"
          defaultValue={content?.homeSpotlightTitle}
          required
          rows={2}
        />
        <Textarea
          name="homeSpotlightText"
          placeholder="Spotlight description"
          defaultValue={content?.homeSpotlightText}
          required
          rows={3}
        />
        <Textarea name="homeStats" placeholder="Value|Description" defaultValue={content?.homeStats} required rows={5} />
        <CmsHint>Use one stat per line in the format `Value|Description`.</CmsHint>
      </SectionCard>

      <SectionCard
        id="homepage-sections"
        title="Homepage Sections"
        description="This controls the about section, supporting stats, featured section headings, homepage portfolio cards, and final CTA."
      >
        <Input name="aboutTitle" placeholder="About section title" defaultValue={content?.aboutTitle} required />
        <Textarea name="aboutBody" placeholder="About text" defaultValue={content?.aboutBody} required rows={4} />
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea name="mission" placeholder="Mission" defaultValue={content?.mission} required rows={4} />
          <Textarea name="vision" placeholder="Vision" defaultValue={content?.vision} required rows={4} />
        </div>
        <Textarea
          name="presenceText"
          placeholder="Presence card text"
          defaultValue={content?.presenceText}
          required
          rows={3}
        />
        <Input
          name="homeFeaturedPropertiesTitle"
          placeholder="Homepage featured properties title"
          defaultValue={content?.homeFeaturedPropertiesTitle}
          required
        />
        <Textarea
          name="homeFeaturedPropertiesDescription"
          placeholder="Homepage featured properties description"
          defaultValue={content?.homeFeaturedPropertiesDescription}
          required
          rows={3}
        />
        <Input
          name="homePortfolioTitle"
          placeholder="Homepage portfolio title"
          defaultValue={content?.homePortfolioTitle}
          required
        />
        <Textarea
          name="homePortfolioDescription"
          placeholder="Homepage portfolio description"
          defaultValue={content?.homePortfolioDescription}
          required
          rows={3}
        />
        <Textarea
          name="homePortfolioItems"
          placeholder="Label|Value|Description"
          defaultValue={content?.homePortfolioItems}
          required
          rows={6}
        />
        <CmsHint>Use one portfolio card per line in the format `Label|Value|Description`.</CmsHint>
        <Input name="homeNewsTitle" placeholder="Homepage news title" defaultValue={content?.homeNewsTitle} required />
        <Textarea
          name="homeNewsDescription"
          placeholder="Homepage news description"
          defaultValue={content?.homeNewsDescription}
          required
          rows={3}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="homeConciergeTitle"
            placeholder="Homepage final CTA title"
            defaultValue={content?.homeConciergeTitle}
            required
          />
          <Input
            name="homeConciergeButtonLabel"
            placeholder="Homepage final CTA button label"
            defaultValue={content?.homeConciergeButtonLabel}
            required
          />
        </div>
        <Input
          name="homeConciergeButtonHref"
          placeholder="Homepage final CTA button link"
          defaultValue={content?.homeConciergeButtonHref}
          required
        />
      </SectionCard>

      <SectionCard
        id="properties-page"
        title="Properties Page"
        description="These fields control the public Properties page heading and highlight cards."
      >
        <Input
          name="propertiesTitle"
          placeholder="Properties page title"
          defaultValue={content?.propertiesTitle}
          required
        />
        <Textarea
          name="propertiesDescription"
          placeholder="Properties page description"
          defaultValue={content?.propertiesDescription}
          required
          rows={3}
        />
        <Textarea
          name="propertiesHighlights"
          placeholder="Title|Description"
          defaultValue={content?.propertiesHighlights}
          required
          rows={5}
        />
        <CmsHint>Use one properties highlight per line in the format `Title|Description`.</CmsHint>
      </SectionCard>

      <SectionCard
        id="news-page"
        title="News Page"
        description="These fields control the public News page heading and editorial highlight cards."
      >
        <Input name="newsTitle" placeholder="News page title" defaultValue={content?.newsTitle} required />
        <Textarea
          name="newsDescription"
          placeholder="News page description"
          defaultValue={content?.newsDescription}
          required
          rows={3}
        />
        <Textarea
          name="newsHighlights"
          placeholder="Title|Description"
          defaultValue={content?.newsHighlights}
          required
          rows={5}
        />
        <CmsHint>Use one news highlight per line in the format `Title|Description`.</CmsHint>
      </SectionCard>

      <SectionCard
        id="portfolio-page"
        title="Portfolio Page"
        description="These fields control the public Portfolio page heading and gallery cards. Each gallery row below edits one image card on the website."
      >
        <Input
          name="portfolioTitle"
          placeholder="Portfolio page title"
          defaultValue={content?.portfolioTitle}
          required
        />
        <Textarea
          name="portfolioDescription"
          placeholder="Portfolio page description"
          defaultValue={content?.portfolioDescription}
          required
          rows={3}
        />
        <PortfolioGalleryEditor defaultValue={content?.portfolioGallery} />
      </SectionCard>

      <SectionCard
        id="contact-page"
        title="Contact Page"
        description="These fields control the public Contact page heading and support cards."
      >
        <Input name="contactTitle" placeholder="Contact page title" defaultValue={content?.contactTitle} required />
        <Textarea
          name="contactDescription"
          placeholder="Contact page description"
          defaultValue={content?.contactDescription}
          required
          rows={3}
        />
        <Textarea
          name="contactSupportPoints"
          placeholder="Title|Description"
          defaultValue={content?.contactSupportPoints}
          required
          rows={5}
        />
        <CmsHint>Use one contact support card per line in the format `Title|Description`.</CmsHint>
      </SectionCard>

      <SectionCard
        id="careers-page"
        title="Careers Page"
        description="These fields control the public Careers page heading and culture points."
      >
        <Input name="careersTitle" placeholder="Careers page title" defaultValue={content?.careersTitle} required />
        <Textarea
          name="careersDescription"
          placeholder="Careers page description"
          defaultValue={content?.careersDescription}
          required
          rows={3}
        />
        <Textarea
          name="careersCulturePoints"
          placeholder="One culture point per line"
          defaultValue={content?.careersCulturePoints}
          required
          rows={5}
        />
      </SectionCard>

      <SectionCard
        id="footer-social"
        title="Contact, Footer, and Social"
        description="These fields are shared by the website footer, contact page, and admin quick references."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="contactEmail" placeholder="Contact email" defaultValue={content?.contactEmail} required />
          <Input name="contactPhone" placeholder="Contact phone" defaultValue={content?.contactPhone} required />
        </div>
        <Textarea
          name="officeAddress"
          placeholder="Office address"
          defaultValue={content?.officeAddress}
          required
          rows={6}
        />
        <Input name="mapEmbedUrl" placeholder="Google Maps embed URL" defaultValue={content?.mapEmbedUrl} required />
        <Textarea name="footerBlurb" placeholder="Footer intro text" defaultValue={content?.footerBlurb} required rows={3} />
        <Textarea
          name="footerCopyright"
          placeholder="Footer copyright line"
          defaultValue={content?.footerCopyright}
          required
          rows={2}
        />
        <Textarea name="footerNote" placeholder="Footer note" defaultValue={content?.footerNote} required rows={2} />
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="instagramUrl" placeholder="Instagram URL" defaultValue={content?.instagramUrl} required />
          <Input name="linkedinUrl" placeholder="LinkedIn URL" defaultValue={content?.linkedinUrl} required />
          <Input name="facebookUrl" placeholder="Facebook URL" defaultValue={content?.facebookUrl} required />
          <Input name="twitterUrl" placeholder="Twitter / X URL" defaultValue={content?.twitterUrl} required />
        </div>
        <Input name="youtubeUrl" placeholder="YouTube URL" defaultValue={content?.youtubeUrl} required />
      </SectionCard>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Website Content
        </Button>
      </div>
    </form>
  );
}
