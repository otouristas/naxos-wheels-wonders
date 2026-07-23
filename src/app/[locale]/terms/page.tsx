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

type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

type Clause = {
  h: string;
  blocks: Block[];
};

const clauses: Clause[] = [
  {
    h: "1. Driver's License",
    blocks: [
      {
        type: "p",
        text: "Renters must hold a valid European driving license for at least one (1) year, or a valid International Driving Permit for at least one (1) day, provided that the corresponding national driving license has been held for at least one (1) year.",
      },
      {
        type: "p",
        text: "The driving license must be valid and physically presented at the time of vehicle collection. Failure to present a valid driving license and, where required, a valid International Driving Permit (IDP) will result in cancellation of the reservation without refund.",
      },
      {
        type: "p",
        text: "The presentation of a photograph, photocopy, or any digital form of the driving license will not be accepted and will also result in cancellation of the reservation without refund. A digital driving license is accepted exclusively for citizens of the Hellenic Republic and only if presented through the official Greek government digital application, in accordance with applicable Greek legislation.",
      },
      {
        type: "h3",
        text: "Driving Licenses Accepted WITHOUT an International Driving Permit (IDP)",
      },
      {
        type: "p",
        text: "Driving licenses issued by the following countries are accepted without the requirement of an International Driving Permit (IDP):",
      },
      {
        type: "h3",
        text: "European Union (EU) Countries:",
      },
      {
        type: "p",
        text: "Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden.",
      },
      {
        type: "h3",
        text: "European Economic Area (EEA) Countries & Equivalent Agreements:",
      },
      {
        type: "p",
        text: "Switzerland, Norway, Iceland, Liechtenstein.",
      },
      {
        type: "h3",
        text: "Non-EU Countries Recognized in Greece (No IDP Required):",
      },
      {
        type: "p",
        text: "United States of America (USA), Canada, Australia, United Kingdom (UK), Gibraltar.",
      },
      {
        type: "p",
        text: "For all other countries not listed above, an International Driving Permit (IDP) is mandatory and must be presented together with the original national driving license.",
      },
    ],
  },
  {
    h: "2. Minimum – Maximum Age",
    blocks: [
      {
        type: "h3",
        text: "Minimum age requirement:",
      },
      {
        type: "ul",
        items: [
          "23 years old",
          "28 years old for MPVs / 7-seater vehicles",
        ],
      },
      {
        type: "h3",
        text: "Maximum age:",
      },
      {
        type: "ul",
        items: ["75 years old"],
      },
      {
        type: "p",
        text: "Naxos Auto Rent reserves the right to refuse rental if age requirements are not met.",
      },
    ],
  },
  {
    h: "3. Minimum Rental Period",
    blocks: [
      {
        type: "p",
        text: "The minimum rental period is two (2) consecutive days.",
      },
    ],
  },
  {
    h: "4. Rental Policy",
    blocks: [
      {
        type: "p",
        text: "Rental charges are calculated on a calendar-day basis.",
      },
      {
        type: "p",
        text: "Returning the vehicle after 10:30 a.m. will be considered a full additional rental day and will be charged accordingly.",
      },
    ],
  },
  {
    h: "5. Vehicle Insurance – CDW",
    blocks: [
      {
        type: "p",
        text: "All vehicles are insured against third-party liability (excluding the authorized driver) for:",
      },
      {
        type: "ul",
        items: [
          "Death or bodily injury per victim/per accident up to €1,220,000",
          "Material damages (excluding the Naxos Auto Rent vehicle) per accident up to €1,220,000",
          "Theft Insurance (No Excess)",
        ],
      },
      {
        type: "h3",
        text: "Collision Damage Waiver (CDW):",
      },
      {
        type: "p",
        text: "Optional Collision Damage Waiver coverage may be provided at an additional daily charge.",
      },
      {
        type: "h3",
        text: "Insurance Exclusions:",
      },
      {
        type: "ul",
        items: [
          "No insurance coverage applies if the driver is under the influence of alcohol, drugs, or any prohibited substances.",
          "Damages to wheels, tires, windows, the interior, and the underside of the vehicle are not covered by any insurance and remain the full responsibility of the renter.",
          "No insurance coverage applies to loss, theft, or damage of vehicle keys. The full replacement cost of lost or damaged keys is the sole responsibility of the renter.",
          "Personal belongings left inside the vehicle at any time (including but not limited to luggage, cameras, mobile phones, laptops, bags, documents, or other valuables), whether in case of theft, break-in, loss, or damage.",
        ],
      },
      {
        type: "p",
        text: "Any breach of the rental terms voids all insurance coverage.",
      },
    ],
  },
  {
    h: "6. Fines and Traffic Violations",
    blocks: [
      {
        type: "p",
        text: "The renter is fully responsible for any fines resulting from traffic violations, illegal parking, or other offenses during the rental period.",
      },
      {
        type: "p",
        text: "Parking is permitted only in designated parking areas. Parking on central streets, the seafront, and at the port of Naxos main town is strictly prohibited.",
      },
      {
        type: "p",
        text: "Any incident must be reported immediately to Naxos Auto Rent.",
      },
    ],
  },
  {
    h: "7. Prohibited Use",
    blocks: [
      {
        type: "p",
        text: "The following are strictly prohibited:",
      },
      {
        type: "ol",
        items: [
          "Driving off-road, on beaches, or near lakes. All vehicles (except authorized 4×4/jeeps) are prohibited from driving on unpaved roads.",
          "Transportation of persons or goods for hire or reward.",
          "Participation in races, competitions, or speed testing.",
          "Subleasing or renting the vehicle to a third party.",
          "Driving by any person not listed on the rental agreement.",
          "Transportation of heavy goods or excessive luggage beyond the vehicle's permitted capacity.",
        ],
      },
      {
        type: "p",
        text: "Violation of the above terms results in full liability of the renter and cancellation of all insurance coverage.",
      },
    ],
  },
  {
    h: "8. Rates",
    blocks: [
      {
        type: "p",
        text: "Prices and special offers are valid only for reservations made through the official Naxos Auto Rent website.",
      },
      {
        type: "p",
        text: "Naxos Auto Rent reserves the right to modify prices without prior notice.",
      },
    ],
  },
  {
    h: "9. Payment Method & Security Deposit",
    blocks: [
      {
        type: "p",
        text: "A valid credit card is mandatory for every vehicle rental.",
      },
      {
        type: "p",
        text: "We accept all major credit cards and debit cards as payment methods.",
      },
      {
        type: "p",
        text: "However, for the security deposit, only VISA and MasterCard credit cards are accepted. Debit cards are not accepted for the security deposit.",
      },
      {
        type: "p",
        text: "The credit card must be presented at the time of vehicle collection and must have sufficient available balance to cover the required deposit amount.",
      },
      {
        type: "p",
        text: "Naxos Auto Rent reserves the right to refuse the rental if the above payment and deposit requirements are not fulfilled.",
      },
    ],
  },
  {
    h: "10. Taxes",
    blocks: [
      {
        type: "p",
        text: "All rental rates include the applicable 24% VAT.",
      },
    ],
  },
  {
    h: "11. Additional Drivers",
    blocks: [
      {
        type: "p",
        text: "Additional drivers are permitted free of charge.",
      },
      {
        type: "p",
        text: "All additional drivers must meet the same age and driving license requirements as the main driver and must be declared in the rental agreement.",
      },
    ],
  },
  {
    h: "12. Ferrying the Vehicle",
    blocks: [
      {
        type: "p",
        text: "Transportation of the vehicle by ferry is not permitted without prior written authorization.",
      },
    ],
  },
  {
    h: "13. Fuel Policy",
    blocks: [
      {
        type: "p",
        text: "A same-to-same fuel policy applies.",
      },
      {
        type: "p",
        text: "The vehicle must be returned with the same fuel level as delivered. No refund will be provided for unused fuel.",
      },
    ],
  },
  {
    h: "14. Delivery and Collection",
    blocks: [
      {
        type: "p",
        text: "Delivery and collection to/from the airport, port, and hotels within a radius of 10 km from Naxos Port are provided free of charge.",
      },
    ],
  },
  {
    h: "15. Mileage",
    blocks: [
      {
        type: "p",
        text: "Unlimited mileage is included in all rentals.",
      },
    ],
  },
  {
    h: "16. Road Assistance",
    blocks: [
      {
        type: "p",
        text: "24/7 emergency roadside assistance is provided free of charge.",
      },
    ],
  },
  {
    h: "17. Cancellation & No-Show Policy",
    blocks: [
      {
        type: "p",
        text: "The deposit is fully refundable if cancellation is made at least seven (7) days prior to the scheduled arrival date.",
      },
      {
        type: "p",
        text: "If cancellation occurs less than seven (7) days prior to arrival, the deposit is non-refundable.",
      },
      {
        type: "h3",
        text: "No-Show Policy:",
      },
      {
        type: "p",
        text: 'If the renter fails to appear at the agreed rental location, date, and time without prior written notification to Naxos Auto Rent, the reservation will be considered a "No-Show."',
      },
      {
        type: "p",
        text: "This includes cases of delay due to flight or ferry disruptions or any other reason, when no timely prior notification has been provided.",
      },
      {
        type: "p",
        text: "In such cases, the full amount of the reservation will be charged and is non-refundable.",
      },
      {
        type: "p",
        text: "Naxos Auto Rent reserves the right to cancel any reservation in case of false or misleading information, or failure to present the required documentation (valid driving license, credit card, identification, etc.).",
      },
      {
        type: "p",
        text: "Any bank charges, transaction fees, or additional expenses arising from cancellation or reservation modification are borne exclusively by the customer.",
      },
    ],
  },
  {
    h: "18. Reservation Cancellation & Right to Terminate Rental",
    blocks: [
      {
        type: "p",
        text: "Naxos Auto Rent reserves the absolute right to cancel any reservation without refund in the event of false, misleading, or incomplete information provided by the renter, or failure to present the required documentation at the time of vehicle collection (including but not limited to a valid driving license, valid identification and a credit card).",
      },
      {
        type: "p",
        text: "Furthermore, Naxos Auto Rent reserves the right to immediately terminate the rental agreement and request the immediate return of the vehicle, without refund of any unused rental period, if during the rental period it is determined that:",
      },
      {
        type: "ul",
        items: [
          "The renter has violated any of the Terms & Conditions of the rental agreement.",
          "The vehicle is being used in an unauthorized or prohibited manner.",
          "The renter is driving recklessly, dangerously, or in a manner that endangers their own safety, the safety of passengers, third parties, or the property of Naxos Auto Rent.",
        ],
      },
      {
        type: "p",
        text: "In such cases, Naxos Auto Rent shall bear no liability for any direct or indirect damages, losses, or expenses incurred by the renter as a result of such termination.",
      },
    ],
  },
  {
    h: "19. Vehicle Availability",
    blocks: [
      {
        type: "p",
        text: "Naxos Auto Rent reserves the right to provide a different vehicle model from the one originally reserved, of an equivalent or higher category, at no additional charge.",
      },
    ],
  },
  {
    h: "20. Data Protection",
    blocks: [
      {
        type: "p",
        text: "All personal data provided through our website is treated as strictly confidential and will not be disclosed to any third party (natural or legal person), except where required by applicable law or competent authorities.",
      },
      {
        type: "p",
        text: "Personal data will not be used or shared for commercial purposes with third parties.",
      },
    ],
  },
];

function ClauseBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return <p key={i}>{block.text}</p>;
        }
        if (block.type === "h3") {
          return (
            <h3 key={i} className="pt-1 font-heading text-sm font-bold text-foreground">
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={i} className="list-[lower-alpha] space-y-1.5 pl-5">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}

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
      <p className="mt-4 text-sm leading-relaxed text-foreground/80">
        Please read the following Naxos Auto Rent Terms & Conditions carefully before completing
        your reservation.
      </p>

      <div className="mt-8 space-y-5">
        {clauses.map((c) => (
          <div key={c.h} className="rounded-2xl border border-border bg-white p-5 shadow-sunny">
            <h2 className="font-heading text-lg font-bold">{c.h}</h2>
            <ClauseBlocks blocks={c.blocks} />
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
