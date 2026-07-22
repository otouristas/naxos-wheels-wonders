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
    title: t("termsTitle"),
    alternates: buildAlternates(locale, "/terms"),
    robots: { index: true, follow: true },
  };
}

const clauses = [
  {
    h: "1. Driver requirements",
    p: "The main driver and any additional drivers must hold a valid driving licence held for at least one year and be at least 21 years old. Non-EU licences should be accompanied by an International Driving Permit where required. A valid ID or passport is required at pick-up.",
  },
  {
    h: "2. Rental period & rates",
    p: "The rental period is calculated in 24-hour periods from the time of pick-up. Rates include all taxes and VAT, third-party liability insurance, unlimited mileage, a free additional driver, and free delivery and collection at agreed locations on Naxos. Optional extras such as Collision Damage Waiver (CDW), child seats and additional equipment may be added for a supplement.",
  },
  {
    h: "3. Insurance & liability",
    p: "All vehicles are insured for third-party liability (TPI). The renter is responsible for any damage not covered by the selected insurance package, including but not limited to damage to tyres, the underbody, the interior, and damage caused by off-road driving, negligence, or driving under the influence of alcohol or drugs. Optional CDW reduces the renter's liability.",
  },
  {
    h: "4. Use of the vehicle",
    p: "The vehicle may only be driven on paved public roads and by the drivers named on the rental agreement. Off-road and beach-track driving is not permitted and voids insurance. The vehicle may not be sub-let, used for racing, or taken off the island of Naxos without prior written consent.",
  },
  {
    h: "5. Fuel",
    p: "Vehicles are supplied with an agreed level of fuel and should be returned with the same level. The renter is responsible for using the correct fuel type; misfuelling costs are borne by the renter.",
  },
  {
    h: "6. Accidents, damage & breakdowns",
    p: "In the event of an accident, the renter must ensure safety, contact the 24/7 number on the rental contract, and, in case of injury or dispute, notify the Greek police. We provide 24-hour road assistance and, where necessary, a replacement vehicle. Fines and traffic violations during the rental period are the responsibility of the renter.",
  },
  {
    h: "7. Cancellation",
    p: "Reservations may be cancelled free of charge in line with the cancellation terms confirmed at the time of booking. Contact us as early as possible to amend or cancel a reservation.",
  },
  {
    h: "8. Payment",
    p: "Payment can be made by cash, PayPal, bank transfer or credit card as agreed at booking.",
  },
  {
    h: "9. Governing law",
    p: "These terms are governed by Greek law. Any dispute shall be subject to the competent courts of Naxos, Greece.",
  },
];

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className="container-editorial max-w-3xl py-14 md:py-20">
      <SectionLabel>{t("termsTitle")}</SectionLabel>
      <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("termsTitle")}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("lastUpdated")}: July 2026 · {siteConfig.name}
      </p>

      <div className="mt-8 space-y-5">
        {clauses.map((c) => (
          <div key={c.h} className="rounded-2xl border border-border bg-white p-5 shadow-sunny">
            <h2 className="font-heading text-lg font-bold">{c.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.p}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        {siteConfig.name} · {siteConfig.office} · ΜΗ.Τ.Ε {siteConfig.mhte} · Γ.Ε.ΜΗ{" "}
        {siteConfig.gemi}
      </p>
    </section>
  );
}
