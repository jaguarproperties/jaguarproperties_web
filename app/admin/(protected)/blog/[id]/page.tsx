import { notFound } from "next/navigation";

import { BlogForm } from "@/components/admin/blog-form";
import { getAdminCollections } from "@/lib/data";

export default async function EditBlogPostPage({
  params
}: {
  params: { id: string };
}) {
  const { posts } = await getAdminCollections();
  const postRecord = posts.find((item) => item.id === params.id);

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
      <BlogForm post={post} />
    </div>
  );
}
