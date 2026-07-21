import { createFileRoute } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/section-label";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Naxos Auto Rent" },
      { name: "description", content: "Call, WhatsApp, or email Naxos Auto Rent. We answer in minutes, 08:00 to 22:00 every day of the season." },
      { property: "og:title", content: "Contact — Naxos Auto Rent" },
      { property: "og:description", content: "Call, WhatsApp, or email us — we answer in minutes." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div>
      <section className="container-editorial pb-16 pt-24 md:pt-32">
        <SectionLabel index="—">Contact</SectionLabel>
        <h1 className="mt-8 font-serif text-6xl leading-[0.95] md:text-8xl">
          Say <em className="text-accent">yassas.</em>
        </h1>
      </section>

      <section className="container-editorial grid gap-16 pb-28 md:grid-cols-2">
        <div className="space-y-10">
          {[
            { Icon: Phone, label: "Phone / WhatsApp", value: "+30 22850 00000" },
            { Icon: Mail, label: "Email", value: "hello@naxosautorent.com" },
            { Icon: MapPin, label: "Office", value: "Chora Naxos port, next to the ferry terminal" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="border-t border-border pt-6">
              <div className="flex items-start gap-4">
                <Icon className="mt-1 h-5 w-5 text-accent" />
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
                  <div className="mt-2 font-serif text-3xl">{value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form className="border border-border bg-card p-8">
          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Send a message</div>
          <div className="mt-6 space-y-4">
            <input placeholder="Your name" className="w-full border-b border-border bg-transparent py-3 text-base outline-none focus:border-accent" />
            <input placeholder="Email or WhatsApp" className="w-full border-b border-border bg-transparent py-3 text-base outline-none focus:border-accent" />
            <textarea placeholder="How can we help?" rows={5} className="w-full border-b border-border bg-transparent py-3 text-base outline-none focus:border-accent" />
          </div>
          <button type="button" className="mt-8 w-full bg-foreground py-4 text-xs uppercase tracking-[0.22em] text-background hover:bg-accent">
            Send message
          </button>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Form is a preview — booking flow is wired in Phase 2.
          </p>
        </form>
      </section>
    </div>
  );
}