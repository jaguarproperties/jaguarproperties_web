import { createOrUpdateBlogPost } from "@/app/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlogImageFields } from "@/components/admin/blog-image-fields";

export function BlogForm({ post }: { post?: Record<string, any> }) {
  return (
    <form
      action={createOrUpdateBlogPost}
      encType="multipart/form-data"
      className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6"
    >
      <input type="hidden" name="id" defaultValue={post?.id} />
      <Input name="title" placeholder="Post title" defaultValue={post?.title} required />
      <Textarea name="excerpt" placeholder="Excerpt" defaultValue={post?.excerpt} required />
      <Textarea name="content" placeholder="Full content" defaultValue={post?.content} required className="min-h-[220px]" />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-zinc-300">
          <Checkbox name="published" defaultChecked={post?.published ?? true} />
          Published
        </label>
      </div>
      <BlogImageFields
        coverImage={post?.coverImage}
        gallery={post?.gallery}
        title={post?.title}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="seoTitle" placeholder="SEO title" defaultValue={post?.seoTitle} />
        <Input name="seoDescription" placeholder="SEO description" defaultValue={post?.seoDescription} />
      </div>
      <Button type="submit" className="w-fit">
        {post ? "Update Post" : "Publish Post"}
      </Button>
    </form>
  );
}
