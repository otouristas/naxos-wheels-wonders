import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getVehicle, fleet } from "@/lib/fleet-data";
import { SectionLabel } from "@/components/site/section-label";
import { ArrowUpRight, Check } from "lucide-react";

export const Route = createFileRoute("/fleet/$slug")({
  loader: ({ params }) => {
    const vehicle = getVehicle(params.slug);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Car not found — Naxos Auto Rent" }, { name: "robots", content: "noindex" }] };
    const v = loaderData.vehicle;
    return {
      meta: [
        { title: `${v.name} — Naxos Auto Rent` },
        { name: "description", content: `Rent a ${v.name} on Naxos from €${v.fromPerDay}/day. ${v.tagline}` },
        { property: "og:title", content: `${v.name} — Naxos Auto Rent` },
        { property: "og:description", content: v.tagline },
        { property: "og:image", content: v.image },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: VehicleDetail,
  notFoundComponent: () => (
    <div className="container-editorial py-40 text-center">
      <h1 className="font-serif text-6xl">Car not found</h1>
      <Link to="/fleet" className="mt-6 inline-block underline">Back to the fleet</Link>
    </div>
  ),
});

function VehicleDetail() {
  const { vehicle: v } = Route.useLoaderData();
  const related = fleet.filter((x) => x.slug !== v.slug).slice(0, 3);

  const specs = [
    ["Category", v.category],
    ["Transmission", v.transmission],
    ["Seats", `${v.seats}`],
    ["Doors", `${v.doors}`],
    ["Luggage", `${v.luggage} bag${v.luggage > 1 ? "s" : ""}`],
    ["Fuel", v.fuel],
    ["AC", v.ac ? "Yes" : "No"],
  ];

  return (
    <div>
      <section className="container-editorial pt-16 md:pt-24">
        <Link to="/fleet" className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground">
          ← All cars
        </Link>
      </section>

      <section className="container-editorial pt-8">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div className="overflow-hidden bg-muted">
            <img
              src={v.image}
              alt={v.name}
              width={1200}
              height={900}
              className="h-[540px] w-full object-cover"
            />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {v.category}
            </div>
            <h1 className="mt-3 font-serif text-6xl leading-[0.95] md:text-7xl">{v.name}</h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {v.tagline}
            </p>

            <div className="mt-10 flex items-baseline gap-3 border-t border-border pt-6">
              <div className="font-serif text-5xl text-accent">€{v.fromPerDay}</div>
              <div className="text-sm text-muted-foreground">per day, all in</div>
            </div>

            <Link
              to="/fleet"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-foreground px-8 py-4 text-xs uppercase tracking-[0.22em] text-background transition-colors hover:bg-accent"
            >
              Reserve this car <ArrowUpRight className="h-4 w-4" />
            </Link>

            <div className="mt-10">
              <SectionLabel index="—">Included</SectionLabel>
              <ul className="mt-4 space-y-2 text-sm">
                {v.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial py-28">
        <SectionLabel index="01">Specifications</SectionLabel>
        <dl className="mt-8 grid gap-x-10 gap-y-6 border-t border-border pt-8 md:grid-cols-4">
          {specs.map(([k, v2]) => (
            <div key={k} className="border-b border-border pb-4">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{k}</dt>
              <dd className="mt-2 font-serif text-2xl">{v2}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="container-editorial py-24">
          <SectionLabel index="02">You might also like</SectionLabel>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} to="/fleet/$slug" params={{ slug: r.slug }} className="group block">
                <div className="overflow-hidden bg-muted">
                  <img src={r.image} alt={r.name} loading="lazy" className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="mt-4 font-serif text-2xl">{r.name}</div>
                <div className="text-sm text-muted-foreground">from €{r.fromPerDay}/day</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}