import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, ArrowLeft, ArrowRight, Star, MapPin, Gauge, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/site/section-label";
import { RichText } from "@/components/site/rich-text";
import { FleetCard } from "@/components/site/fleet-card";
import {
  ArticleSchema,
  BreadcrumbSchema,
  FaqSchema,
} from "@/components/site/structured-data";
import { GuideDiscoverLinks } from "@/components/site/guide-discover-links";
import { guideArticles, getGuideArticle } from "@/lib/guide-data";
import { getBlogPost } from "@/lib/blog-data";
import { getVehicle } from "@/lib/fleet-data";
import { buildBookingUrl, siteConfig } from "@/lib/site-config";
import { buildAlternates, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return guideArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getGuideArticle(slug);
  if (!article) return {};
  const ogImage = `${siteConfig.domain}${article.heroImage}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: buildAlternates(locale, `/guide/${slug}`),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: absoluteUrl(locale, `/guide/${slug}`),
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getGuideArticle(slug);
  if (!article) notFound();

  const t = await getTranslations("guide");
  const tc = await getTranslations("cta");
  const ti = await getTranslations("indicators");
  const car = getVehicle(article.recommendedVehicle);

  const relatedVehicles = (article.relatedVehicles ?? [])
    .map((s) => getVehicle(s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const relatedGuides = (article.relatedGuides ?? [])
    .map((s) => getGuideArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const relatedPosts = (article.relatedPosts ?? [])
    .map((s) => getBlogPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const midIndex = Math.min(2, Math.max(1, Math.floor(article.sections.length / 2)));

  return (
    <>
      <ArticleSchema
        headline={article.title}
        description={article.excerpt}
        image={`${siteConfig.domain}${article.heroImage}`}
        url={absoluteUrl(locale, `/guide/${slug}`)}
      />
      <BreadcrumbSchema
        items={[
          { name: siteConfig.name, url: absoluteUrl(locale, "/") },
          { name: t("eyebrow"), url: absoluteUrl(locale, "/guide") },
          { name: article.title, url: absoluteUrl(locale, `/guide/${slug}`) },
        ]}
      />
      {article.faq?.length ? <FaqSchema items={article.faq} /> : null}

      <article>
        <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${article.heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/45 to-primary/20" />
          <div className="container-editorial relative flex h-full flex-col justify-end pb-10 text-white">
            <span className="inline-flex w-fit rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
              {article.category}
            </span>
            <h1 className="mt-3 max-w-3xl font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {t("minRead", { min: article.readMinutes })}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" />
                {ti("rating", { count: siteConfig.reviewCount })}
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <MapPin className="h-4 w-4" />
                {ti("airport")}
              </span>
              <span className="hidden items-center gap-1.5 md:flex">
                <Gauge className="h-4 w-4" />
                {ti("mileage")}
              </span>
            </div>
          </div>
        </div>

        <div className="container-editorial grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            <RichText
              text={article.intro}
              className="font-heading text-xl font-semibold leading-relaxed text-foreground md:text-2xl"
            />

            {article.sections.map((section, si) => (
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
                        {t("ctaTitle")}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{t("ctaSubtitle")}</p>
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

            {article.faq?.length ? (
              <section className="mt-12">
                <h2 className="font-heading text-2xl font-extrabold md:text-3xl">
                  {t("faqTitle")}
                </h2>
                <div className="mt-5 space-y-3">
                  {article.faq.map((item) => (
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

            <div className="mt-10">
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("backToGuide")}
              </Link>
            </div>

            <GuideDiscoverLinks locale={locale} slug={slug} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            {car ? (
              <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sunny-lg">
                <div className="bg-primary px-5 py-3">
                  <SectionLabel>{t("relatedCar")}</SectionLabel>
                </div>
                <div className="relative aspect-[4/3] bg-secondary">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-contain p-4"
                    sizes="320px"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold">{car.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{car.idealFor}</p>
                  <p className="mt-3 font-heading text-2xl font-extrabold text-primary">
                    €{car.fromPerDay}
                    <span className="text-sm font-bold text-muted-foreground"> / day</span>
                  </p>
                  <Link
                    href={`/fleet/${car.slug}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary"
                  >
                    {tc("viewCar")}
                  </Link>
                  <Link href={buildBookingUrl()} className="btn-primary mt-2 w-full">
                    {tc("bookOnline")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : null}
          </aside>
        </div>

        {relatedVehicles.length ? (
          <div className="container-editorial border-t border-border py-12">
            <SectionLabel>{t("relatedCar")}</SectionLabel>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedVehicles.map((v) => (
                <FleetCard key={v.slug} vehicle={v} />
              ))}
            </div>
          </div>
        ) : null}

        {relatedGuides.length || relatedPosts.length ? (
          <div className="container-editorial border-t border-border py-12">
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
