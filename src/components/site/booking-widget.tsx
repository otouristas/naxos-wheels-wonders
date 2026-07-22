"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CalendarDays, Clock, MapPin, Search, ArrowRightLeft } from "lucide-react";
import {
  buildBookingUrl,
  bookingHours,
  bookingMinutes,
  type BookingLocationKey,
} from "@/lib/site-config";

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

export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("booking");
  const router = useRouter();
  const [pickup, setPickup] = useState<BookingLocationKey>("airport");
  const [dropoff, setDropoff] = useState<BookingLocationKey | "same">("same");
  const [pickDate, setPickDate] = useState(today(3));
  const [pickHour, setPickHour] = useState("10");
  const [pickMin, setPickMin] = useState("00");
  const [dropDate, setDropDate] = useState(today(9));
  const [dropHour, setDropHour] = useState("10");
  const [dropMin, setDropMin] = useState("00");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = buildBookingUrl({
      pickupKey: pickup,
      dropoffKey: dropoff === "same" ? pickup : dropoff,
      pickDate,
      dropDate,
      pickHour,
      pickMin,
      dropHour,
      dropMin,
    });
    router.push(url);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full rounded-3xl border border-white/70 bg-white/95 shadow-sunny-lg backdrop-blur-sm ${
        compact ? "p-4 sm:p-5" : "p-4 sm:p-6 md:p-7"
      }`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2 sm:mb-5">
        <div className="min-w-0">
          <p className="font-heading text-lg font-bold text-foreground sm:text-xl">{t("title")}</p>
          <p className="mt-0.5 text-xs font-medium text-primary">{t("subtitle")}</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent/35 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
          {t("badge")}
        </span>
      </div>

      <div className="space-y-3">
        <fieldset className="space-y-2">
          <legend className="flex items-center gap-1.5 px-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {t("pickupGroup")}
          </legend>

          <Field label={t("pickupLocation")} icon={<MapPin className="h-3.5 w-3.5" />}>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value as BookingLocationKey)}
              className="field-control"
            >
              {locationKeys.map((k) => (
                <option key={k} value={k}>
                  {t(`locations.${k}`)}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Field label={t("pickupDate")} icon={<CalendarDays className="h-3.5 w-3.5" />}>
              <input
                type="date"
                value={pickDate}
                min={today(0)}
                onChange={(e) => {
                  const next = e.target.value;
                  setPickDate(next);
                  if (dropDate < next) setDropDate(next);
                }}
                className="field-control"
              />
            </Field>

            <Field label={t("pickupTime")} icon={<Clock className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={pickHour}
                  onChange={(e) => setPickHour(e.target.value)}
                  aria-label={t("hour")}
                  className="field-control"
                >
                  {bookingHours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <select
                  value={pickMin}
                  onChange={(e) => setPickMin(e.target.value)}
                  aria-label={t("minute")}
                  className="field-control"
                >
                  {bookingMinutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </fieldset>

        <div className="flex items-center gap-3 px-1" aria-hidden>
          <div className="h-px flex-1 bg-border" />
          <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="h-px flex-1 bg-border" />
        </div>

        <fieldset className="space-y-2">
          <legend className="flex items-center gap-1.5 px-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {t("dropoffGroup")}
          </legend>

          <Field label={t("dropoffLocation")} icon={<MapPin className="h-3.5 w-3.5" />}>
            <select
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value as BookingLocationKey | "same")}
              className="field-control"
            >
              <option value="same">{t("sameLocation")}</option>
              {locationKeys.map((k) => (
                <option key={k} value={k}>
                  {t(`locations.${k}`)}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Field label={t("dropoffDate")} icon={<CalendarDays className="h-3.5 w-3.5" />}>
              <input
                type="date"
                value={dropDate}
                min={pickDate}
                onChange={(e) => setDropDate(e.target.value)}
                className="field-control"
              />
            </Field>

            <Field label={t("dropoffTime")} icon={<Clock className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={dropHour}
                  onChange={(e) => setDropHour(e.target.value)}
                  aria-label={t("hour")}
                  className="field-control"
                >
                  {bookingHours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <select
                  value={dropMin}
                  onChange={(e) => setDropMin(e.target.value)}
                  aria-label={t("minute")}
                  className="field-control"
                >
                  {bookingMinutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </fieldset>
      </div>

      <button type="submit" className="btn-primary mt-4 w-full py-3.5 text-sm sm:mt-5 sm:py-4">
        <Search className="h-4 w-4" />
        {t("search")}
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
    <label className="block rounded-2xl border border-border bg-secondary/45 px-3 py-2.5 transition-colors focus-within:border-primary focus-within:bg-white focus-within:shadow-sm sm:px-3.5">
      <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}
