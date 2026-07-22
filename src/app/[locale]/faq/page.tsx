import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus, MessageCircle, Phone } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { FaqSchema } from "@/components/site/structured-data";
import { siteConfig } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

const faqKeys = [
  "insured",
  "accident",
  "pickup",
  "breakdown",
  "payment",
  "howToRent",
  "contactTime",
  "fines",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/faq"),
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const items = faqKeys.map((k) => ({
    q: t(`items.${k}.q`),
    a: t(`items.${k}.a`),
  }));

  return (
    <>
      <FaqSchema items={items} />
      <section className="container-editorial py-14 md:py-20">
        <SectionLabel>{t("eyebrow")}</SectionLabel>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            {items.map((item) => (
              <details
                key={item.q}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sunny open:shadow-sunny-lg"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                  <span className="font-heading text-base font-bold md:text-lg">{item.q}</span>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Plus className="h-4 w-4 transition-transform group-open:rotate-45" />
                  </span>
                </summary>
                <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sunny-lg">
              <p className="font-heading text-lg font-bold">{t("subtitle")}</p>
              <div className="mt-5 space-y-3">
                <a
                  href={`tel:${siteConfig.phonePrimaryHref}`}
                  className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phonePrimary}
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-5 py-3 text-sm font-bold"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
