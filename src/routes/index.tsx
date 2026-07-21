import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, KeyRound, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-naxos.jpg";
import portaraImg from "@/assets/guide-portara.jpg";
import { fleet } from "@/lib/fleet-data";
import { SectionLabel } from "@/components/site/section-label";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const featured = fleet.slice(0, 3);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="A convertible car winding down a Cycladic coastal road on Naxos at golden hour"
            width={1920}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background" />
        </div>
        <div className="container-editorial relative flex min-h-[92vh] flex-col justify-between py-16">
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-foreground/80">
            <span className="h-px w-10 bg-foreground/40" />
            <span>Est. Naxos · Cyclades</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-4xl"
          >
            <h1 className="font-serif text-6xl leading-[0.95] text-foreground md:text-8xl lg:text-9xl">
              The island,
              <br />
              <em className="text-accent">on your terms.</em>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg">
              A curated fleet, delivered to your ferry, airport, or villa.
              Family-run on Naxos since 1998 — no queues, no fine print,
              no shuttle bus.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/fleet"
                className="group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-xs uppercase tracking-[0.22em] text-background transition-colors hover:bg-accent"
              >
                Reserve a car
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/guide"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground underline decoration-accent decoration-2 underline-offset-8"
              >
                Explore Naxos
              </Link>
            </div>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-foreground/20 pt-8 md:grid-cols-4">
            {[
              ["27", "Years on the island"],
              ["48", "Cars in the fleet"],
              ["24/7", "Roadside assistance"],
              ["0€", "Hidden fees"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-4xl text-foreground">{n}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-foreground/70">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="container-editorial py-28">
        <SectionLabel index="01">Why us</SectionLabel>
        <div className="mt-10 grid gap-16 md:grid-cols-[1.2fr_1fr]">
          <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
            A rental company that behaves more like a
            <em className="text-accent"> concierge</em>.
          </h2>
          <div className="grid gap-10">
            {[
              { icon: KeyRound, title: "Delivered to you", body: "Meet your car at the port, the airport, or the door of your villa. Keys in your hand in under two minutes." },
              { icon: ShieldCheck, title: "One transparent price", body: "Full insurance, unlimited mileage, taxes, second driver — all included. What you see is what you pay." },
              { icon: Compass, title: "Local knowledge", body: "We tell you where to swim, which road not to take, and where to eat when everyone else is asleep." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t border-border pt-6">
                <div className="flex items-start gap-4">
                  <Icon className="mt-1 h-5 w-5 text-accent" />
                  <div>
                    <div className="font-serif text-2xl">{title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED FLEET */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-editorial py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="02">The fleet</SectionLabel>
              <h2 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
                Cars picked for the roads
                <br />
                they'll actually see.
              </h2>
            </div>
            <Link
              to="/fleet"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] hover:text-accent"
            >
              View all cars <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {featured.map((v, i) => (
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
                    0{i + 1} · {v.category}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    from <span className="text-foreground">€{v.fromPerDay}</span>/day
                  </div>
                </div>
                <div className="mt-2 font-serif text-3xl">{v.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{v.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDE TEASER */}
      <section className="container-editorial py-28">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div className="overflow-hidden">
            <img
              src={portaraImg}
              alt="The Portara at sunset, the ancient marble gate of Naxos"
              width={1400}
              height={900}
              loading="lazy"
              className="h-[560px] w-full object-cover"
            />
          </div>
          <div>
            <SectionLabel index="03">The island</SectionLabel>
            <h2 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
              Written by locals.
              <br />
              <em className="text-accent">Not by an algorithm.</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Forty-one beaches, seven mountain villages, one marble quarry, and
              a thousand tiny chapels. Our guide tells you which are worth the
              drive — and which road to take to get there.
            </p>
            <Link
              to="/guide"
              className="mt-10 inline-flex items-center gap-3 border border-foreground px-8 py-4 text-xs uppercase tracking-[0.22em] transition-colors hover:bg-foreground hover:text-background"
            >
              Open the guide <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="container-editorial py-24 text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-background/60">
            Ready when you are
          </div>
          <h2 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl">
            Tell us your dates.
            <br />
            <em className="text-accent">We'll do the rest.</em>
          </h2>
          <div className="mt-10">
            <Link
              to="/fleet"
              className="inline-flex items-center gap-3 bg-background px-10 py-4 text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-accent hover:text-background"
            >
              Reserve a car <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
