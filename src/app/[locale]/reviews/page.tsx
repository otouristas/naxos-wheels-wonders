import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Star, Quote, ShieldCheck, ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { reviews } from "@/lib/reviews-data";
import { siteConfig } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });
  return {
    title: t("title"),
    description: t("subtitle", {
      rating: siteConfig.rating.toFixed(1),
      count: siteConfig.reviewCount,
    }),
    alternates: buildAlternates(locale, "/reviews"),
  };
}

function formatReviewDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reviews");

  return (
    <section className="container-editorial py-14 md:py-20">
      <SectionLabel>{t("eyebrow")}</SectionLabel>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="max-w-3xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("subtitle", {
              rating: siteConfig.rating.toFixed(1),
              count: siteConfig.reviewCount,
            })}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("showing", { shown: reviews.length, count: siteConfig.reviewCount })}
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-white px-6 py-4 shadow-sunny">
          <span className="font-heading text-5xl font-extrabold text-primary">
            {siteConfig.rating.toFixed(1)}
          </span>
          <div>
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {t("googleCount", { count: siteConfig.reviewCount })}
            </p>
            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              {t("viewOnGoogle")}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
        {reviews.map((r) => (
          <figure
            key={`${r.author}-${r.date}-${r.text.slice(0, 24)}`}
            className="break-inside-avoid rounded-3xl border border-border bg-white p-6 shadow-sunny"
          >
            <div className="flex items-center justify-between gap-3">
              <Quote className="h-6 w-6 shrink-0 text-primary/25" />
              <div className="flex" aria-label={`${r.rating} stars`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-3">
              <div>
                <span className="block text-sm font-bold">{r.author}</span>
                <time className="text-[11px] text-muted-foreground" dateTime={r.date}>
                  {formatReviewDate(r.date, locale)}
                </time>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {t("verified")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href={siteConfig.social.googleReview}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          {t("writeReview")}
        </a>
        <a
          href={siteConfig.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-blue"
        >
          {t("viewOnGoogle")}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
