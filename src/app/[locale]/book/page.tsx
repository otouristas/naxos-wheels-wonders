import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarDays, MapPin, PencilLine } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BookingResults } from "@/components/site/booking-results";
import { BookingWidget } from "@/components/site/booking-widget";
import {
  fetchLiveBookingHtml,
  hasBookingSearch,
  summarizeBookingQuery,
  type ParsedCar,
} from "@/lib/iosrt";
import { buildAlternates } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
    alternates: buildAlternates(locale, "/book"),
    robots: { index: true, follow: true },
  };
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const t = await getTranslations("booking");

  const bookPath =
    locale === routing.defaultLocale ? "/book" : `/${locale}/book`;
  const searching = hasBookingSearch(query);
  const summary = summarizeBookingQuery(query);

  // No dates yet → branded search (same widget as hero). Don't embed empty WP form.
  if (!searching) {
    return (
      <div className="bg-gradient-to-b from-secondary/80 via-background to-background">
        <section className="container-editorial py-10 md:py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {t("pageEyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("pageSubtitle")}</p>

          <div className="mx-auto mt-10 max-w-xl">
            <BookingWidget />
          </div>
        </section>
      </div>
    );
  }

  let html = "";
  let hasResults = false;
  let cars: ParsedCar[] = [];
  let error: string | null = null;
  try {
    const payload = await fetchLiveBookingHtml(query, bookPath);
    html = payload.html;
    hasResults = payload.hasResults;
    cars = payload.cars;
  } catch (e) {
    error = e instanceof Error ? e.message : "Booking engine unavailable";
  }

  return (
    <div className="bg-gradient-to-b from-secondary/80 via-background to-background">
      <section className="mx-auto w-full max-w-[104rem] px-4 py-8 md:px-8 md:py-12">
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border bg-primary px-5 py-5 text-primary-foreground shadow-sunny-lg md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              {t("resultsEyebrow")}
            </p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight md:text-3xl">
              {hasResults ? t("resultsTitle") : t("pageTitle")}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              {summary.location}
            </span>
            {summary.pickup ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                <CalendarDays className="h-3.5 w-3.5 text-accent" />
                {summary.pickup}
              </span>
            ) : null}
            {summary.dropoff ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                <CalendarDays className="h-3.5 w-3.5 text-accent" />
                {summary.dropoff}
              </span>
            ) : null}
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-accent-foreground"
            >
              <PencilLine className="h-3.5 w-3.5" />
              {t("editSearch")}
            </Link>
          </div>
        </div>

        <div className="mt-6">
          {error ? (
            <div className="rounded-3xl border border-border bg-white p-8 text-center shadow-sunny">
              <p className="font-heading text-xl font-bold text-primary">{t("engineError")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <div className="mx-auto mt-6 max-w-xl text-left">
                <BookingWidget />
              </div>
            </div>
          ) : hasResults ? (
            <BookingResults html={html} cars={cars} />
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white p-6 shadow-sunny">
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {t("engineError")}
              </p>
              <BookingWidget />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
