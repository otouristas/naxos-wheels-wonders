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

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildSitemapXml() {
  const paths = [
    ...staticPaths,
    ...fleet.map((v) => `/fleet/${v.slug}`),
    ...guideArticles.map((a) => `/guide/${a.slug}`),
    ...blogPosts.map((p) => `/blog/${p.slug}`),
  ];

  const lastmod = new Date().toISOString();

  const urls = paths
    .map((path) => {
      const loc = absoluteUrl(routing.defaultLocale, path);
      const priority = path === "/" ? "1.0" : path.startsWith("/fleet") ? "0.9" : "0.7";
      const changefreq = path === "/" ? "weekly" : "monthly";

      const alternates = [
        ...locales.map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(absoluteUrl(l, path))}" />`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absoluteUrl(routing.defaultLocale, path))}" />`,
      ].join("\n");

      return `<url>
  <loc>${escapeXml(loc)}</loc>
${alternates}
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export async function GET() {
  const body = buildSitemapXml();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
