import { buildBookingQuery, type BookingLocationKey } from "./site-config";
import { fetchLiveBookingHtml } from "./iosrt";
import { matchFleetByTitle } from "./fleet-match";
import type { Vehicle } from "./fleet-data";

/** Traveller trip window used to check live availability. */
export type TripInput = {
  pickupKey?: BookingLocationKey;
  dropoffKey?: BookingLocationKey;
  /** ISO yyyy-mm-dd */
  pickDate: string;
  /** ISO yyyy-mm-dd */
  dropDate: string;
  pickHour?: string;
  pickMin?: string;
  dropHour?: string;
  dropMin?: string;
};

/** A live-available car, enriched with our fleet metadata when matched. */
export type AvailableCar = {
  mid: string;
  title: string;
  slug?: string;
  name: string;
  image?: string;
  category?: string;
  livePerDay: number | null;
  liveTotal: number | null;
  normalTotal: number | null;
  discountPct: number | null;
  /** Same-site step=2 deep link into booking this exact car for the dates. */
  bookUrl: string;
  vehicle?: Vehicle;
};

/** Whole days between two ISO dates (inclusive of the rental span). */
function daySpan(pickDate: string, dropDate: string): number {
  const a = new Date(`${pickDate}T00:00:00Z`).getTime();
  const b = new Date(`${dropDate}T00:00:00Z`).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 0;
  return Math.round((b - a) / 86_400_000);
}

/**
 * Fetch live availability for a trip window and map the engine cars to our
 * fleet. Returns `null` on any failure or when the engine yields no cars, so
 * callers can gracefully fall back to static recommendations.
 */
export async function getLiveAvailability(
  trip: TripInput,
): Promise<AvailableCar[] | null> {
  if (!trip.pickDate || !trip.dropDate) return null;

  try {
    const query = buildBookingQuery({
      pickupKey: trip.pickupKey,
      dropoffKey: trip.dropoffKey,
      pickDate: trip.pickDate,
      dropDate: trip.dropDate,
      pickHour: trip.pickHour,
      pickMin: trip.pickMin,
      dropHour: trip.dropHour,
      dropMin: trip.dropMin,
    });

    // Cache briefly: recommendations don't need to-the-second freshness and the
    // booking step re-validates live anyway.
    const { cars } = await fetchLiveBookingHtml(query, "/book", 180);
    if (!cars.length) return null;

    const days = daySpan(trip.pickDate, trip.dropDate);

    const available: AvailableCar[] = cars.map((car) => {
      const vehicle = matchFleetByTitle(car.title);
      const livePerDay =
        car.perDay ??
        (car.total != null && days > 0 ? Math.round(car.total / days) : null);
      return {
        mid: car.mid,
        title: car.title,
        slug: vehicle?.slug,
        name: vehicle?.name ?? car.title,
        image: vehicle?.image,
        category: vehicle?.category,
        livePerDay,
        liveTotal: car.total,
        normalTotal: car.normalTotal,
        discountPct: car.discountPct,
        bookUrl: car.bookHref,
        vehicle,
      };
    });

    return available;
  } catch {
    return null;
  }
}

/** Grounding lines for the LLM so it can cite real live prices. */
export function availabilityForPrompt(cars: AvailableCar[]): string {
  if (!cars.length) return "none";
  return cars
    .map((c) => {
      const price = c.livePerDay != null ? `€${c.livePerDay}/day live` : "price on request";
      const save = c.discountPct != null ? ` (save ${c.discountPct}%)` : "";
      return `- ${c.name}: ${price}${save}, available for the dates`;
    })
    .join("\n");
}
