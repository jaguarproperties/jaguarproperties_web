import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { PageShell } from "@/components/layout/page-shell";
import { PropertyGallery } from "@/components/site/property-gallery";
import { Card } from "@/components/ui/card";
import { getBlogPostBySlug } from "@/lib/data";

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt
  };
}

export default async function BlogDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const galleryImages = Array.from(
    new Set([post.coverImage, ...(post.media ?? []).map((item) => item.url)].filter(Boolean))
  );

  return (
    <PageShell>
      <section className="container py-20">
        <Card className="overflow-hidden">
          <div className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              {format(post.publishedAt, "dd MMMM yyyy")}
            </p>
            <h1 className="mt-4 font-display text-5xl text-foreground dark:text-white">{post.title}</h1>
            <div className="mt-8">
              <PropertyGallery images={galleryImages} title={post.title} />
            </div>
            <div className="prose-luxe mt-8">
              {post.content.split("\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
