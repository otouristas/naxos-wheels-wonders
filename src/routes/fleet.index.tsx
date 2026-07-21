import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { fleet, type Vehicle } from "@/lib/fleet-data";
import { SectionLabel } from "@/components/site/section-label";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/fleet/")({
  head: () => ({
    meta: [
      { title: "Fleet — Naxos Auto Rent" },
      { name: "description", content: "Browse our full fleet of cars available on Naxos: economy, compact, SUV, 4x4, cabrio and family cars. All-inclusive pricing." },
      { property: "og:title", content: "Fleet — Naxos Auto Rent" },
      { property: "og:description", content: "Every car we rent on Naxos. Transparent pricing, delivered to your port, airport, or villa." },
    ],
  }),
  component: FleetIndex,
});

const categories = ["All", "Economy", "Compact", "SUV", "Cabrio", "Family"] as const;

function FleetIndex() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const filtered: Vehicle[] = cat === "All" ? fleet : fleet.filter((v) => v.category === cat);

  return (
    <div>
      <section className="container-editorial pb-16 pt-24 md:pt-32">
        <SectionLabel index="—">The fleet</SectionLabel>
        <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <h1 className="font-serif text-6xl leading-[0.95] md:text-8xl">
            Every car,
            <br />
            <em className="text-accent">island-ready.</em>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Maintained on the island, insured to the maximum, and chosen for
            the roads you'll actually drive on Naxos. Filter by category, or
            let our AI recommend one for you.
          </p>
        </div>

        <div className="mt-14 flex flex-wrap gap-2 border-t border-border pt-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                cat === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-editorial pb-28">
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <Link
              key={v.slug}
              to="/fleet/$slug"
              params={{ slug: v.slug }}
              className="group block"
            >
              <div className="overflow-hidden bg-muted">
                <img
                  src={v.image}
                  alt={v.name}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · {v.category}
                </div>
                <div className="text-sm text-muted-foreground">
                  from <span className="text-foreground">€{v.fromPerDay}</span>/day
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <div className="font-serif text-3xl">{v.name}</div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{v.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>{v.transmission}</span>
                <span>·</span>
                <span>{v.seats} seats</span>
                <span>·</span>
                <span>{v.fuel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}