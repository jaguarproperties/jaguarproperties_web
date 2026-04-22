import { ContentForm } from "@/components/admin/content-form";
import { getAdminCollections } from "@/lib/data";
import { resolveSiteContent } from "@/lib/site-content";

export default async function AdminContentPage({
  searchParams
}: {
  searchParams?: { saved?: string; error?: string };
}) {
  const { siteContent } = await getAdminCollections();
  const resolvedContent = resolveSiteContent(siteContent);
  const wasSaved = searchParams?.saved === "1";
  const errorMessage = searchParams?.error;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Website CMS</p>
        <h1 className="mt-3 font-display text-5xl text-white">Website Content</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
          Update the website sections that are not part of listings, projects, blog posts, or job postings.
          Each change here flows directly to the public website and stays stored in the database.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Current Homepage</p>
          <h2 className="mt-3 font-display text-2xl text-white">{resolvedContent.heroTitle}</h2>
          <p className="mt-3 line-clamp-4 text-sm leading-7 text-zinc-400">{resolvedContent.heroSubtitle}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Current Contact</p>
          <p className="mt-3 text-sm font-semibold text-white">{resolvedContent.contactEmail}</p>
          <p className="mt-2 text-sm text-zinc-300">{resolvedContent.contactPhone}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-400">{resolvedContent.officeAddress}</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Current Footer</p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{resolvedContent.footerBlurb}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-zinc-500">Social Links</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-400">
            <p>Instagram: {resolvedContent.instagramUrl}</p>
            <p>Facebook: {resolvedContent.facebookUrl}</p>
            <p>LinkedIn: {resolvedContent.linkedinUrl}</p>
          </div>
        </div>
      </section>

      {wasSaved ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Website content saved. Public website pages have been refreshed with the latest text.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[24px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-100">
          Could not save website content. {errorMessage}
        </div>
      ) : null}

      <ContentForm content={resolvedContent} />
    </div>
  );
}
