import { generateText } from "ai";
import {
  answerTouristasLocal,
  toChatCard,
  type ChatDraft,
  type ChatVehicleCard,
  type LocalChatCard,
  type LocalChatReply,
} from "@/lib/touristas-chat";
import { locales } from "@/i18n/routing";
import { fleetSummaryForPrompt } from "@/lib/recommend";
import {
  availabilityForPrompt,
  getLiveAvailability,
  type AvailableCar,
} from "@/lib/live-availability";

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

function applyLive(card: ChatVehicleCard, live: AvailableCar): ChatVehicleCard {
  return {
    ...card,
    fromPrice: live.livePerDay ?? card.fromPrice,
    bookUrl: live.bookUrl,
    available: true,
    liveTotal: live.liveTotal,
    normalTotal: live.normalTotal,
    discountPct: live.discountPct,
  };
}

/**
 * Rewrite recommend cards to the cars that are actually live-available for the
 * traveller's dates, with live prices and step=2 book links. Falls back to the
 * available list when none of the current picks are available.
 */
function enrichCardsWithLive(
  cards: LocalChatCard[],
  available: AvailableCar[],
): LocalChatCard[] {
  const bySlug = new Map<string, AvailableCar>();
  for (const car of available) {
    if (car.slug && !bySlug.has(car.slug)) bySlug.set(car.slug, car);
  }

  return cards.map((card) => {
    if (card.kind !== "recommend") return card;

    const enriched = card.vehicles
      .map((v) => {
        const live = bySlug.get(v.slug);
        return live ? applyLive(v, live) : null;
      })
      .filter((v): v is ChatVehicleCard => v !== null);

    if (enriched.length > 0) {
      return { ...card, vehicles: enriched };
    }

    // None of the picks are available: offer what is available (fleet-matched).
    const fallback = available
      .filter((c) => c.vehicle)
      .slice(0, 3)
      .map((c) => applyLive(toChatCard(c.vehicle!), c));

    return fallback.length > 0 ? { ...card, vehicles: fallback } : card;
  });
}

export async function POST(req: Request) {
  let body: { message?: string; locale?: string; draft?: ChatDraft };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const message = (body.message ?? "").trim();
  const locale = locales.includes((body.locale ?? "en") as never)
    ? (body.locale as string)
    : "en";
  const draft = body.draft && typeof body.draft === "object" ? body.draft : {};

  if (!message) {
    const empty: LocalChatReply = {
      text: "Tell me a bit about your trip and I'll suggest cars.",
      cards: [],
      followUps: [],
      draft,
    };
    return Response.json(empty);
  }

  const local = answerTouristasLocal(message, locale, draft);

  // Enrich recommendations with live availability when we know the trip window.
  let liveGrounding = "none";
  const nextDraft = local.draft;
  if (nextDraft.from && nextDraft.to) {
    const available = await getLiveAvailability({
      pickupKey: nextDraft.pickupKey,
      dropoffKey: nextDraft.pickupKey,
      pickDate: nextDraft.from,
      dropDate: nextDraft.to,
    });
    if (available && available.length) {
      local.cards = enrichCardsWithLive(local.cards, available);
      liveGrounding = availabilityForPrompt(available);
    }
  }

  if (!hasGatewayCredentials()) {
    return Response.json(local);
  }

  try {
    const cardSummary = local.cards
      .filter((c) => c.kind === "recommend")
      .flatMap((c) => (c.kind === "recommend" ? c.vehicles : []))
      .map((v) => `${v.name} (€${v.fromPrice}/day)`)
      .join(", ");

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `You are Touristas AI, the friendly car-rental concierge for Naxos Auto Rent on Naxos island, Greece.
Write a short warm reply (2–5 sentences) in ${languageNames[locale] ?? "English"}.
If cars are already selected for cards, do NOT re-list full specs. Briefly explain why they fit.
${liveGrounding !== "none" ? "The listed prices/availability are LIVE for the traveller's exact dates; you may confirm the cars are available for their trip." : "If the traveller has not given dates, gently invite them to share pick-up and drop-off dates for live prices."}
Reassure: insurance, unlimited mileage, free airport/port delivery.
Do not invent cars or prices. Keep under 100 words. No bullet lists unless essential.

Fleet reference:
${fleetSummaryForPrompt()}

Live availability for the traveller's dates:
${liveGrounding}

Cards already shown in UI: ${cardSummary || "none"}`,
      prompt: `Traveller message: ${message}
Draft so far: ${JSON.stringify(local.draft)}
Local engine draft reply (improve tone, keep facts): ${local.text}`,
      temperature: 0.6,
    });

    const polished: LocalChatReply = {
      ...local,
      text: text.trim() || local.text,
    };
    return Response.json(polished);
  } catch {
    return Response.json(local);
  }
}
