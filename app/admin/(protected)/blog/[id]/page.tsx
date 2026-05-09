import { notFound } from "next/navigation";

import { BlogForm } from "@/components/admin/blog-form";
import { getAdminCollections } from "@/lib/data";

export default async function EditBlogPostPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { updated?: string; error?: string };
}) {
  const { posts } = await getAdminCollections();
  const postRecord = posts.find((item) => item.id === params.id);
  const wasUpdated = searchParams?.updated === "1";
  const errorMessage = searchParams?.error ? decodeURIComponent(searchParams.error) : null;

  if (!postRecord) notFound();

  const post = {
    ...postRecord,
    gallery: (postRecord.media ?? []).map((item) => item.url).filter((url) => url !== postRecord.coverImage)
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin</p>
        <h1 className="mt-3 font-display text-5xl text-white">Edit Post</h1>
      </div>
      {wasUpdated ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Post updated successfully.
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-[24px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-100">
          {errorMessage === "1" ? "Could not save this post. Please review the form and try again." : errorMessage}
        </div>
      ) : null}
      <BlogForm post={post} />
    </div>
  );
}
