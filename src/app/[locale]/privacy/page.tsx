import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionLabel } from "@/components/site/section-label";
import { siteConfig } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("privacyTitle"),
    alternates: buildAlternates(locale, "/privacy"),
    robots: { index: true, follow: true },
  };
}

const sections = [
  {
    h: "1. Who we are",
    p: `${siteConfig.name} operates this website and provides car rental services on Naxos, Greece. For any privacy question, contact us at ${siteConfig.email}.`,
  },
  {
    h: "2. What we collect",
    p: "We collect the information you provide when you make a booking or contact us, such as your name, email, phone number, rental dates and preferences. When you use our website we may also collect standard technical data (IP address, device and browser type) and, with your consent, analytics data about how the site is used.",
  },
  {
    h: "3. How we use it",
    p: "We use your data to process and confirm your reservation, deliver and collect your vehicle, provide customer support, meet legal and tax obligations, and, where permitted, to improve our service. We do not sell your personal data.",
  },
  {
    h: "4. The Touristas AI car finder",
    p: "When you use our AI car finder, the preferences you enter are used solely to generate a car recommendation. We do not use this input to identify you and do not store it as part of your customer profile.",
  },
  {
    h: "5. Sharing",
    p: "We share data only with service providers necessary to run our business (for example our booking engine and payment providers) and where required by law. These providers are bound to protect your data.",
  },
  {
    h: "6. Your rights",
    p: "Under the GDPR you have the right to access, correct, delete or restrict the processing of your personal data, and to data portability. To exercise these rights, contact us and we will respond within the legal timeframe.",
  },
  {
    h: "7. Retention",
    p: "We keep booking and contract data for as long as required by Greek tax and commercial law, and delete or anonymise other data when it is no longer needed.",
  },
  {
    h: "8. Cookies",
    p: "Our website uses essential cookies to function and, with your consent, analytics cookies to understand usage. You can control cookies through your browser settings.",
  },
];

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="container-editorial max-w-3xl py-14 md:py-20">
      <SectionLabel>{t("privacyTitle")}</SectionLabel>
      <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("privacyTitle")}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("lastUpdated")}: July 2026 · {siteConfig.name}
      </p>

      <div className="mt-8 space-y-5">
        {sections.map((c) => (
          <div key={c.h} className="rounded-2xl border border-border bg-white p-5 shadow-sunny">
            <h2 className="font-heading text-lg font-bold">{c.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
