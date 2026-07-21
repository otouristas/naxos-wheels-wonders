import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/section-label";
import portara from "@/assets/guide-portara.jpg";
import hero from "@/assets/hero-naxos.jpg";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Naxos Guide — Beaches, Villages & Drives" },
      { name: "description", content: "The locals' guide to Naxos: beaches worth the drive, mountain villages, and the best road trips across the island." },
      { property: "og:title", content: "Naxos Guide — Beaches, Villages & Drives" },
      { property: "og:description", content: "Beaches, villages, and driving routes — the way we'd tell a friend." },
    ],
  }),
  component: Guide,
});

const chapters = [
  { tag: "01 · Beaches", title: "The forty-one beaches", body: "From Agios Prokopios to the wild north — where to go, when, and which need a 4x4.", image: hero },
  { tag: "02 · Villages", title: "Seven mountain villages", body: "Halki, Filoti, Apeiranthos and beyond. Marble streets, old kafeneios, quiet.", image: portara },
  { tag: "03 · Drives", title: "Three routes across the island", body: "Coastal loops, mountain traverses, and the road to Apollonas — with stops.", image: hero },
];

function Guide() {
  return (
    <div>
      <section className="container-editorial pb-16 pt-24 md:pt-32">
        <SectionLabel index="—">Naxos guide</SectionLabel>
        <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <h1 className="font-serif text-6xl leading-[0.95] md:text-8xl">
            The island,
            <br />
            <em className="text-accent">chapter by chapter.</em>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            A living guide to Naxos, written and rewritten by the people who
            drive it every day. Full articles roll out in Phase 3.
          </p>
        </div>
      </section>

      <section className="container-editorial space-y-24 pb-28">
        {chapters.map((c, i) => (
          <article key={c.title} className={`grid gap-10 md:grid-cols-2 md:items-center ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
            <div className="overflow-hidden">
              <img src={c.image} alt={c.title} loading="lazy" className="h-[440px] w-full object-cover" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-accent">{c.tag}</div>
              <h2 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">{c.title}</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{c.body}</p>
              <Link to="/guide" className="mt-6 inline-block text-xs uppercase tracking-[0.22em] underline decoration-accent decoration-2 underline-offset-8">
                Coming soon
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}