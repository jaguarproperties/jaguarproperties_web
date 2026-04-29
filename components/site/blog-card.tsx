import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@prisma/client";
import { format } from "date-fns";

import { Translate } from "@/components/site/translate";
import { Card } from "@/components/ui/card";
import { shouldBypassImageOptimization } from "@/lib/image";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
          unoptimized={shouldBypassImageOptimization(post.coverImage)}
        />
      </div>
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">{format(post.publishedAt, "dd MMM yyyy")}</p>
        <h3 className="mt-3 font-display text-3xl text-foreground">{post.title}</h3>
        <p className="mt-3 line-clamp-5 text-sm leading-6 text-zinc-700 dark:text-zinc-400">{post.excerpt}</p>
        <Link href={`/news/${post.slug}`} className="mt-5 inline-block text-sm text-primary">
          <Translate id="button.readArticle" defaultText="Read article" />
        </Link>
      </div>
    </Card>
  );
}
