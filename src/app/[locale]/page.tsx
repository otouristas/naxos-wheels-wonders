import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Star, Banknote, Truck, Car, Compass, ArrowRight, MapPin, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/site/section-label";
import { HomeHero } from "@/components/site/home-hero";
import { FleetCard } from "@/components/site/fleet-card";
import { TouristasFinder } from "@/components/site/touristas-finder";
import { GoogleG } from "@/components/site/google-g";
import { ReviewCard } from "@/components/site/review-card";
import { fleet } from "@/lib/fleet-data";
import { guideArticles } from "@/lib/guide-data";
import { blogPosts } from "@/lib/blog-data";
import { reviewsSorted } from "@/lib/reviews-data";
import { siteConfig, buildBookingUrl, bookingLocations } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: `${siteConfig.name}: Car Rental on Naxos Island`,
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("cta");
  const tb = await getTranslations("booking");

  const whyItems = [
    { icon: Banknote, title: t("why.priceTitle"), body: t("why.priceBody"), tone: "bg-accent/25" },
    {
      icon: Truck,
      title: t("why.deliveryTitle"),
      body: t("why.deliveryBody"),
      tone: "bg-primary/10",
    },
    { icon: Car, title: t("why.fleetTitle"), body: t("why.fleetBody"), tone: "bg-sea/20" },
    { icon: Compass, title: t("why.localTitle"), body: t("why.localBody"), tone: "bg-sand" },
  ];

  const featuredFleet = fleet.slice(0, 6);
  const featuredGuides = guideArticles.slice(0, 3);
  const featuredPosts = blogPosts.slice(0, 3);
  const featuredReviews = reviewsSorted.slice(0, 3);
  const tr = await getTranslations("reviews");

  return (
    <>
      <HomeHero />

      {/* Why us: offset for overlapping trust strip */}
      <section className="container-editorial pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{t("whyTitle")}</SectionLabel>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("whyTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("whySubtitle")}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-white p-6 shadow-sunny transition-transform hover:-translate-y-1"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}
              >
                <item.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet preview */}
      <section className="bg-secondary/40 py-16 md:py-20">
        <div className="container-editorial">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel tone="blue">{t("fleetTitle")}</SectionLabel>
              <h2 className="mt-4 max-w-2xl font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                {t("fleetTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{t("fleetSubtitle")}</p>
            </div>
            <Link href="/fleet" className="btn-blue">
              {tc("viewFleet")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFleet.map((v) => (
              <FleetCard key={v.slug} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Touristas AI */}
      <section className="container-editorial py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>{t("aiPoweredBy")}</SectionLabel>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("aiTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("aiSubtitle")}</p>
        </div>
        <div className="mx-auto mt-10 max-w-5xl">
          <TouristasFinder />
        </div>
      </section>

      {/* Guide preview */}
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container-editorial">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>{t("guideTitle")}</SectionLabel>
              <h2 className="mt-4 max-w-2xl font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                {t("guideTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-primary-foreground/80">{t("guideSubtitle")}</p>
            </div>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground"
            >
              {tc("explore")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="group overflow-hidden rounded-3xl bg-white text-foreground shadow-sunny-lg transition-transform hover:-translate-y-1"
              >
                <div
                  className="aspect-[16/10] bg-cover bg-center"
                  style={{ backgroundImage: `url(${g.heroImage})` }}
                />
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                    {g.category}
                  </span>
                  <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{g.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{g.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    {tc("readMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-editorial py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel tone="blue">{t("reviewsTitle")}</SectionLabel>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("reviewsTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("reviewsSubtitle", {
              rating: siteConfig.rating.toFixed(1),
              count: siteConfig.reviewCount,
            })}
          </p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2.5 shadow-sunny">
            <GoogleG className="h-5 w-5" title="Google" />
            <span className="font-heading text-2xl font-extrabold text-primary">
              {siteConfig.rating.toFixed(1)}
            </span>
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[#FBBC04] text-[#FBBC04]" />
              ))}
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {tr("googleCount", { count: siteConfig.reviewCount })}
            </span>
            <a
              href={siteConfig.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              {tr("viewOnGoogle")}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid items-start gap-5 md:grid-cols-3">
          {featuredReviews.map((r) => (
            <ReviewCard
              key={`${r.author}-${r.date}`}
              review={r}
              locale={locale}
              expandable={false}
            />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/reviews" className="btn-blue">
            {tc("seeAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={siteConfig.social.googleReview}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <GoogleG className="h-4 w-4" />
            {tr("writeReview")}
          </a>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-secondary/50 py-14">
        <div className="container-editorial">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>{t("locationsTitle")}</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight">
              {t("locationsTitle")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("locationsSubtitle")}</p>
          </div>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {bookingLocations.map((loc) => (
              <span
                key={loc.key}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold shadow-sunny"
              >
                <MapPin className="h-4 w-4 text-primary" />
                {tb(`locations.${loc.labelKey}`)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="container-editorial py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">{t("blogTitle")}</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
              {t("blogTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{t("blogSubtitle")}</p>
          </div>
          <Link href="/blog" className="btn-blue">
            {tc("seeAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group overflow-hidden rounded-3xl border border-border bg-white shadow-sunny transition-all hover:-translate-y-1 hover:shadow-sunny-lg"
            >
              <div
                className="aspect-[16/10] bg-cover bg-center"
                style={{ backgroundImage: `url(${p.heroImage})` }}
              />
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {p.tag}
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-editorial pb-16 md:pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-sea px-6 py-14 text-center text-white shadow-sunny-lg md:px-12 md:py-16">
          <h2 className="mx-auto max-w-3xl font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">{t("ctaSubtitle")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={buildBookingUrl()}
              className="btn-primary"
            >
              {tc("bookOnline")}
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsappHref}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-primary"
            >
              {tc("whatsapp")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
