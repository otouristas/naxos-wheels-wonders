import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ParsedCar } from "@/lib/iosrt";
import {
  buildRecommendations,
  type AngleKey,
  type BookingRecommendation,
} from "@/lib/fleet-match";
import { getFleetReviewCaption } from "@/lib/reviews-data";
import { siteConfig } from "@/lib/site-config";

const ANGLE_STYLES: Record<AngleKey, string> = {
  bestValue: "bg-accent text-accent-foreground",
  popular: "bg-primary text-primary-foreground",
  family: "bg-secondary text-primary",
  eco: "bg-emerald-100 text-emerald-800",
};

function RecoCard({ rec }: { rec: BookingRecommendation }) {
  const t = useTranslations("booking.reco");
  const tf = useTranslations("fleet");
  const { car, vehicle, angleKey } = rec;

  const name = vehicle?.name ?? car.title;
  const image = vehicle?.image ?? car.imageUrl ?? undefined;
  const caption = vehicle ? getFleetReviewCaption(vehicle.slug) : undefined;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sunny transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sunny-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-secondary to-white">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : null}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide shadow-sm ${ANGLE_STYLES[angleKey]}`}
        >
          {angleKey === "eco" ? <Sparkles className="h-3 w-3" /> : null}
          {t(`angles.${angleKey}`)}
        </span>
        {car.discountPct ? (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
            {t("save", { pct: car.discountPct })}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-bold leading-tight text-foreground">
            {name}
          </h3>
          {vehicle ? (
            <span className="mt-0.5 shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
              {tf(`categories.${vehicle.category}`)}
            </span>
          ) : null}
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-accent text-accent" />
            ))}
          </span>
          <span>
            {tf("googleRated", {
              rating: siteConfig.rating.toFixed(1),
              count: siteConfig.reviewCount,
            })}
          </span>
        </div>

        {vehicle ? (
          <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
            {vehicle.idealFor}
          </p>
        ) : null}

        {caption ? (
          <p className="mt-2 border-l-2 border-primary/30 pl-2.5 text-[12px] leading-snug text-muted-foreground">
            <span className="italic">“{caption.quote}”</span>
            <span className="mt-0.5 block font-semibold not-italic text-foreground/70">
              {caption.author}
            </span>
          </p>
        ) : null}

        {vehicle ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {vehicle.vibes.slice(0, 3).map((v) => (
              <span
                key={v}
                className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-primary"
              >
                {v}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 border-t border-border/70 pt-3">
          {car.total != null ? (
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-extrabold text-foreground">
                    €{car.total}
                  </span>
                  {car.normalTotal && car.normalTotal > car.total ? (
                    <span className="text-xs font-semibold text-muted-foreground line-through">
                      €{car.normalTotal}
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {car.priceDesc}
                  {car.perDay ? ` · ${t("perDayApprox", { price: car.perDay })}` : ""}
                </p>
              </div>
            </div>
          ) : null}

          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("included")}
          </p>

          <a
            href={car.bookHref || "#"}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sunny transition-colors hover:bg-primary/90"
          >
            {t("book")}
            <ArrowRight className="h-4 w-4" />
          </a>
          {vehicle ? (
            <Link
              href={`/fleet/${vehicle.slug}`}
              className="mt-2 block text-center text-[12px] font-semibold text-primary hover:underline"
            >
              {t("details")}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function BookingRecommendations({ cars }: { cars: ParsedCar[] }) {
  const t = useTranslations("booking.reco");
  const recs = buildRecommendations(cars);

  if (recs.length === 0) return null;

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="mb-4">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {t("title")}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {recs.map((rec) => (
          <RecoCard key={rec.car.mid} rec={rec} />
        ))}
      </div>

      <p className="mt-4 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-center text-[12px] font-medium text-muted-foreground">
        {t("urgency")}
      </p>
    </aside>
  );
}
