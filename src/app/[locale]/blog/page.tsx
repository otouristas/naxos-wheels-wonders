import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/site/section-label";
import { blogPosts } from "@/lib/blog-data";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  return (
    <section className="container-editorial py-14 md:py-20">
      <SectionLabel>{t("eyebrow")}</SectionLabel>
      <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sunny transition-all hover:-translate-y-1 hover:shadow-sunny-lg"
          >
            <div
              className="aspect-[16/10] bg-cover bg-center"
              style={{ backgroundImage: `url(${p.heroImage})` }}
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {p.tag}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {p.readMinutes} min
                </span>
              </div>
              <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
              <span className="mt-3 text-[11px] font-semibold text-muted-foreground">
                {new Date(p.date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
