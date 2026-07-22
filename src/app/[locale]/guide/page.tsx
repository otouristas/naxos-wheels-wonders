import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/site/section-label";
import { guideArticles } from "@/lib/guide-data";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/guide"),
  };
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");

  const [featured, ...rest] = guideArticles;

  return (
    <section className="container-editorial py-14 md:py-20">
      <SectionLabel>{t("eyebrow")}</SectionLabel>
      <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>

      <Link
        href={`/guide/${featured.slug}`}
        className="group mt-10 grid overflow-hidden rounded-3xl border border-border bg-white shadow-sunny-lg transition-transform hover:-translate-y-1 lg:grid-cols-2"
      >
        <div
          className="aspect-[16/10] bg-cover bg-center lg:aspect-auto lg:min-h-[320px]"
          style={{ backgroundImage: `url(${featured.heroImage})` }}
        />
        <div className="flex flex-col justify-center p-7 md:p-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            {featured.category}
          </span>
          <h2 className="mt-3 font-heading text-2xl font-extrabold md:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
            {t("readGuide")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((g) => (
          <Link
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sunny transition-all hover:-translate-y-1 hover:shadow-sunny-lg"
          >
            <div
              className="aspect-[16/10] bg-cover bg-center"
              style={{ backgroundImage: `url(${g.heroImage})` }}
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {g.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {t("minRead", { min: g.readMinutes })}
                </span>
              </div>
              <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{g.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
