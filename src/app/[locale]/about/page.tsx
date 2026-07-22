import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/site/section-label";
import { siteConfig, buildBookingUrl } from "@/lib/site-config";
import { pexelsCredits } from "@/lib/pexels-credits";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("body1"),
    alternates: buildAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("cta");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label", { count: siteConfig.reviewCount }) },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section className="container-editorial py-14 md:py-20">
      <SectionLabel>{t("eyebrow")}</SectionLabel>
      <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("title")}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sunny-lg">
          <Image
            src="/naxos/hero.jpg"
            alt={pexelsCredits.hero.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-4 text-base leading-relaxed text-foreground/90 md:text-lg">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
          <p>{t("body3")}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-border bg-white p-6 text-center shadow-sunny"
          >
            <p className="font-heading text-3xl font-extrabold text-primary md:text-4xl">
              {s.value}
            </p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={buildBookingUrl()}
          className="btn-primary"
        >
          {tc("bookOnline")}
        </Link>
        <Link href="/fleet" className="btn-blue">
          {tc("viewFleet")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
