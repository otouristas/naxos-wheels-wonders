const WP_BOOK = "https://naxosautorent.com/book/";
const WP_IOSRT =
  "https://naxosautorent.com/wp-content/plugins/iosrt-api-client/client";

/** Required before iosrt client.js / calendar init. */
export const IOSRT_GLOBALS_SCRIPT = `
var iosRTCalDisRanges = {};
var iosRTCalHourRanges = {};
var iosRTCalRentdRanges = {};
var iosRTCalminrentdays = 1;
var iosRTCalmaxrentdays = 100;
var iosRTCalpickupdayofweek = -1;
var iosRTCaldropoffdayofweek = -1;
var iosRThidedrop = 0;
var iosRTpickplushours = 1;
var iosRTtimezoneOffset = 10800;
var iosrt_bookwait = 0;
`.trim();

export const IOSRT_ASSETS = {
  css: [
    `${WP_IOSRT}/templates/default/css/roboto.css`,
    `${WP_IOSRT}/templates/default/css/default.css`,
    `${WP_IOSRT}/css/flatpickr.min.css`,
    `${WP_IOSRT}/css/swiper.min.css`,
    "https://naxosautorent.com/wp-content/plugins/iosrt-api-affbooks/inc/iosrtaffbooks.css",
    "https://naxosautorent.com/wp-content/plugins/iosrt-api-map/inc/iosrtmap.css",
  ],
  /** Load order matters: tippy → flatpickr → swiper → client */
  js: [
    `${WP_IOSRT}/js/tippy.min.js`,
    `${WP_IOSRT}/js/flatpickr.min.js`,
    `${WP_IOSRT}/js/swiper.min.js`,
    "/api/iosrt/js/client.js",
  ],
} as const;

export type BookQuery = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function hasBookingSearch(query: BookQuery): boolean {
  // Step 1 (search) uses pickdate/dropdate; step 2+ (a chosen car) uses
  // pickup/dropoff + step. Treat both as "show the live engine".
  const hasDates = Boolean(first(query.pickdate) && first(query.dropdate));
  const hasPickupDropoff = Boolean(first(query.pickup) && first(query.dropoff));
  const step = Number.parseInt(first(query.step) ?? "", 10);
  return hasDates || hasPickupDropoff || (Number.isFinite(step) && step >= 2);
}

/** Build the upstream WordPress book URL from our search params. */
export function buildUpstreamBookUrl(query: BookQuery): string {
  const url = new URL(WP_BOOK);
  for (const [key, raw] of Object.entries(query)) {
    const value = first(raw);
    if (value != null && value !== "") url.searchParams.set(key, value);
  }
  // Always request availability step when dates are present
  if (hasBookingSearch(query) && !first(query.step)) {
    url.searchParams.set("step", "1");
  }
  return url.toString();
}

/** A single vehicle parsed from the live availability results. */
export type ParsedCar = {
  /** iosrt model id (mid). */
  mid: string;
  /** Model title, e.g. "Citroen C3 Aircross Hybrid Automatic". */
  title: string;
  /** Live total for the rental period (EUR), if parseable. */
  total: number | null;
  /** Derived per-day price (EUR), if the period length is known. */
  perDay: number | null;
  /** Description shown under the price, e.g. "price for 6 days". */
  priceDesc: string;
  /** Original (pre-discount) total, if the card shows a strikethrough price. */
  normalTotal: number | null;
  /** Discount percentage (integer) when a normal price is present. */
  discountPct: number | null;
  /** Same-site deep link into booking this exact car for the searched dates. */
  bookHref: string;
  /** Upstream image URL from the engine (fallback only). */
  imageUrl: string | null;
};

export type LiveBookingPayload = {
  html: string;
  hasResults: boolean;
  cars: ParsedCar[];
};

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&#8364;|&euro;/g, "€")
    .replace(/&nbsp;/g, " ")
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function toNumber(raw: string | undefined): number | null {
  if (!raw) return null;
  // Strip HTML entities (e.g. the euro symbol &#8364;) before reading digits.
  const cleaned = raw
    .replace(/&#?\w+;/g, "")
    .replace(/[^\d.,]/g, "")
    .replace(/,/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * Parse the live availability vehicle cards from the (already rewritten) iosrt
 * results HTML. Each card is `<div class="iosrt_model" id="iosrt_model_<mid>">`
 * with a title, a period total, an optional strikethrough price and a book link.
 */
export function parseAvailabilityCars(html: string): ParsedCar[] {
  const starts: { mid: string; index: number }[] = [];
  const startRe = /<div class="iosrt_model"[^>]*id="iosrt_model_(\d+)"/g;
  let m: RegExpExecArray | null;
  while ((m = startRe.exec(html)) !== null) {
    starts.push({ mid: m[1], index: m.index });
  }

  const cars: ParsedCar[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < starts.length; i += 1) {
    const { mid, index } = starts[i];
    if (seen.has(mid)) continue;
    const end = i + 1 < starts.length ? starts[i + 1].index : html.length;
    const block = html.slice(index, end);

    const titleRaw = block.match(
      /class="iosrt_model_title"[^>]*>\s*([^<]+)/,
    )?.[1];
    const title = titleRaw ? decodeEntities(titleRaw) : "";
    if (!title) continue;

    const total = toNumber(
      block.match(/class="iosrt_model_price"[^>]*>\s*([^<]+)/)?.[1],
    );
    const priceDesc = decodeEntities(
      block.match(/class="iosrt_model_pricedesc"[^>]*>\s*([^<]+)/)?.[1] ?? "",
    );
    const normalTotal = toNumber(
      block.match(/class="iosrt_model_normalprice[^"]*"[^>]*>\s*([^<]+)/)?.[1],
    );

    const days = Number.parseInt(priceDesc.match(/(\d+)\s*day/i)?.[1] ?? "", 10);
    const perDay =
      total != null && Number.isFinite(days) && days > 0
        ? Math.round(total / days)
        : null;

    const discountPct =
      total != null && normalTotal != null && normalTotal > total
        ? Math.round(((normalTotal - total) / normalTotal) * 100)
        : null;

    const hrefRaw = block.match(
      /<a[^>]*href="([^"]*step=2[^"]*)"[^>]*class="iosrt_abtn"/,
    )?.[1];
    const bookHref = hrefRaw ? decodeEntities(hrefRaw) : "";

    const imageUrl =
      block.match(/class="iosrt_model_img"[^>]*>\s*<img[^>]*src="([^"]+)"/)?.[1] ??
      block.match(/id="iosrt_model\d+_img_0"[^>]*src="([^"]+)"/)?.[1] ??
      null;

    seen.add(mid);
    cars.push({
      mid,
      title,
      total,
      perDay,
      priceDesc,
      normalTotal,
      discountPct,
      bookHref,
      imageUrl,
    });
  }

  return cars;
}

/**
 * Fetch live iosrt markup from WordPress and rewrite absolute book/ajax URLs
 * so the engine stays on this Next.js site.
 */
export async function fetchLiveBookingHtml(
  query: BookQuery,
  bookPath: string,
  revalidateSeconds = 0,
): Promise<LiveBookingPayload> {
  const upstream = buildUpstreamBookUrl(query);
  const res = await fetch(upstream, {
    headers: {
      accept: "text/html",
      "user-agent": "NaxosAutoRent/1.0",
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`Booking engine unavailable (${res.status})`);
  }

  const html = await res.text();
  const match = html.match(
    /class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<!-- \.entry-content/,
  );
  let chunk = match?.[1];
  if (!chunk) {
    throw new Error("Could not extract booking engine from upstream");
  }

  // Prefer the iosrt integration block (skip WordPress marketing chrome).
  const iosrtStart = chunk.indexOf("<!-- Start of IOS Rentals API");
  if (iosrtStart >= 0) chunk = chunk.slice(iosrtStart);

  const rewritten = rewriteBookingHtml(chunk, bookPath);
  const cars = parseAvailabilityCars(rewritten);
  const hasResults =
    cars.length > 0 ||
    rewritten.includes("iosrt_maincol") ||
    rewritten.includes('class="iosrt_model"') ||
    // Step 2+ (a chosen car): the booking form rather than an availability list.
    rewritten.includes("iosrt_fmbook") ||
    rewritten.includes("iosrt_book_");

  return { html: rewritten, hasResults, cars };
}

export function rewriteBookingHtml(html: string, bookPath: string): string {
  const path = bookPath.endsWith("/") ? bookPath.slice(0, -1) : bookPath;

  return (
    html
      // Drop Cloudflare email-decode (404 on our domain) and broken absolute cdn-cgi
      .replace(/<script[^>]*cdn-cgi\/scripts[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<script[^>]*email-decode[^>]*>[\s\S]*?<\/script>/gi, "")
      // Form posts / step links stay on this site
      .replaceAll("https://naxosautorent.com/book/", `${path}/`)
      .replaceAll("https://naxosautorent.com/book", path)
      .replaceAll("https:\\/\\/naxosautorent.com\\/book", path.replaceAll("/", "\\/"))
      // Ajax + asset base → our proxy (avoids CORS)
      .replaceAll(`${WP_IOSRT}/ajax.php`, "/api/iosrt/ajax.php")
      .replaceAll(WP_IOSRT, "/api/iosrt")
      // Contact deep-link on this site
      .replaceAll("https://naxosautorent.com/contact/", "/contact")
      .replaceAll("https://naxosautorent.com/contact", "/contact")
  );
}

/** Format an engine datetime ("2026-09-23 10:00:00" / with "+") for display. */
function formatEngineDateTime(value: string | undefined): string | null {
  if (!value) return null;
  const [date, time] = value.replace("+", " ").trim().split(" ");
  if (!date) return null;
  const hm = time ? time.slice(0, 5) : "";
  return hm ? `${date} · ${hm}` : date;
}

/** Human-readable trip bits for the results header. */
export function summarizeBookingQuery(query: BookQuery) {
  const pickdate = first(query.pickdate);
  const dropdate = first(query.dropdate);
  const pickhour = first(query.pickhour) ?? "10";
  const pickmin = first(query.pickmin) ?? "00";
  const drophour = first(query.drophour) ?? "10";
  const dropmin = first(query.dropmin) ?? "00";
  const picklid = first(query.picklid);
  const locationLabel: Record<string, string> = {
    "38": "Naxos Airport",
    "37": "Naxos Port",
    "39": "Accommodation ≤10km",
    "52": "Accommodation 10km+",
  };

  return {
    location: (picklid && locationLabel[picklid]) || "Naxos",
    pickup: pickdate
      ? `${pickdate} · ${pickhour}:${pickmin}`
      : formatEngineDateTime(first(query.pickup)),
    dropoff: dropdate
      ? `${dropdate} · ${drophour}:${dropmin}`
      : formatEngineDateTime(first(query.dropoff)),
  };
}
