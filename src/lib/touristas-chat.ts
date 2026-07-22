import { fleet, type Vehicle } from "@/lib/fleet-data";
import { recommendFleet, type QuizAnswers } from "@/lib/recommend";
import { guideArticles } from "@/lib/guide-data";
import { whatsappUrl } from "@/lib/discover-cyclades";
import { buildBookingUrl, type BookingLocationKey } from "@/lib/site-config";

export type ChatDraft = {
  bookingActive?: boolean;
  recommendationsOffered?: boolean;
  awaitingDates?: boolean;
  vehicleSlug?: string;
  vehicleName?: string;
  /** ISO yyyy-mm-dd */
  from?: string;
  /** ISO yyyy-mm-dd */
  to?: string;
  pickupKey?: BookingLocationKey;
  partySize?: number;
  transmission?: "manual" | "automatic";
  vibe?: QuizAnswers["vibe"];
  budget?: QuizAnswers["budget"];
  group?: QuizAnswers["group"];
  name?: string;
  email?: string;
  phone?: string;
};

export type ChatVehicleCard = {
  slug: string;
  name: string;
  category?: string;
  seats?: number;
  transmission?: string;
  image?: string;
  path?: string;
  fromPrice?: number | null;
  bookUrl?: string;
  whatsappUrl?: string;
  /** Live availability enrichment (present only when a trip window is known). */
  available?: boolean;
  liveTotal?: number | null;
  normalTotal?: number | null;
  discountPct?: number | null;
};

export type LocalChatCard =
  | { kind: "recommend"; vehicles: ChatVehicleCard[]; from?: string | null; to?: string | null }
  | { kind: "rate"; dailyEur: number | null }
  | { kind: "guide"; results: { slug: string; title: string; path: string }[] }
  | { kind: "prefill"; url: string; whatsappUrl: string; vehicle?: ChatVehicleCard | null };

export type ChatFollowUp = {
  type: "message" | "book" | "whatsapp";
  label: string;
};

export type LocalChatReply = {
  text: string;
  cards: LocalChatCard[];
  followUps: ChatFollowUp[];
  draft: ChatDraft;
};

export function toChatCard(v: Vehicle): ChatVehicleCard {
  const book = buildBookingUrl();
  const wa = whatsappUrl(
    `Hello Naxos Auto Rent, I'd like to enquire about the ${v.name}.\n\nSent via Touristas AI on naxosautorent.com`,
  );
  return {
    slug: v.slug,
    name: v.name,
    category: v.category,
    seats: v.seats,
    transmission: v.transmission,
    image: v.image,
    path: `/fleet/${v.slug}`,
    fromPrice: v.fromPerDay,
    bookUrl: book,
    whatsappUrl: wa,
  };
}

function copy(locale: string) {
  const map: Record<
    string,
    {
      recommend: string;
      recommendLive: string;
      askDates: string;
      fleet: string;
      delivery: string;
      guide: string;
      bookHelp: string;
      fallback: string;
      followBook: string;
      followWhatsApp: string;
      followMore: string;
      followFamily: string;
      followEco: string;
    }
  > = {
    en: {
      recommend: "Here are the best matches from our fleet for your trip, with insurance, unlimited mileage and free airport/port delivery included.",
      recommendLive: "Here are cars available for your exact dates, with live prices, insurance, unlimited mileage and free airport/port delivery included.",
      askDates: "Tell me your pick-up and drop-off dates and I'll show live prices and availability for these cars.",
      fleet: "Here's a look at popular picks from our Naxos fleet. Tap a car to view details or book online.",
      delivery: "We deliver and collect for free at Naxos Airport, the port, and most accommodations on the island. Just tell us where you're staying when you book.",
      guide: "These local guides should help: beaches, villages, road trips and driving tips.",
      bookHelp: "I can recommend cars and send you to our live booking engine. Tell me your group size, vibe (beaches / villages / family / eco) and gearbox preference.",
      fallback: "I can help with car recommendations, free delivery, rates and Naxos guides. Try asking “family car”, “electric”, “beach hopping” or “show the fleet”.",
      followBook: "Book online",
      followWhatsApp: "WhatsApp the team",
      followMore: "Show more options",
      followFamily: "Family recommendations",
      followEco: "Electric & hybrid",
    },
    el: {
      recommend: "Ιδού οι καλύτερες επιλογές από τον στόλο μας, με ασφάλεια, απεριόριστα χιλιόμετρα και δωρεάν παράδοση.",
      recommendLive: "Ιδού αυτοκίνητα διαθέσιμα για τις ακριβείς ημερομηνίες σας, με ζωντανές τιμές, ασφάλεια, απεριόριστα χιλιόμετρα και δωρεάν παράδοση.",
      askDates: "Πείτε μου ημερομηνίες παραλαβής και επιστροφής και θα σας δείξω ζωντανές τιμές και διαθεσιμότητα.",
      fleet: "Δημοφιλείς επιλογές από τον στόλο μας στη Νάξο. Πατήστε για λεπτομέρειες ή κράτηση.",
      delivery: "Παραδίδουμε και παραλαμβάνουμε δωρεάν στο αεροδρόμιο, το λιμάνι και τα περισσότερα καταλύματα.",
      guide: "Αυτοί οι τοπικοί οδηγοί θα σας βοηθήσουν: παραλίες, χωριά, οδικά δρομολόγια.",
      bookHelp: "Μπορώ να προτείνω αυτοκίνητα και να σας στείλω στην online κράτηση. Πείτε μου μέγεθος παρέας και προτιμήσεις.",
      fallback: "Βοηθάω με προτάσεις αυτοκινήτων, παράδοση, τιμές και οδηγούς Νάξου. Δοκιμάστε «οικογενειακό», «ηλεκτρικό» ή «στόλος».",
      followBook: "Κράτηση online",
      followWhatsApp: "WhatsApp",
      followMore: "Περισσότερες επιλογές",
      followFamily: "Οικογενειακές προτάσεις",
      followEco: "Ηλεκτρικά & υβριδικά",
    },
  };
  return map[locale] ?? map.en;
}

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9,
  sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11,
  dec: 12, december: 12,
};

function isoDate(day: number, month: number, year?: number): string | null {
  if (!Number.isFinite(day) || !Number.isFinite(month) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const now = new Date();
  let y = year ?? now.getFullYear();
  if (!year) {
    const candidate = Date.UTC(y, month - 1, day);
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    if (candidate < todayUtc) y += 1;
  }
  return `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function orderRange(a: string, b: string): { from: string; to: string } {
  return a <= b ? { from: a, to: b } : { from: b, to: a };
}

/**
 * Best-effort extraction of a pick-up/drop-off date range from free text.
 * Handles ISO ranges, "12-18 Aug", "Aug 12-18", "12 Aug to 18 Aug" and
 * numeric "12/08 to 18/08" forms. Returns null when nothing usable is found.
 */
export function parseTripDates(message: string): { from: string; to: string } | null {
  const m = message.toLowerCase();
  const sep = "(?:to|until|till|through|thru|\\-|–|—|>)";

  // 1. ISO range: 2026-08-12 to 2026-08-18
  let match = m.match(new RegExp(`(\\d{4}-\\d{2}-\\d{2})\\s*${sep}\\s*(\\d{4}-\\d{2}-\\d{2})`));
  if (match) return orderRange(match[1], match[2]);

  // 2. Two "day month" mentions: 12 Aug to 18 August
  match = m.match(/\b(\d{1,2})\s+([a-z]{3,})\b[\s\S]*?\b(\d{1,2})\s+([a-z]{3,})\b/);
  if (match && MONTHS[match[2]] && MONTHS[match[4]]) {
    const from = isoDate(Number(match[1]), MONTHS[match[2]]);
    const to = isoDate(Number(match[3]), MONTHS[match[4]]);
    if (from && to) return orderRange(from, to);
  }

  // 3. "12-18 Aug" (day range, single month after)
  match = m.match(new RegExp(`\\b(\\d{1,2})\\s*${sep}\\s*(\\d{1,2})\\s+([a-z]{3,})`));
  if (match && MONTHS[match[3]]) {
    const from = isoDate(Number(match[1]), MONTHS[match[3]]);
    const to = isoDate(Number(match[2]), MONTHS[match[3]]);
    if (from && to) return orderRange(from, to);
  }

  // 4. "Aug 12-18" (month first, day range)
  match = m.match(new RegExp(`\\b([a-z]{3,})\\s+(\\d{1,2})\\s*${sep}\\s*(\\d{1,2})`));
  if (match && MONTHS[match[1]]) {
    const from = isoDate(Number(match[2]), MONTHS[match[1]]);
    const to = isoDate(Number(match[3]), MONTHS[match[1]]);
    if (from && to) return orderRange(from, to);
  }

  // 5. Numeric dd/mm(/yyyy) range: 12/08 to 18/08/2026
  match = m.match(
    new RegExp(
      `\\b(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?\\s*${sep}\\s*(\\d{1,2})[/.](\\d{1,2})(?:[/.](\\d{2,4}))?`,
    ),
  );
  if (match) {
    const yr = (v?: string) => (v ? (v.length === 2 ? 2000 + Number(v) : Number(v)) : undefined);
    const from = isoDate(Number(match[1]), Number(match[2]), yr(match[3]));
    const to = isoDate(Number(match[4]), Number(match[5]), yr(match[6]));
    if (from && to) return orderRange(from, to);
  }

  return null;
}

function extractIntent(message: string, draft: ChatDraft): ChatDraft {
  const m = message.toLowerCase();
  const next: ChatDraft = { ...draft };

  if (/\b(family|kids|children|οικογέν|famille|famiglia|gezin|familie)\b/.test(m)) {
    next.group = "family";
    next.vibe = "family";
  } else if (/\b(solo|couple|two|duo|ζευγάρι)\b/.test(m)) {
    next.group = "solo";
  } else if (/\b(group|friends|7.?seat|seven|ομάδα|groep)\b/.test(m)) {
    next.group = "group";
  }

  if (/\b(beach|beaches|παραλί|plage|spiagg|strand)\b/.test(m)) next.vibe = "explore";
  if (/\b(village|χωρι|dorf|villag)\b/.test(m)) next.vibe = "explore";
  if (/\b(city|chora|town|πόλη)\b/.test(m)) next.vibe = "city";
  if (/\b(electric|eco|hybrid|ηλεκτρ|υβριδ|électrique|ibrida|elektro)\b/.test(m)) {
    next.vibe = "eco";
  }

  if (/\b(cheap|budget|low|φθην|économique|goedkoop|günstig)\b/.test(m)) next.budget = "low";
  if (/\b(luxury|premium|high|ακριβ)\b/.test(m)) next.budget = "high";

  if (/\b(automatic|αυτόματο|automatique|automatisch)\b/.test(m)) next.transmission = "automatic";
  if (/\b(manual|χειροκίνητο|manuelle|handgeschakeld)\b/.test(m)) next.transmission = "manual";

  const party = m.match(/\b([2-9]|1[0-2])\s*(people|persons|adults|seats|άτομα|personen|persone)\b/);
  if (party) next.partySize = Number(party[1]);

  // Pick-up location keyword
  if (/\bairport\b|αεροδρόμ|a[eé]roport|flughafen|luchthaven/.test(m)) next.pickupKey = "airport";
  else if (/\bport\b|λιμάν|porto|hafen|haven/.test(m)) next.pickupKey = "port";

  // Trip dates for live availability
  const dates = parseTripDates(message);
  if (dates) {
    next.from = dates.from;
    next.to = dates.to;
    next.awaitingDates = false;
  }

  return next;
}

function wantsRecommend(message: string): boolean {
  return /\b(recommend|suggest|best|need|looking|want|book|car|auto|rent|fleet|family|electric|beach|show|help|πρότειν|αυτοκίνητ|noleggio|voiture|auto|wagen)\b/i.test(
    message,
  );
}

function wantsFleet(message: string): boolean {
  return /\b(fleet|all cars|show.*(car|fleet)|στόλο|flotte|wagenpark)\b/i.test(message);
}

function wantsDelivery(message: string): boolean {
  return /\b(deliver|airport|port|pickup|pick.?up|drop.?off|παράδοσ|αεροδρόμι|λιμάνι|aéroport|porto|haven|flughafen)\b/i.test(
    message,
  );
}

function wantsGuide(message: string): boolean {
  return /\b(guide|beach|village|road.?trip|driving|οδηγό|παραλί|χωρι|guida|reiseführer|gids)\b/i.test(
    message,
  );
}

/**
 * Lightweight conversational engine for Naxos Auto Rent Touristas chat.
 * Reuses recommendFleet() for structured car picks.
 */
export function answerTouristasLocal(
  message: string,
  locale: string,
  draft: ChatDraft = {},
): LocalChatReply {
  const c = copy(locale);
  const nextDraft = extractIntent(message, draft);
  const cards: LocalChatCard[] = [];
  const followUps: ChatFollowUp[] = [];
  let text = c.fallback;

  if (wantsDelivery(message) && !wantsRecommend(message)) {
    text = c.delivery;
    followUps.push(
      { type: "message", label: c.followFamily },
      { type: "book", label: c.followBook },
      { type: "whatsapp", label: c.followWhatsApp },
    );
    return { text, cards, followUps, draft: nextDraft };
  }

  if (wantsGuide(message) && !wantsRecommend(message) && !wantsFleet(message)) {
    text = c.guide;
    cards.push({
      kind: "guide",
      results: guideArticles.slice(0, 4).map((a) => ({
        slug: a.slug,
        title: a.title,
        path: `/guide/${a.slug}`,
      })),
    });
    followUps.push(
      { type: "message", label: c.followFamily },
      { type: "book", label: c.followBook },
    );
    return { text, cards, followUps, draft: nextDraft };
  }

  if (/\b(book|reserv|κράτησ|prenot|réserver|buchen|boeken)\b/i.test(message) && !wantsRecommend(message)) {
    text = c.bookHelp;
    nextDraft.bookingActive = true;
    followUps.push(
      { type: "message", label: c.followFamily },
      { type: "message", label: c.followEco },
      { type: "book", label: c.followBook },
    );
    return { text, cards, followUps, draft: nextDraft };
  }

  const justProvidedDates =
    Boolean(nextDraft.from && nextDraft.to) &&
    (draft.awaitingDates || draft.recommendationsOffered);

  if (
    wantsFleet(message) ||
    wantsRecommend(message) ||
    nextDraft.group ||
    nextDraft.vibe ||
    justProvidedDates
  ) {
    const answers: QuizAnswers = {
      group: nextDraft.group,
      budget: nextDraft.budget,
      vibe: nextDraft.vibe,
      transmission: nextDraft.transmission ?? "any",
      notes: message,
    };
    const picks = recommendFleet(answers, wantsFleet(message) ? 4 : 3);
    const hasDates = Boolean(nextDraft.from && nextDraft.to);
    text = wantsFleet(message) ? c.fleet : hasDates ? c.recommendLive : c.recommend;
    cards.push({
      kind: "recommend",
      vehicles: picks.map((p) => toChatCard(p.vehicle)),
      from: nextDraft.from,
      to: nextDraft.to,
    });
    nextDraft.recommendationsOffered = true;
    // Nudge for dates so the route can enrich with live availability.
    nextDraft.awaitingDates = !hasDates;
    if (picks[0]) {
      nextDraft.vehicleSlug = picks[0].vehicle.slug;
      nextDraft.vehicleName = picks[0].vehicle.name;
    }
    followUps.push(
      { type: "book", label: c.followBook },
      { type: "whatsapp", label: c.followWhatsApp },
      { type: "message", label: c.followMore },
    );
    return { text, cards, followUps, draft: nextDraft };
  }

  // Default: show a couple of popular cars so the chat always feels useful
  const popular = fleet.slice(0, 3);
  cards.push({ kind: "recommend", vehicles: popular.map(toChatCard) });
  followUps.push(
    { type: "message", label: c.followFamily },
    { type: "message", label: c.followEco },
    { type: "book", label: c.followBook },
  );
  return { text, cards, followUps, draft: nextDraft };
}
