import { fleet, type Vehicle } from "@/lib/fleet-data";
import { recommendFleet, type QuizAnswers } from "@/lib/recommend";
import { guideArticles } from "@/lib/guide-data";
import { whatsappUrl } from "@/lib/discover-cyclades";
import { buildBookingUrl } from "@/lib/site-config";

export type ChatDraft = {
  bookingActive?: boolean;
  recommendationsOffered?: boolean;
  vehicleSlug?: string;
  vehicleName?: string;
  from?: string;
  to?: string;
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

function toCard(v: Vehicle): ChatVehicleCard {
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

  if (wantsFleet(message) || wantsRecommend(message) || nextDraft.group || nextDraft.vibe) {
    const answers: QuizAnswers = {
      group: nextDraft.group,
      budget: nextDraft.budget,
      vibe: nextDraft.vibe,
      transmission: nextDraft.transmission ?? "any",
      notes: message,
    };
    const picks = recommendFleet(answers, wantsFleet(message) ? 4 : 3);
    text = wantsFleet(message) ? c.fleet : c.recommend;
    cards.push({
      kind: "recommend",
      vehicles: picks.map((p) => toCard(p.vehicle)),
      from: nextDraft.from,
      to: nextDraft.to,
    });
    nextDraft.recommendationsOffered = true;
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
  cards.push({ kind: "recommend", vehicles: popular.map(toCard) });
  followUps.push(
    { type: "message", label: c.followFamily },
    { type: "message", label: c.followEco },
    { type: "book", label: c.followBook },
  );
  return { text, cards, followUps, draft: nextDraft };
}
