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
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/news/${post.slug}`,
    image: post.coverImage,
    type: "article",
    keywords: [
      post.title,
      "bangalore real estate",
      "property investment",
      "plot investment"
    ]
  });
}

export default async function BlogDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <PageShell>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
            { name: post.title, path: `/news/${post.slug}` }
          ]),
          buildArticleSchema({
            title: post.title,
            description: post.seoDescription ?? post.excerpt,
            slug: post.slug,
            publishedAt: post.publishedAt,
            image: post.coverImage
          })
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
