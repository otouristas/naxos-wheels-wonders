export const siteConfig = {
  name: "Naxos Auto Rent",
  domain: "https://naxos-car-rental.com",
  phonePrimary: "+30 693 099 3670",
  phoneSecondary: "+30 697 443 0785",
  phonePrimaryHref: "+306930993670",
  whatsappHref: "306930993670",
  email: "info@naxosautorent.com",
  office: "Galanado Village, 84300 Naxos, Greece",
  mhte: "1174Ε81001132001",
  gemi: "175531838000",
  rating: 5.0,
  reviewCount: 381,
  social: {
    facebook: "https://www.facebook.com/naxosautorent",
    google: "https://g.page/naxosautorent",
    /** Direct link to leave a Google review. */
    googleReview: "https://g.page/r/CWRc6X8tLwkqEBM/review",
  },
  /** Primary office map (Galanado), used for footer / office card. */
  mapUrl: "https://www.google.com/maps?cid=3029004096849402980",
} as const;

/**
 * Free pick-up / drop-off Google Maps places (cid embeds).
 * Office · Port · Airport · Naxos Town
 */
export const mapLocations = [
  {
    key: "office",
    cid: "3029004096849402980",
    labelKey: "maps.office",
  },
  {
    key: "port",
    cid: "12519136232404677866",
    labelKey: "maps.port",
  },
  {
    key: "airport",
    cid: "5827807864314390682",
    labelKey: "maps.airport",
  },
  {
    key: "town",
    cid: "288438376631748240",
    labelKey: "maps.town",
  },
] as const;

export type MapLocationKey = (typeof mapLocations)[number]["key"];

export function mapPlaceUrl(cid: string) {
  return `https://www.google.com/maps?cid=${cid}`;
}

export function mapEmbedUrl(cid: string) {
  return `https://www.google.com/maps?cid=${cid}&hl=en&source=embed&output=embed`;
}

/**
 * Pickup / drop-off locations for the live booking engine (iosrt-api-client).
 * IDs match https://naxosautorent.com/book/ location select.
 */
export const bookingLocations = [
  { key: "airport", id: 38, labelKey: "airport" },
  { key: "port", id: 37, labelKey: "port" },
  { key: "accommodationNear", id: 39, labelKey: "accommodationNear" },
  { key: "accommodationFar", id: 52, labelKey: "accommodationFar" },
] as const;

export type BookingLocationKey = (typeof bookingLocations)[number]["key"];

/** On-site booking route (live iosrt engine proxied into this Next.js app). */
const BOOKING_PATH = "/book";

function toEngineDate(iso: string): string {
  // "2026-09-18" -> "18-09-2026"
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
}

function locationId(key?: BookingLocationKey): number {
  return bookingLocations.find((l) => l.key === key)?.id ?? 38;
}

export type BookingParams = {
  pickupKey?: BookingLocationKey;
  dropoffKey?: BookingLocationKey;
  /** ISO yyyy-mm-dd */
  pickDate?: string;
  /** ISO yyyy-mm-dd */
  dropDate?: string;
  pickHour?: string;
  pickMin?: string;
  dropHour?: string;
  dropMin?: string;
};

/**
 * Build the raw iosrt engine query params (same contract as the WordPress book
 * page). Shared by the on-site deep-link and the server-side availability fetch.
 */
export function buildBookingQuery(params: BookingParams = {}): Record<string, string> {
  const {
    pickupKey,
    dropoffKey,
    pickDate,
    dropDate,
    pickHour = "10",
    pickMin = "00",
    dropHour = "10",
    dropMin = "00",
  } = params;

  const q: Record<string, string> = {
    picklid: String(locationId(pickupKey)),
    pickhour: pickHour,
    pickmin: pickMin,
    droplid: String(locationId(dropoffKey ?? pickupKey)),
    drophour: dropHour,
    dropmin: dropMin,
    agid: "0",
    vtype: "car",
    step: "1",
  };
  if (pickDate) q.pickdate = toEngineDate(pickDate);
  if (dropDate) q.dropdate = toEngineDate(dropDate);

  return q;
}

/**
 * Build a deep-link into the on-site live availability engine.
 * Same query contract as the WordPress iosrt book page.
 */
export function buildBookingUrl(params: BookingParams = {}): string {
  const q = new URLSearchParams(buildBookingQuery(params));
  return `${BOOKING_PATH}?${q.toString()}` as "/book";
}

export const bookingHours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
export const bookingMinutes = ["00", "15", "30", "45"];
