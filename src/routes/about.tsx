import { createFileRoute } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/section-label";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Naxos Auto Rent" },
      { name: "description", content: "A family-run car rental company on Naxos since 1998. Local, transparent, and obsessed with the island." },
      { property: "og:title", content: "About — Naxos Auto Rent" },
      { property: "og:description", content: "Family-run, island-obsessed, and honest about pricing since 1998." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="container-editorial pb-16 pt-24 md:pt-32">
        <SectionLabel index="—">About us</SectionLabel>
        <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-[0.95] md:text-8xl">
          Born on Naxos.
          <br />
          <em className="text-accent">Run by locals.</em>
        </h1>
      </section>

      <section className="container-editorial grid gap-16 pb-28 md:grid-cols-[1fr_1.4fr]">
        <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Est. 1998 · Chora, Naxos
        </div>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            We started with three cars parked outside a family taverna near the
            port. Twenty-seven summers later, we still meet every guest in
            person, still explain the road to Apollonas with a map on the
            hood, and still take pride in the fact that nobody has ever paid
            a hidden fee at our counter.
          </p>
          <p>
            Naxos is not a big island — 428 square kilometres of mountain
            villages, marble quarries, and long, quiet beaches. It is,
            however, an island where a car changes everything. It's the
            difference between the same three tavernas in Chora and a
            different mountain village every evening.
          </p>
          <p>
            We do one thing: we help you see Naxos the way we see it.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-editorial grid gap-10 py-24 md:grid-cols-4">
          {[
            ["1998", "Founded in Chora"],
            ["48", "Cars in the fleet"],
            ["12,000+", "Happy travelers"],
            ["4.9★", "Average review"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-serif text-6xl text-accent">{n}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}