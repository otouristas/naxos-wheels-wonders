import { generateText } from "ai";
import { fleet } from "@/lib/fleet-data";
import { recommendFleet, fleetSummaryForPrompt, type QuizAnswers } from "@/lib/recommend";
import {
  availabilityForPrompt,
  getLiveAvailability,
  type AvailableCar,
  type TripInput,
} from "@/lib/live-availability";
import { locales } from "@/i18n/routing";

export const runtime = "nodejs";
export const maxDuration = 30;

const languageNames: Record<string, string> = {
  en: "English",
  el: "Greek",
  it: "Italian",
  fr: "French",
  de: "German",
  nl: "Dutch",
};

function hasGatewayCredentials(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}

function introForLocale(locale: string): string {
  const map: Record<string, string> = {
    en: "Based on your trip, here are the best matches from our fleet, all with free delivery, unlimited mileage and insurance included.",
    el: "Με βάση το ταξίδι σας, ιδού οι καλύτερες επιλογές από τον στόλο μας, με δωρεάν παράδοση, απεριόριστα χιλιόμετρα και ασφάλεια.",
    it: "In base al tuo viaggio, ecco le migliori auto della nostra flotta, con consegna gratuita, chilometraggio illimitato e assicurazione inclusa.",
    fr: "D'après votre voyage, voici les meilleures voitures de notre flotte : livraison gratuite, kilométrage illimité et assurance inclus.",
    de: "Basierend auf Ihrer Reise sind das die besten Autos aus unserer Flotte, inklusive kostenloser Lieferung, unbegrenzter Kilometer und Versicherung.",
    nl: "Op basis van uw reis zijn dit de beste matches uit ons wagenpark, met gratis levering, onbeperkte kilometers en verzekering.",
  };
  return map[locale] ?? map.en;
}

export type TouristasPick = {
  slug: string;
  name: string;
  fromPerDay: number;
  reason: string;
  /** Live availability enrichment (present only when a trip window was given). */
  available?: boolean;
  livePerDay?: number | null;
  liveTotal?: number | null;
  normalTotal?: number | null;
  discountPct?: number | null;
  bookUrl?: string;
};

export type TouristasResponse = {
  message: string;
  picks: TouristasPick[];
};

function buildStaticPicks(answers: QuizAnswers): TouristasPick[] {
  return recommendFleet(answers, 3).map((p) => ({
    slug: p.vehicle.slug,
    name: p.vehicle.name,
    fromPerDay: p.vehicle.fromPerDay,
    reason: p.reason,
  }));
}

/**
 * Rank the fleet by fit, then keep only cars that are live-available for the
 * trip window, attaching live price/discount and a step=2 deep link.
 */
function buildLivePicks(
  answers: QuizAnswers,
  available: AvailableCar[],
): TouristasPick[] {
  const bySlug = new Map<string, AvailableCar>();
  for (const car of available) {
    if (car.slug && !bySlug.has(car.slug)) bySlug.set(car.slug, car);
  }

  return recommendFleet(answers, fleet.length)
    .map((p): TouristasPick | null => {
      const live = bySlug.get(p.vehicle.slug);
      if (!live) return null;
      return {
        slug: p.vehicle.slug,
        name: p.vehicle.name,
        fromPerDay: p.vehicle.fromPerDay,
        reason: p.reason,
        available: true,
        livePerDay: live.livePerDay,
        liveTotal: live.liveTotal,
        normalTotal: live.normalTotal,
        discountPct: live.discountPct,
        bookUrl: live.bookUrl,
      };
    })
    .filter((p): p is TouristasPick => p !== null)
    .slice(0, 3);
}

export async function POST(req: Request) {
  let body: { answers?: QuizAnswers; locale?: string; trip?: TripInput };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const answers: QuizAnswers = body.answers ?? {};
  const locale = locales.includes((body.locale ?? "en") as never) ? (body.locale as string) : "en";
  const trip = body.trip && body.trip.pickDate && body.trip.dropDate ? body.trip : undefined;

  // When a trip window is given, prefer cars that are actually available for
  // those dates (with live prices). Fall back to static picks otherwise.
  let picks = buildStaticPicks(answers);
  let liveGrounding = "none";
  if (trip) {
    const available = await getLiveAvailability(trip);
    if (available && available.length) {
      const livePicks = buildLivePicks(answers, available);
      if (livePicks.length) {
        picks = livePicks;
        liveGrounding = availabilityForPrompt(available);
      }
    }
  }

  const groundingText = picks
    .map((p) => {
      const price = p.livePerDay != null ? p.livePerDay : p.fromPerDay;
      return `${p.name} (slug=${p.slug}, €${price}/day): ${p.reason}`;
    })
    .join("\n");

  // No credentials: rule-based intro + structured picks for the UI cards.
  if (!hasGatewayCredentials()) {
    const payload: TouristasResponse = {
      message: introForLocale(locale),
      picks,
    };
    return Response.json(payload);
  }

  const system = `You are Touristas AI, the friendly car-matching concierge for Naxos Auto Rent on Naxos island, Greece.
The UI already displays these recommended cars as cards, so do NOT list car names, prices or specs again.
Write ONLY a short warm intro (2 to 4 sentences) in ${languageNames[locale] ?? "English"}.
Mention why these picks fit the trip (beaches, villages, family, etc.).
${trip ? "These prices and availability are LIVE for the traveller's exact dates, so you may reassure them the cars are confirmed available for their trip." : ""}
Reassure: insurance, unlimited mileage, free airport/port delivery included.
End with a light nudge to book or message the team.
Do not invent cars. Keep under 90 words. No bullet lists.

Pre-selected cars (already shown as cards):
${groundingText}

Live availability for the traveller's dates:
${liveGrounding}

Full fleet reference:
${fleetSummaryForPrompt()}`;

  const userPrompt = `Traveller details:
- Group size: ${answers.group ?? "unspecified"}
- Budget: ${answers.budget ?? "unspecified"}
- Trip type: ${answers.vibe ?? "unspecified"}
- Gearbox preference: ${answers.transmission ?? "any"}
- Trip window: ${trip ? `${trip.pickDate} to ${trip.dropDate}` : "not specified"}
- Notes: ${answers.notes || "none"}`;

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system,
      prompt: userPrompt,
      temperature: 0.6,
    });
    const payload: TouristasResponse = {
      message: text.trim() || introForLocale(locale),
      picks,
    };
    return Response.json(payload);
  } catch {
    const payload: TouristasResponse = {
      message: introForLocale(locale),
      picks,
    };
    return Response.json(payload);
  }
}
