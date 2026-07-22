import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, ArrowLeft, ArrowRight, Star, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/site/section-label";
import { FleetCard } from "@/components/site/fleet-card";
import { RichText } from "@/components/site/rich-text";
import {
  ArticleSchema,
  BreadcrumbSchema,
  FaqSchema,
} from "@/components/site/structured-data";
import { blogPosts, getBlogPost } from "@/lib/blog-data";
import { getGuideArticle } from "@/lib/guide-data";
import { getVehicle } from "@/lib/fleet-data";
import { buildBookingUrl, siteConfig } from "@/lib/site-config";
import { buildAlternates, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const ogImage = `${siteConfig.domain}${post.heroImage}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: buildAlternates(locale, `/blog/${slug}`),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: absoluteUrl(locale, `/blog/${slug}`),
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPost(slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const tg = await getTranslations("guide");
  const tc = await getTranslations("cta");
  const ti = await getTranslations("indicators");

  const cars = post.relatedVehicles
    .map((s) => getVehicle(s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const relatedGuides = (post.relatedGuides ?? [])
    .map((s) => getGuideArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const relatedPosts = (post.relatedPosts ?? [])
    .map((s) => getBlogPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const midIndex = Math.min(2, Math.max(1, Math.floor(post.sections.length / 2)));

  return (
    <>
      <ArticleSchema
        headline={post.title}
        description={post.excerpt}
        image={`${siteConfig.domain}${post.heroImage}`}
        url={absoluteUrl(locale, `/blog/${slug}`)}
      />
      <BreadcrumbSchema
        items={[
          { name: siteConfig.name, url: absoluteUrl(locale, "/") },
          { name: t("eyebrow"), url: absoluteUrl(locale, "/blog") },
          { name: post.title, url: absoluteUrl(locale, `/blog/${slug}`) },
        ]}
      />
      {post.faq?.length ? <FaqSchema items={post.faq} /> : null}

      <article className="container-editorial py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <SectionLabel tone="blue">{post.tag}</SectionLabel>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>
              {t("published")}{" "}
              {new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readMinutes} min
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {ti("rating", { count: siteConfig.reviewCount })}
            </span>
          </div>
        </div>

        <div
          className="mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl bg-cover bg-center shadow-sunny"
          style={{ backgroundImage: `url(${post.heroImage})` }}
        />

        <div className="mx-auto mt-10 max-w-2xl">
          <RichText
            text={post.intro}
            className="font-heading text-xl font-semibold leading-relaxed md:text-2xl"
          />

          {post.sections.map((section, si) => (
            <div key={section.heading}>
              <section className="mt-9">
                <h2 className="font-heading text-2xl font-extrabold md:text-3xl">
                  {section.heading}
                </h2>
                {section.body.map((p, i) => (
                  <RichText
                    key={i}
                    text={p}
                    className="mt-3 leading-relaxed text-muted-foreground"
                  />
                ))}
              </section>

              {si === midIndex ? (
                <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-secondary/60 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-heading text-lg font-extrabold text-foreground">
                      {tg("ctaTitle")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{tg("ctaSubtitle")}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link href={buildBookingUrl()} className="btn-primary whitespace-nowrap">
                      {tc("bookOnline")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={`https://wa.me/${siteConfig.whatsappHref}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {tc("whatsapp")}
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          {post.faq?.length ? (
            <section className="mt-12">
              <h2 className="font-heading text-2xl font-extrabold md:text-3xl">{t("faqTitle")}</h2>
              <div className="mt-5 space-y-3">
                {post.faq.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-border bg-white p-5 shadow-sunny"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-base font-bold text-foreground">
                      {item.q}
                      <span className="text-primary transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-10 rounded-3xl bg-primary p-8 text-center text-primary-foreground shadow-sunny-lg">
            <h3 className="font-heading text-2xl font-extrabold">{tc("findCar")}</h3>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link href={buildBookingUrl()} className="btn-primary">
                {tc("bookOnline")}
              </Link>
              <Link
                href="/fleet"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-5 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-primary"
              >
                {tc("viewFleet")}
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToBlog")}
            </Link>
          </div>
        </div>

        {cars.length ? (
          <div className="mt-14 border-t border-border pt-12">
            <SectionLabel>{t("relatedCars")}</SectionLabel>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cars.map((v) => (
                <FleetCard key={v.slug} vehicle={v} />
              ))}
            </div>
          </div>
        ) : null}

        {relatedGuides.length || relatedPosts.length ? (
          <div className="mt-12 border-t border-border pt-12">
            <div className="grid gap-10 md:grid-cols-2">
              {relatedGuides.length ? (
                <div>
                  <SectionLabel tone="sea">{t("relatedGuides")}</SectionLabel>
                  <ul className="mt-5 space-y-3">
                    {relatedGuides.map((g) => (
                      <li key={g.slug}>
                        <Link
                          href={`/guide/${g.slug}`}
                          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 shadow-sunny transition hover:shadow-sunny-lg"
                        >
                          <span className="font-heading font-bold text-foreground">{g.title}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {relatedPosts.length ? (
                <div>
                  <SectionLabel tone="blue">{t("relatedReading")}</SectionLabel>
                  <ul className="mt-5 space-y-3">
                    {relatedPosts.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 shadow-sunny transition hover:shadow-sunny-lg"
                        >
                          <span className="font-heading font-bold text-foreground">{p.title}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}
