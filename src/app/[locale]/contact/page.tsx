import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, Mail, MapPin, MessageCircle, Clock, ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { ContactForm } from "@/components/site/contact-form";
import { siteConfig, mapLocations, mapPlaceUrl, mapEmbedUrl } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const officeMap = mapLocations.find((l) => l.key === "office")!;

  return (
    <section className="container-editorial py-14 md:py-20">
      <SectionLabel>{t("eyebrow")}</SectionLabel>
      <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`tel:${siteConfig.phonePrimaryHref}`}
              className="flex flex-col gap-2 rounded-3xl border border-border bg-white p-5 shadow-sunny transition-transform hover:-translate-y-0.5"
            >
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {t("phone")}
              </span>
              <span className="text-sm font-semibold">{siteConfig.phonePrimary}</span>
              <span className="text-sm text-muted-foreground">{siteConfig.phoneSecondary}</span>
            </a>
            <a
              href={`https://wa.me/${siteConfig.whatsappHref}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 rounded-3xl border border-border bg-white p-5 shadow-sunny transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                WhatsApp
              </span>
              <span className="text-sm font-semibold">{t("whatsappCta")}</span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex flex-col gap-2 rounded-3xl border border-border bg-white p-5 shadow-sunny transition-transform hover:-translate-y-0.5"
            >
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {t("email")}
              </span>
              <span className="text-sm font-semibold">{siteConfig.email}</span>
            </a>
            <a
              href={mapPlaceUrl(officeMap.cid)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 rounded-3xl border border-border bg-white p-5 shadow-sunny transition-transform hover:-translate-y-0.5"
            >
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {t("office")}
              </span>
              <span className="text-sm font-semibold">{siteConfig.office}</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                {t("getDirections")}
                <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-secondary px-5 py-4 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {t("hours")}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-sunny-lg md:p-8">
          <ContactForm />
        </div>
      </div>

      {/* Four Google Maps locations */}
      <div className="mt-12">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel tone="blue">{t("mapTitle")}</SectionLabel>
          <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight md:text-3xl">
            {t("mapTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("mapSubtitle")}</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {mapLocations.map((loc) => (
            <div
              key={loc.key}
              className="overflow-hidden rounded-3xl border border-border bg-white shadow-sunny"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <p className="truncate font-heading text-sm font-bold">{t(loc.labelKey)}</p>
                </div>
                <a
                  href={mapPlaceUrl(loc.cid)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground"
                >
                  {t("getDirections")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="relative aspect-[4/3] w-full">
                <iframe
                  title={t(loc.labelKey)}
                  src={mapEmbedUrl(loc.cid)}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
