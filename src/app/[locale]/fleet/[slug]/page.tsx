import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Check,
  Users,
  DoorOpen,
  Briefcase,
  Cog,
  Fuel,
  Gauge,
  Snowflake,
  ArrowRight,
  ArrowLeft,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/site/section-label";
import { FleetCard } from "@/components/site/fleet-card";
import { ProductSchema, BreadcrumbSchema } from "@/components/site/structured-data";
import { fleet, getVehicle } from "@/lib/fleet-data";
import { getFleetReviewCaption } from "@/lib/reviews-data";
import { buildBookingUrl, siteConfig } from "@/lib/site-config";
import { buildAlternates, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return fleet.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return {};
  const ogImage = `${siteConfig.domain}${vehicle.image}`;
  return {
    title: `${vehicle.name}: Car Rental Naxos`,
    description: vehicle.seoDescription,
    alternates: buildAlternates(locale, `/fleet/${slug}`),
    openGraph: {
      title: `${vehicle.name} | ${siteConfig.name}`,
      description: vehicle.seoDescription,
      url: absoluteUrl(locale, `/fleet/${slug}`),
      images: [{ url: ogImage, width: 1200, height: 630, alt: vehicle.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: vehicle.name,
      description: vehicle.seoDescription,
      images: [ogImage],
    },
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const t = await getTranslations("fleet");
  const ts = await getTranslations("fleet.specs");
  const tc = await getTranslations("cta");
  const reviewCaption = getFleetReviewCaption(vehicle.slug);

  const similar = vehicle.similarSlugs
    .map((s) => getVehicle(s))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const specs = [
    { icon: Cog, label: ts("transmission"), value: ts(vehicle.transmission.toLowerCase()) },
    { icon: Users, label: ts("seats"), value: String(vehicle.seats) },
    { icon: DoorOpen, label: ts("doors"), value: String(vehicle.doors) },
    { icon: Briefcase, label: ts("luggage"), value: String(vehicle.luggage) },
    { icon: Fuel, label: ts("fuel"), value: ts(vehicle.fuel.toLowerCase()) },
    ...(vehicle.engineCc
      ? [{ icon: Gauge, label: ts("engine"), value: `${vehicle.engineCc} cc` }]
      : []),
    ...(vehicle.ac ? [{ icon: Snowflake, label: ts("ac"), value: ts("yes") }] : []),
  ];

  return (
    <>
      <ProductSchema
        name={vehicle.name}
        description={vehicle.seoDescription}
        image={`${siteConfig.domain}${vehicle.image}`}
        price={vehicle.fromPerDay}
        url={absoluteUrl(locale, `/fleet/${slug}`)}
      />
      <BreadcrumbSchema
        items={[
          { name: siteConfig.name, url: absoluteUrl(locale, "/") },
          { name: t("eyebrow"), url: absoluteUrl(locale, "/fleet") },
          { name: vehicle.name, url: absoluteUrl(locale, `/fleet/${slug}`) },
        ]}
      />

      <section className="container-editorial py-10 md:py-14">
        <Link
          href="/fleet"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc("backToFleet")}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-secondary to-white shadow-sunny">
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                fill
                priority
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {t(`categories.${vehicle.category}`)}
              </span>
            </div>
            {vehicle.gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {vehicle.gallery.map((g) => (
                  <div
                    key={g}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary"
                  >
                    <Image
                      src={g}
                      alt={vehicle.name}
                      fill
                      className="object-contain p-2"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sunny-lg lg:sticky lg:top-28">
              <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                {vehicle.name}
              </h1>
              <p className="mt-2 text-muted-foreground">{vehicle.tagline}</p>

              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </span>
                <span>
                  {t("googleRated", {
                    rating: siteConfig.rating.toFixed(1),
                    count: siteConfig.reviewCount,
                  })}
                </span>
              </div>

              {reviewCaption ? (
                <blockquote className="mt-3 border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-muted-foreground">
                  <p className="italic">“{reviewCaption.quote}”</p>
                  <cite className="mt-1 block text-xs font-semibold not-italic text-foreground/70">
                    {reviewCaption.author}
                  </cite>
                </blockquote>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {vehicle.vibes.map((v) => (
                  <span
                    key={v}
                    className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold text-primary"
                  >
                    {v}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {t("from")}
                </p>
                <p className="font-heading text-5xl font-extrabold text-primary">
                  €{vehicle.fromPerDay}
                  <span className="text-base font-bold text-muted-foreground"> {t("perDay")}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("sixDayNote", { price: vehicle.sixDayTotal })}
                </p>
                <Link
                  href={buildBookingUrl()}
                  className="btn-primary mt-5 w-full py-4"
                >
                  {tc("reserve")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  {t("priceNote")}
                </p>
              </div>

              <div className="mt-5">
                <SectionLabel tone="blue">{t("idealForLabel")}</SectionLabel>
                <p className="mt-3 text-sm leading-relaxed">{vehicle.idealFor}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {specs.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-white p-4 shadow-sunny"
            >
              <s.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-0.5 text-sm font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sunny md:p-8">
            <SectionLabel>{t("detailIntro")}</SectionLabel>
            <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
              {vehicle.seoDescription}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sunny md:p-8">
            <SectionLabel tone="blue">{t("includedLabel")}</SectionLabel>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {vehicle.included.map((inc) => (
                <li key={inc} className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {inc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {similar.length ? (
        <section className="bg-secondary/50 py-14 md:py-16">
          <div className="container-editorial">
            <SectionLabel>{t("similarLabel")}</SectionLabel>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((v) => (
                <FleetCard key={v.slug} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
