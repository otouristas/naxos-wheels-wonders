"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Loader2,
  Users,
  Cog,
  Fuel,
  CalendarDays,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildBookingUrl, type BookingLocationKey } from "@/lib/site-config";
import type { QuizAnswers } from "@/lib/recommend";
import { getVehicle, type Vehicle } from "@/lib/fleet-data";
import { cn } from "@/lib/utils";

const locationKeys: BookingLocationKey[] = [
  "airport",
  "port",
  "accommodationNear",
  "accommodationFar",
];

function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

type OptionGroup = {
  key: keyof QuizAnswers;
  labelKey: string;
  options: { value: string; labelKey: string }[];
};

type TouristasPick = {
  slug: string;
  name: string;
  fromPerDay: number;
  reason: string;
  available?: boolean;
  livePerDay?: number | null;
  liveTotal?: number | null;
  normalTotal?: number | null;
  discountPct?: number | null;
  bookUrl?: string;
};

type TouristasResponse = {
  message: string;
  picks: TouristasPick[];
};

const groups: OptionGroup[] = [
  {
    key: "group",
    labelKey: "quiz.group",
    options: [
      { value: "solo", labelKey: "quiz.groupOptions.solo" },
      { value: "family", labelKey: "quiz.groupOptions.family" },
      { value: "group", labelKey: "quiz.groupOptions.group" },
    ],
  },
  {
    key: "budget",
    labelKey: "quiz.budget",
    options: [
      { value: "low", labelKey: "quiz.budgetOptions.low" },
      { value: "mid", labelKey: "quiz.budgetOptions.mid" },
      { value: "high", labelKey: "quiz.budgetOptions.high" },
    ],
  },
  {
    key: "vibe",
    labelKey: "quiz.vibe",
    options: [
      { value: "city", labelKey: "quiz.vibeOptions.city" },
      { value: "explore", labelKey: "quiz.vibeOptions.explore" },
      { value: "family", labelKey: "quiz.vibeOptions.family" },
      { value: "eco", labelKey: "quiz.vibeOptions.eco" },
    ],
  },
  {
    key: "transmission",
    labelKey: "quiz.transmission",
    options: [
      { value: "any", labelKey: "quiz.transmissionOptions.any" },
      { value: "manual", labelKey: "quiz.transmissionOptions.manual" },
      { value: "automatic", labelKey: "quiz.transmissionOptions.automatic" },
    ],
  },
];

function MatchRow({
  vehicle,
  reason,
  rank,
  pick,
}: {
  vehicle: Vehicle;
  reason: string;
  rank: number;
  pick: TouristasPick;
}) {
  const t = useTranslations("fleet");
  const tc = useTranslations("cta");
  const ts = useTranslations("fleet.specs");
  const tai = useTranslations("ai");

  const hasLive = pick.available === true && pick.livePerDay != null;
  const showDiscount =
    pick.discountPct != null && pick.discountPct > 0 && pick.normalTotal != null;
  const bookHref = hasLive && pick.bookUrl ? pick.bookUrl : buildBookingUrl();

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sunny">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link
          href={`/fleet/${vehicle.slug}`}
          className="relative aspect-[16/10] w-full shrink-0 bg-gradient-to-b from-secondary to-white sm:aspect-auto sm:h-auto sm:w-[38%] sm:min-h-[132px]"
        >
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 640px) 100vw, 180px"
          />
          <span className="absolute left-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-primary-foreground">
            {rank}
          </span>
        </Link>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 p-3.5 sm:p-4">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/fleet/${vehicle.slug}`}
                  className="font-heading text-base font-extrabold leading-tight text-foreground hover:text-primary sm:text-lg"
                >
                  {vehicle.name}
                </Link>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {t(`categories.${vehicle.category}`)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-heading text-lg font-extrabold text-primary">
                  €{hasLive ? pick.livePerDay : vehicle.fromPerDay}
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {t("perDay")}
                  </span>
                </p>
                {showDiscount ? (
                  <p className="mt-0.5 flex items-center justify-end gap-1.5 text-[10px] font-bold">
                    <span className="text-muted-foreground line-through">
                      €{pick.normalTotal}
                    </span>
                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-accent-foreground">
                      {tai("save", { pct: pick.discountPct as number })}
                    </span>
                  </p>
                ) : null}
              </div>
            </div>

            {hasLive ? (
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {tai("available")}
              </p>
            ) : null}

            <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
              <span className="font-semibold text-foreground/70">{tai("whyMatch")}: </span>
              {reason}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Cog className="h-3 w-3 text-primary" />
                {ts(vehicle.transmission.toLowerCase())}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3 text-primary" />
                {vehicle.seats}
              </span>
              <span className="inline-flex items-center gap-1">
                <Fuel className="h-3 w-3 text-primary" />
                {ts(vehicle.fuel.toLowerCase())}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={bookHref}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-accent-foreground transition-transform hover:-translate-y-0.5 sm:flex-none"
            >
              {tc("bookNow")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`/fleet/${vehicle.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-primary/30 px-3 py-2.5 text-xs font-bold text-primary hover:bg-primary/5"
            >
              {tc("viewCar")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TouristasFinder() {
  const t = useTranslations("ai");
  const tb = useTranslations("booking");
  const tc = useTranslations("cta");
  const locale = useLocale();
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [picks, setPicks] = useState<TouristasPick[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tripOpen, setTripOpen] = useState(false);
  const [pickup, setPickup] = useState<BookingLocationKey>("airport");
  const [pickDate, setPickDate] = useState(today(3));
  const [dropDate, setDropDate] = useState(today(9));

  const hasResults = picks.length > 0 || Boolean(message);

  function select(key: keyof QuizAnswers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  async function submit() {
    setLoading(true);
    setMessage("");
    setPicks([]);
    setError("");
    const trip =
      tripOpen && pickDate && dropDate
        ? { pickupKey: pickup, dropoffKey: pickup, pickDate, dropDate }
        : undefined;
    try {
      const res = await fetch("/api/touristas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: { ...answers, notes }, locale, trip }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as TouristasResponse;
      setMessage(data.message ?? "");
      setPicks(Array.isArray(data.picks) ? data.picks : []);
    } catch {
      setError(
        "Sorry, something went wrong. Please call or WhatsApp us and we'll help you pick.",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAnswers({});
    setNotes("");
    setMessage("");
    setPicks([]);
    setError("");
  }

  const vehicles = picks
    .map((p) => {
      const vehicle = getVehicle(p.slug);
      return vehicle ? { vehicle, reason: p.reason, pick: p } : null;
    })
    .filter(
      (
        x,
      ): x is {
        vehicle: NonNullable<ReturnType<typeof getVehicle>>;
        reason: string;
        pick: TouristasPick;
      } => Boolean(x),
    );

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sunny-lg">
      <div className="flex items-center gap-2 bg-primary px-6 py-3.5 text-primary-foreground">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-xs font-bold uppercase tracking-[0.14em]">{t("poweredBy")}</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* Left: quiz */}
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
          <h3 className="font-heading text-2xl font-extrabold">{t("title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>

          <div className="mt-6 space-y-5">
            {groups.map((g) => (
              <div key={g.key}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {t(g.labelKey)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {g.options.map((o) => {
                    const active = answers[g.key] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => select(g.key, o.value)}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-primary hover:text-primary",
                        )}
                      >
                        {t(o.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("placeholder")}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-secondary/40 p-3.5 text-sm outline-none focus:border-primary focus:bg-white"
            />

            <div className="rounded-2xl border border-border bg-secondary/40">
              <button
                type="button"
                onClick={() => setTripOpen((v) => !v)}
                aria-expanded={tripOpen}
                className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left"
              >
                <span className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {t("trip.heading")}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    tripOpen && "rotate-180",
                  )}
                />
              </button>

              {tripOpen ? (
                <div className="space-y-2.5 border-t border-border/70 p-3.5">
                  <label className="block">
                    <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {tb("pickupLocation")}
                    </span>
                    <select
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value as BookingLocationKey)}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      {locationKeys.map((k) => (
                        <option key={k} value={k}>
                          {tb(`locations.${k}`)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        {tb("pickupDate")}
                      </span>
                      <input
                        type="date"
                        value={pickDate}
                        min={today(0)}
                        onChange={(e) => {
                          const next = e.target.value;
                          setPickDate(next);
                          if (dropDate < next) setDropDate(next);
                        }}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        {tb("dropoffDate")}
                      </span>
                      <input
                        type="date"
                        value={dropDate}
                        min={pickDate}
                        onChange={(e) => setDropDate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="btn-primary w-full py-3.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("thinking")}
                </>
              ) : (
                <>
                  {t("send")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: compact match rows */}
        <div className="flex flex-col bg-secondary/30">
          {hasResults || error ? (
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              {error ? (
                <p className="rounded-2xl bg-white p-4 text-sm text-muted-foreground shadow-sunny">
                  {error}
                </p>
              ) : (
                <>
                  {message ? (
                    <div className="mb-3 rounded-2xl bg-white p-3.5 shadow-sunny">
                      <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                        <Sparkles className="h-3 w-3" />
                        {t("poweredBy")}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{message}</p>
                    </div>
                  ) : null}

                  {vehicles.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 px-0.5">
                        <h4 className="font-heading text-base font-extrabold sm:text-lg">
                          {t("matches")}
                        </h4>
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                          {vehicles.length}
                        </span>
                      </div>

                      {vehicles.map(({ vehicle, reason, pick }, i) => (
                        <MatchRow
                          key={vehicle.slug}
                          vehicle={vehicle}
                          reason={reason}
                          rank={i + 1}
                          pick={pick}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                <Link
                  href="/fleet"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  {tc("viewFleet")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t("reset")}
                </button>
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {t("disclaimer")}
              </p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("intro")}</p>
              <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
                {t("disclaimer")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
