import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Star, ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { GoogleG } from "@/components/site/google-g";
import { ReviewsList } from "@/components/site/reviews-list";
import { reviewsSorted } from "@/lib/reviews-data";
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
        </div>

        <div className="flex min-w-[240px] items-center gap-4 rounded-3xl border border-border bg-white px-6 py-4 shadow-sunny">
          <div className="flex flex-col items-center gap-1">
            <GoogleG className="h-6 w-6" title="Google" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Google
            </span>
          </div>
          <div className="h-12 w-px bg-border" aria-hidden />
          <span className="font-heading text-5xl font-extrabold text-primary">
            {siteConfig.rating.toFixed(1)}
          </span>
          <div>
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#FBBC04] text-[#FBBC04]" />
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {t("googleCount", { count: siteConfig.reviewCount })}
            </p>
            <p className="text-[11px] font-bold text-primary">{t("fiveStar")}</p>
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

      <ReviewsList reviews={reviewsSorted} locale={locale} />

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
          <GoogleG className="h-4 w-4" />
          {t("viewOnGoogle")}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
