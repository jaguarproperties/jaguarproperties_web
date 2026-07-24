import Link from "next/link";
import { BlogPost } from "@prisma/client";
import { format } from "date-fns";

import { Translate } from "@/components/site/translate";
import { TranslateText } from "@/components/site/translate-text";
import { Card } from "@/components/ui/card";
import { getLocalizedPath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

export function BlogCard({ post }: { post: BlogPost }) {
  const locale = getRequestLocale();

  return (
    <Card className="overflow-hidden">
      <div className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-primary sm:tracking-[0.3em]">{format(post.publishedAt, "dd MMM yyyy")}</p>
        <h3 className="mt-3 font-display text-2xl text-foreground sm:text-3xl">
          <Link href={getLocalizedPath(`/news/${post.slug}`, locale)} className="hover:text-primary">
            <TranslateText text={post.title} />
          </Link>
        </h3>
        <p className="mt-3 line-clamp-5 text-sm leading-6 text-zinc-700 dark:text-zinc-400"><TranslateText text={post.excerpt} /></p>
        <Link href={getLocalizedPath(`/news/${post.slug}`, locale)} className="mt-5 inline-block text-sm text-primary">
          <Translate id="button.readArticle" defaultText="Read article" />
        </Link>
      </div>
    </Card>
  );
}
