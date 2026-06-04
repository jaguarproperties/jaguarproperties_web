import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import {
  JsonLd,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildMetadata
} from "@/lib/seo";
import { getLocalizedPath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const locale = getRequestLocale();
  const post = (await getBlogPostBySlug(params.slug)) as
    | {
        title: string;
        slug: string;
        excerpt: string;
        seoTitle?: string | null;
        seoDescription?: string | null;
        coverImage: string;
      }
    | null;
  if (!post) return {};

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/news/${post.slug}`,
    locale,
    image: post.coverImage,
    type: "article",
    keywords: [
      post.title,
      "bangalore real estate",
      "property investment",
      "plot investment",
      "premium plots",
      "residential plots",
      "investment plots",
      "land investment",
      "premium plot development",
      "trusted real estate developer",
      "secure land investment",
      "future growth investment"
    ]
  });
}

export default async function BlogDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const locale = getRequestLocale();
  const post = (await getBlogPostBySlug(params.slug)) as
    | {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        coverImage: string;
        seoDescription?: string | null;
        publishedAt: Date | string;
      }
    | null;
  if (!post) notFound();

  return (
    <PageShell>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: getLocalizedPath("/", locale) },
            { name: "News", path: getLocalizedPath("/news", locale) },
            { name: post.title, path: getLocalizedPath(`/news/${post.slug}`, locale) }
          ]),
          buildArticleSchema({
            title: post.title,
            description: post.seoDescription ?? post.excerpt,
            slug: post.slug,
            publishedAt: post.publishedAt,
            image: post.coverImage
          }, locale)
        ]}
      />
      <section className="container py-20">
        <Card className="overflow-hidden">
          <div className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">
              {format(post.publishedAt, "dd MMMM yyyy")}
            </p>
            <h1 className="mt-4 font-display text-5xl text-foreground dark:text-white">{post.title}</h1>
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
