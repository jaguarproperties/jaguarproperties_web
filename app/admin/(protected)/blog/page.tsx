import Link from "next/link";

import { deleteBlogPost } from "@/app/actions";
import { BlogForm } from "@/components/admin/blog-form";
import { TableCard } from "@/components/admin/table-card";
import { Button } from "@/components/ui/button";
import { getAdminCollections } from "@/lib/data";

export default async function AdminBlogPage({
  searchParams
}: {
  searchParams?: { created?: string; deleted?: string; error?: string };
}) {
  const { posts } = await getAdminCollections();
  const wasCreated = searchParams?.created === "1";
  const wasDeleted = searchParams?.deleted === "1";
  const errorMessage = searchParams?.error ? decodeURIComponent(searchParams.error) : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin</p>
        <h1 className="mt-3 font-display text-5xl text-white">Manage News</h1>
      </div>

      {wasCreated ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Post created successfully.
        </div>
      ) : null}
      {wasDeleted ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Post deleted successfully.
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-[24px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-100">
          {errorMessage === "1" ? "Could not save this post. Please review the form and try again." : errorMessage}
        </div>
      ) : null}

      <BlogForm />

      <TableCard title="Published Posts">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Published</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-white/10 text-zinc-300">
                <td className="py-3">{post.title}</td>
                <td className="py-3">{post.published ? "Yes" : "No"}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                    </Button>
                    <form action={deleteBlogPost}>
                      <input type="hidden" name="id" value={post.id} />
                      <Button type="submit" variant="secondary" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
