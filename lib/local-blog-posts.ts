import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { demoPosts } from "@/lib/demo-data";

export type LocalBlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  media: Array<{ id: string; url: string; alt: string | null; createdAt: Date }>;
};

type SerializedLocalBlogPostRecord = Omit<LocalBlogPostRecord, "publishedAt" | "createdAt" | "updatedAt" | "media"> & {
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  media: Array<{ id: string; url: string; alt: string | null; createdAt: string }>;
};

const storageDir = path.join(process.cwd(), "data");
const storageFile = path.join(storageDir, "blog-posts.json");

function normalizeLocalBlogPost(
  post: SerializedLocalBlogPostRecord | LocalBlogPostRecord
): LocalBlogPostRecord {
  const fallback = demoPosts[0];

  return {
    id: String(post.id),
    title: String(post.title ?? fallback.title),
    slug: String(post.slug ?? fallback.slug),
    excerpt: String(post.excerpt ?? fallback.excerpt),
    content: String(post.content ?? fallback.content),
    coverImage: String(post.coverImage ?? fallback.coverImage),
    seoTitle: post.seoTitle ? String(post.seoTitle) : null,
    seoDescription: post.seoDescription ? String(post.seoDescription) : null,
    published: Boolean(post.published),
    publishedAt: post.publishedAt instanceof Date ? post.publishedAt : new Date(post.publishedAt),
    createdAt: post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt),
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt),
    media: Array.isArray(post.media)
      ? post.media.map((item) => ({
          id: String(item.id),
          url: String(item.url),
          alt: item.alt ? String(item.alt) : null,
          createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt)
        }))
      : []
  };
}

async function ensureLocalBlogPostsFile() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(storageFile, "utf8");
  } catch {
    const initialPosts = demoPosts.map((post, index) =>
      normalizeLocalBlogPost({
        ...post,
        seoTitle: post.seoTitle ?? null,
        seoDescription: post.seoDescription ?? null,
        media: [
          {
            id: `local-blog-media-${index + 1}`,
            url: post.coverImage,
            alt: "Featured news image",
            createdAt: post.createdAt.toISOString()
          }
        ],
        publishedAt: post.publishedAt.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      })
    );
    await writeLocalBlogPosts(initialPosts);
  }
}

async function readLocalBlogPostsFile() {
  await ensureLocalBlogPostsFile();
  const raw = await readFile(storageFile, "utf8");
  const parsed = JSON.parse(raw) as SerializedLocalBlogPostRecord[];
  return parsed.map((post) => normalizeLocalBlogPost(post));
}

async function writeLocalBlogPosts(posts: LocalBlogPostRecord[]) {
  await mkdir(storageDir, { recursive: true });
  const serialized: SerializedLocalBlogPostRecord[] = posts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    media: post.media.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }))
  }));
  await writeFile(storageFile, `${JSON.stringify(serialized, null, 2)}\n`, "utf8");
}

function sortBlogPosts(posts: LocalBlogPostRecord[]) {
  return [...posts].sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());
}

export async function listLocalBlogPosts() {
  return sortBlogPosts(await readLocalBlogPostsFile());
}

export async function listLocalPublishedBlogPosts() {
  return (await listLocalBlogPosts()).filter((post) => post.published);
}

export async function getLocalBlogPostBySlug(slug: string) {
  const posts = await listLocalBlogPosts();
  return posts.find((post) => post.slug === slug && post.published) ?? null;
}

export async function upsertLocalBlogPost(post: LocalBlogPostRecord) {
  const posts = await readLocalBlogPostsFile();
  const index = posts.findIndex((item) => item.id === post.id || item.slug === post.slug);
  const nextPost = normalizeLocalBlogPost(post);

  if (index === -1) {
    posts.unshift(nextPost);
  } else {
    posts[index] = nextPost;
  }

  await writeLocalBlogPosts(posts);
  return nextPost;
}

export async function deleteLocalBlogPost(id: string) {
  const posts = await readLocalBlogPostsFile();
  const nextPosts = posts.filter((post) => post.id !== id);
  await writeLocalBlogPosts(nextPosts);
}
