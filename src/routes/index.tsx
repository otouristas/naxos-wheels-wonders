import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, KeyRound, ShieldCheck, Star, Phone, MessageCircle, MapPin, Plane, Ship, Home as HomeIcon } from "lucide-react";
import heroImg from "@/assets/hero-naxos.jpg";
import portaraImg from "@/assets/guide-portara.jpg";
import { fleet } from "@/lib/fleet-data";
import { SectionLabel } from "@/components/site/section-label";
import { BookingWidget } from "@/components/site/booking-widget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Naxos Auto Rent — Car Rental in Naxos, Cyclades" },
      { name: "description", content: "Family-run car rental on Naxos since 1998. Free delivery to the Port, Airport & villas. All-inclusive rates, 24/7 roadside assistance, 5.0 stars from 381 travelers." },
      { property: "og:title", content: "Naxos Auto Rent — The island, on your terms." },
      { property: "og:description", content: "Book a car online in 60 seconds. Full insurance, unlimited kilometers, free delivery across Naxos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = fleet.slice(0, 6);
  return (
    <div>
      {/* HERO + BOOKING */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="A convertible car winding down a Cycladic coastal road on Naxos at golden hour"
            width={1920}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </div>
        <div className="container-editorial relative grid min-h-[100vh] gap-16 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pb-24 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-foreground/80">
              <span className="h-px w-10 bg-accent" />
              <span>Naxos · Cyclades · Since 1998</span>
            </div>

            <h1 className="mt-8 font-serif text-6xl leading-[0.92] text-foreground md:text-8xl lg:text-[7.5rem]">
              The island,
              <br />
              <em className="text-accent">on your terms.</em>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/85 md:text-lg">
              Car rental in Naxos with free delivery to the Port, Airport, and
              your villa. All-inclusive rates, unlimited kilometers, 24/7
              roadside assistance — booked in under a minute.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
                <span className="ml-2 font-serif text-2xl text-foreground">5.0</span>
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/70">
                  · 381 Google reviews
                </span>
              </div>
              <a
                href="tel:+306930993670"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground underline decoration-accent decoration-2 underline-offset-8"
              >
                <Phone className="h-4 w-4 text-accent" /> +30 693 099 3670
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:pl-4"
          >
            <BookingWidget />
          </motion.div>
        </div>

        <div className="relative border-t border-border/60 bg-background/70 backdrop-blur">
          <div className="container-editorial grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
            {[
              ["27", "Years on the island"],
              ["48", "Cars in the fleet"],
              ["24/7", "Roadside assistance"],
              ["0€", "Hidden fees"],
            ].map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-3">
                <div className="font-serif text-3xl text-foreground md:text-4xl">{n}</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
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

          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
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
                    {String(i + 1).padStart(2, "0")} · {v.category} · {v.transmission[0]}
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

      {/* LOCATIONS */}
      <section className="container-editorial py-28">
        <div className="grid gap-14 md:grid-cols-[1fr_1.4fr] md:items-start">
          <div>
            <SectionLabel index="03">Delivery & pick-up</SectionLabel>
            <h2 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
              We meet you
              <br />
              <em className="text-accent">at the door.</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Free delivery and collection across the whole island. Your car
              is ready and waiting the moment your ferry docks or your plane
              lands — no shuttle bus, no queue at a counter.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {[
              { icon: Ship, title: "Naxos Port", body: "Meet your driver at the ferry ramp. Keys in hand in 2 minutes.", meta: "Free · 24/7" },
              { icon: Plane, title: "Naxos Airport (JNX)", body: "Delivered to the arrivals door — no shuttle, no wait.", meta: "Free · 08:00–23:00" },
              { icon: HomeIcon, title: "Your accommodation", body: "Villa, hotel or apartment anywhere on Naxos.", meta: "Free up to 10 km" },
              { icon: MapPin, title: "Chora — Our office", body: "Walk-in returns, coffee on us, itinerary advice included.", meta: "Open 08:00–22:00" },
            ].map(({ icon: Icon, title, body, meta }) => (
              <div key={title} className="bg-background p-8">
                <Icon className="h-5 w-5 text-accent" />
                <div className="mt-6 font-serif text-2xl">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                <div className="mt-6 text-[11px] uppercase tracking-[0.24em] text-accent">
                  {meta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-editorial py-28">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel index="04">The reviews</SectionLabel>
              <h2 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
                5.0 on Google.
                <br />
                <em className="text-accent">381 travelers.</em>
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              Verified Google reviews
            </div>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.author} className="flex h-full flex-col border-t border-border pt-8">
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="mt-6 flex-1 font-serif text-2xl leading-[1.25] text-foreground">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-baseline justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="text-foreground">{r.author}</span>
                  <span>{r.date}</span>
                </figcaption>
              </figure>
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
            <SectionLabel index="05">The island</SectionLabel>
            <h2 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
              Written by locals.
              <br />
              <em className="text-accent">Not by an algorithm.</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Forty-one beaches, seven mountain villages, one marble quarry,
              and a thousand tiny chapels. Our guide tells you which are worth
              the drive — and which road to take to get there.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                ["Naxos Beaches Guide", "Every beach & how to get there by car"],
                ["3, 5 & 7-Day Road Trips", "Perfect Naxos itineraries by car"],
                ["Driving in Naxos", "Roads, parking & car rental tips"],
              ].map(([title, sub]) => (
                <Link
                  key={title}
                  to="/guide"
                  className="group flex items-baseline justify-between border-b border-border pb-4"
                >
                  <div>
                    <div className="font-serif text-2xl group-hover:text-accent">{title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {sub}
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-editorial grid gap-8 py-14 md:grid-cols-3">
          {[
            { icon: Phone, label: "Call us anytime", value: "+30 693 099 3670" },
            { icon: MessageCircle, label: "WhatsApp & Viber", value: "Reply within 10 minutes" },
            { icon: MapPin, label: "Our office", value: "Chora, Naxos 84300, Greece" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <Icon className="mt-1 h-5 w-5 text-accent" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1 font-serif text-2xl">{value}</div>
              </div>
            </div>
          ))}
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

const reviews = [
  {
    author: "Austin M.",
    date: "Oct 2025",
    quote:
      "Super easy and enjoyable. They met us right at the airport for drop-off and pick-up. Ask them for the local villages and restaurants list — we followed it and had an incredible time.",
  },
  {
    author: "Rahim J.",
    date: "Sep 2025",
    quote:
      "20 out of 10. Best value for money, extremely professional. Sakis arrived on short notice with a beautiful clean car and a full travel itinerary of the island. Don't think twice.",
  },
  {
    author: "Robert F.",
    date: "Oct 2025",
    quote:
      "Very clean car. Affordable price. The staff was super friendly and even helped me plan my entire 2-day trip around the island. Well done and thank you!",
  },
];
