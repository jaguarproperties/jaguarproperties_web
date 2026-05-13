import type { MetadataRoute } from "next";

import { getBlogPosts, getProjects } from "@/lib/data";
import { getCareerOpenings } from "@/lib/careers";
import { footerPages } from "@/lib/footer-pages";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, careers] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getCareerOpenings()
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/properties"),
      changeFrequency: "weekly",
      priority: 0.95
    },
    {
      url: absoluteUrl("/contact"),
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: absoluteUrl("/news"),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: absoluteUrl("/careers"),
      changeFrequency: "weekly",
      priority: 0.6
    }
  ];

  const footerRoutes: MetadataRoute.Sitemap = Object.values(footerPages).map((page) => ({
    url: absoluteUrl(page.href),
    changeFrequency: "monthly",
    priority: 0.55
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/properties/${project.slug}`),
    lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.9
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/news/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const careerRoutes: MetadataRoute.Sitemap = careers.map((job) => ({
    url: absoluteUrl(`/careers/${job.slug}`),
    changeFrequency: "weekly",
    priority: 0.5
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes, ...careerRoutes, ...footerRoutes];
}
