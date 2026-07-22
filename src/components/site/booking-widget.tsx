import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

const locations = [
  "Naxos Airport (JNX)",
  "Naxos Port",
  "Your accommodation — up to 10km from Port",
  "Your accommodation — 10km+ from Port",
] as const;

function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState<string>(locations[0]);
  const [dropoff, setDropoff] = useState<string>("Same as pick-up");
  const [pickDate, setPickDate] = useState(today(3));
  const [pickTime, setPickTime] = useState("10:00");
  const [dropDate, setDropDate] = useState(today(10));
  const [dropTime, setDropTime] = useState("10:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/fleet" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full bg-background/95 backdrop-blur-xl ring-1 ring-border shadow-[0_30px_80px_-30px_rgba(15,30,60,0.35)] ${
        compact ? "p-5" : "p-6 md:p-8"
      }`}
    >
      <div className="flex items-baseline justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Reserve online · Free cancellation up to 14 days
          </span>
        </div>
        <span className="hidden text-[11px] uppercase tracking-[0.24em] text-accent md:inline">
          Best rate guaranteed
        </span>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="01 · Pick-up location" icon={<MapPin className="h-3.5 w-3.5" />}>
          <select
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full bg-transparent py-2 text-sm text-foreground outline-none"
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>

        <Field label="02 · Pick-up date" icon={<CalendarDays className="h-3.5 w-3.5" />}>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={pickDate}
              onChange={(e) => setPickDate(e.target.value)}
              className="w-full bg-transparent py-2 text-sm text-foreground outline-none"
            />
            <input
              type="time"
              value={pickTime}
              onChange={(e) => setPickTime(e.target.value)}
              className="w-24 bg-transparent py-2 text-sm text-foreground outline-none"
            />
          </div>
        </Field>

        <Field label="03 · Drop-off location" icon={<MapPin className="h-3.5 w-3.5" />}>
          <select
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="w-full bg-transparent py-2 text-sm text-foreground outline-none"
          >
            <option>Same as pick-up</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>

        <Field label="04 · Drop-off date" icon={<CalendarDays className="h-3.5 w-3.5" />}>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dropDate}
              onChange={(e) => setDropDate(e.target.value)}
              className="w-full bg-transparent py-2 text-sm text-foreground outline-none"
            />
            <input
              type="time"
              value={dropTime}
              onChange={(e) => setDropTime(e.target.value)}
              className="w-24 bg-transparent py-2 text-sm text-foreground outline-none"
            />
          </div>
        </Field>
      </div>

      <button
        type="submit"
        className="group mt-6 inline-flex w-full items-center justify-center gap-3 bg-foreground px-8 py-4 text-xs uppercase tracking-[0.28em] text-background transition-colors hover:bg-accent"
      >
        Search available cars
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block border-b border-border/70 pb-1">
      <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        <span className="text-accent">{icon}</span>
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}