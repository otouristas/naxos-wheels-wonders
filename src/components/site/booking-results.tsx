import { useTranslations } from "next-intl";
import { BookingEngine } from "@/components/site/booking-engine";
import { BookingRecommendations } from "@/components/site/booking-recommendations";
import type { ParsedCar } from "@/lib/iosrt";

/**
 * Results layout: the live availability engine on the left and the
 * marketing-driven recommendations rail (derived from the same live cars) on
 * the right. Stacks to a single column on smaller screens.
 */
export function BookingResults({
  html,
  cars,
}: {
  html: string;
  cars: ParsedCar[];
}) {
  const t = useTranslations("booking");
  const hasRail = cars.length > 0;

  return (
    <div
      className={
        hasRail
          ? "grid gap-6 lg:grid-cols-12 lg:items-start"
          : "grid gap-6"
      }
    >
      <div className={hasRail ? "min-w-0 lg:col-span-8" : "min-w-0"}>
        <BookingEngine html={html} showResults filtersLabel={t("filters")} />
      </div>
      {hasRail ? (
        <div className="min-w-0 lg:col-span-4">
          <BookingRecommendations cars={cars} />
        </div>
      ) : null}
    </div>
  );
}
