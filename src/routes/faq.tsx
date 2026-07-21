import { createFileRoute } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/section-label";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Naxos Auto Rent" },
      { name: "description", content: "Everything you need to know about renting a car on Naxos — delivery, insurance, driver age, deposits, and ferry pickups." },
      { property: "og:title", content: "FAQ — Naxos Auto Rent" },
      { property: "og:description", content: "Answers to the questions we get most often about renting on Naxos." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  { q: "Do you deliver to the port and the airport?", a: "Yes, both — at no extra cost. We meet every ferry and every flight." },
  { q: "What's the minimum driver age?", a: "21 years old with a licence held for at least one year. A young-driver fee applies under 25." },
  { q: "Is insurance really included?", a: "Fully comprehensive insurance, unlimited mileage, and second-driver cover are included in the price you see. No excess games." },
  { q: "Do I need an International Driving Permit?", a: "EU / UK / US / Canadian / Australian licences are accepted as-is. Other countries: yes, please bring an IDP." },
  { q: "Can I take the car on a ferry to another island?", a: "Yes, with advance notice. There's a small paperwork fee — we handle everything." },
  { q: "What happens if the car breaks down?", a: "24/7 roadside assistance across the whole island. In most cases we swap the car within the hour." },
  { q: "How is payment handled?", a: "Deposit at pickup by card or cash. Full payment on collection. Stripe checkout for advance deposits arrives in Phase 2." },
];

function FAQ() {
  return (
    <div>
      <section className="container-editorial pb-16 pt-24 md:pt-32">
        <SectionLabel index="—">FAQ</SectionLabel>
        <h1 className="mt-8 font-serif text-6xl leading-[0.95] md:text-8xl">
          The <em className="text-accent">short</em> version.
        </h1>
      </section>

      <section className="container-editorial pb-28">
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer items-baseline justify-between gap-6 py-6 md:py-8">
                <div className="flex items-baseline gap-6">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl md:text-3xl">{f.q}</span>
                </div>
                <span className="text-2xl text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="pb-8 pl-14 pr-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}