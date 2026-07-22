import Image from "next/image";
import { useTranslations } from "next-intl";
import { Users, Fuel, Cog, ArrowRight, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Vehicle } from "@/lib/fleet-data";
import { getFleetReviewCaption } from "@/lib/reviews-data";
import { siteConfig } from "@/lib/site-config";

export function FleetCard({ vehicle }: { vehicle: Vehicle; index?: number }) {
  const t = useTranslations("fleet");
  const tc = useTranslations("cta");
  const ts = useTranslations("fleet.specs");
  const caption = getFleetReviewCaption(vehicle.slug);

  const fuelKey = vehicle.fuel.toLowerCase();
  const transmissionKey = vehicle.transmission.toLowerCase();

  return (
    <Link
      href={`/fleet/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sunny transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-sunny-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-secondary to-white">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          {t(`categories.${vehicle.category}`)}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-accent px-3 py-1.5 font-heading text-sm font-extrabold text-accent-foreground shadow-sm">
          €{vehicle.fromPerDay}
          <span className="text-[10px] font-bold">{t("perDay")}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl font-bold leading-tight text-foreground">
          {vehicle.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{vehicle.tagline}</p>

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-accent text-accent" />
            ))}
          </span>
          <span>
            {t("googleRated", {
              rating: siteConfig.rating.toFixed(1),
              count: siteConfig.reviewCount,
            })}
          </span>
        </div>

        {caption ? (
          <p className="mt-2 border-l-2 border-primary/30 pl-2.5 text-[12px] leading-snug text-muted-foreground">
            <span className="italic">“{caption.quote}”</span>
            <span className="mt-0.5 block font-semibold not-italic text-foreground/70">
              {caption.author}
            </span>
          </p>
        ) : null}

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

        <div className="mt-4 flex items-center gap-3 border-t border-border/70 pt-3 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <Cog className="h-3.5 w-3.5 text-primary" />
            {ts(transmissionKey)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            {vehicle.seats}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5 text-primary" />
            {ts(fuelKey)}
          </span>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          {tc("viewCar")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
