import type { MetadataRoute } from "next";
import { locales, routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { fleet } from "@/lib/fleet-data";
import { guideArticles } from "@/lib/guide-data";
import { blogPosts } from "@/lib/blog-data";

const staticPaths = [
  "/",
  "/fleet",
  "/book",
  "/guide",
  "/blog",
  "/about",
  "/reviews",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...fleet.map((v) => `/fleet/${v.slug}`),
    ...guideArticles.map((a) => `/guide/${a.slug}`),
    ...blogPosts.map((p) => `/blog/${p.slug}`),
  ];

  return paths.map((path) => {
    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = absoluteUrl(l, path);
    languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
    return {
      url: absoluteUrl(routing.defaultLocale, path),
      lastModified: new Date(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path.startsWith("/fleet") ? 0.9 : 0.7,
      alternates: { languages },
    };
  });
}
