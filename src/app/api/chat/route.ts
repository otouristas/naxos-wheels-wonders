import { generateText } from "ai";
import { answerTouristasLocal, type ChatDraft, type LocalChatReply } from "@/lib/touristas-chat";
import { locales } from "@/i18n/routing";
import { fleetSummaryForPrompt } from "@/lib/recommend";

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
Reassure: insurance, unlimited mileage, free airport/port delivery.
Do not invent cars or prices. Keep under 100 words. No bullet lists unless essential.

Fleet reference:
${fleetSummaryForPrompt()}

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
