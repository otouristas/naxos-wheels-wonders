import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { FleetCatalog } from "@/components/site/fleet-catalog";
import { buildBookingUrl } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fleet" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/fleet"),
  };
}

export default async function FleetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("fleet");
  const tc = await getTranslations("cta");

  return (
    <section className="container-editorial py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel>{t("eyebrow")}</SectionLabel>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Link
          href={buildBookingUrl()}
          className="btn-primary"
        >
          {tc("checkPrices")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10">
        <FleetCatalog />
      </div>
    </section>
  );
}
