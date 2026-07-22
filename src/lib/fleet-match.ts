import { fleet, type Vehicle } from "./fleet-data";
import type { ParsedCar } from "./iosrt";

const STOPWORDS = new Set([
  "or",
  "similar",
  "automatic",
  "auto",
  "manual",
  "the",
  "a",
]);

/** Normalize a model name/title into distinctive lowercase tokens. */
function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/station\s*wagon/g, "sw")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bsw\b/g, "station wagon")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
}

/**
 * Match a live engine title (e.g. "Citroen C4 Hybrid Automatic Or similar")
 * to a vehicle in our fleet. Picks the vehicle sharing the most name tokens,
 * preferring the one with the fewest unmatched tokens (so "Citroen C3" does not
 * win over "Citroen C3 Aircross Hybrid" when the title is the Aircross).
 */
export function matchFleetByTitle(title: string): Vehicle | undefined {
  const titleTokens = new Set(tokenize(title));
  let best: Vehicle | undefined;
  let bestShared = 0;
  let bestUnmatched = Number.POSITIVE_INFINITY;

  for (const vehicle of fleet) {
    const vt = tokenize(vehicle.name);
    const shared = vt.filter((t) => titleTokens.has(t)).length;
    const unmatched = vt.length - shared;
    if (
      shared >= 2 &&
      (shared > bestShared ||
        (shared === bestShared && unmatched < bestUnmatched))
    ) {
      best = vehicle;
      bestShared = shared;
      bestUnmatched = unmatched;
    }
  }

  return best;
}

export type AngleKey = "bestValue" | "popular" | "family" | "eco";

export type BookingRecommendation = {
  car: ParsedCar;
  vehicle?: Vehicle;
  angleKey: AngleKey;
};

type Enriched = { car: ParsedCar; vehicle?: Vehicle };

function isEco(e: Enriched): boolean {
  if (e.vehicle) return e.vehicle.fuel === "Electric" || e.vehicle.fuel === "Hybrid";
  return /electric|hybrid/i.test(e.car.title);
}

/**
 * Turn the live availability into a short, marketing-oriented set of picks:
 * best value, a popular all-rounder, a family option and an eco option.
 */
export function buildRecommendations(
  cars: ParsedCar[],
  limit = 4,
): BookingRecommendation[] {
  const enriched: Enriched[] = cars.map((car) => ({
    car,
    vehicle: matchFleetByTitle(car.title),
  }));

  const used = new Set<string>();
  const out: BookingRecommendation[] = [];

  const take = (
    angleKey: AngleKey,
    pick: (list: Enriched[]) => Enriched | undefined,
  ) => {
    const found = pick(enriched.filter((e) => !used.has(e.car.mid)));
    if (found) {
      used.add(found.car.mid);
      out.push({ car: found.car, vehicle: found.vehicle, angleKey });
    }
  };

  // Best value: lowest live total for the period.
  take("bestValue", (list) =>
    list
      .filter((e) => e.car.total != null)
      .sort((a, b) => (a.car.total ?? 0) - (b.car.total ?? 0))[0],
  );

  // Popular all-rounder: a comfortable mid-range car, else the median price.
  take("popular", (list) => {
    const withTotal = list
      .filter((e) => e.car.total != null)
      .sort((a, b) => (a.car.total ?? 0) - (b.car.total ?? 0));
    const preferred = withTotal.find(
      (e) => e.vehicle && ["Medium", "Family"].includes(e.vehicle.category),
    );
    return (
      preferred ?? withTotal[Math.floor(withTotal.length / 2)] ?? list[0]
    );
  });

  // Family / group: most seats among family-friendly categories.
  take("family", (list) => {
    const family = list
      .filter(
        (e) =>
          e.vehicle &&
          (["Family", "SUV", "7-Seater"].includes(e.vehicle.category) ||
            e.vehicle.seats >= 5),
      )
      .sort((a, b) => (b.vehicle?.seats ?? 0) - (a.vehicle?.seats ?? 0));
    return family[0];
  });

  // Eco: electric or hybrid.
  take("eco", (list) => list.find(isEco));

  return out.slice(0, limit);
}
