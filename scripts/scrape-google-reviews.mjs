/**
 * One-off scraper for Naxos Auto Rent Google Maps reviews.
 * Harvests incrementally while scrolling (Google virtualizes the DOM).
 *
 * Usage: node scripts/scrape-google-reviews.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../.tmp");
const OUT = resolve(OUT_DIR, "google-reviews.json");
const PLACE_URL = "https://www.google.com/maps?cid=3029004096849402980&hl=en";

function parseRelativeDate(label) {
  const cleaned = (label || "").replace(/^Edited\s+/i, "").trim();
  const absolute = Date.parse(cleaned);
  if (!Number.isNaN(absolute)) return new Date(absolute).toISOString().slice(0, 10);
  const now = new Date();
  const m = cleaned.match(/(?:an?|(\d+))\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
  if (!m) return now.toISOString().slice(0, 10);
  const n = m[1] ? Number(m[1]) : 1;
  const unit = m[2].toLowerCase();
  const d = new Date(now);
  if (unit.startsWith("day")) d.setDate(d.getDate() - n);
  else if (unit.startsWith("week")) d.setDate(d.getDate() - n * 7);
  else if (unit.startsWith("month")) d.setMonth(d.getMonth() - n);
  else if (unit.startsWith("year")) d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

async function acceptConsent(page) {
  for (const t of ["Accept all", "Αποδοχή όλων", "I agree"]) {
    const b = page.locator(`button:has-text("${t}")`).first();
    if (await b.count()) {
      try {
        await b.click({ timeout: 3000 });
        await page.waitForTimeout(1500);
        return;
      } catch {
        /* ignore */
      }
    }
  }
}

async function harvest(page) {
  const mores = page.locator(
    'button[aria-label*="See more"], button[aria-label*="More"], button:has-text("More"), button:has-text("See more")',
  );
  const n = Math.min(await mores.count(), 30);
  for (let i = 0; i < n; i++) {
    try {
      await mores.nth(i).click({ timeout: 200 });
    } catch {
      /* ignore */
    }
  }
  return page.evaluate(() => {
    const out = [];
    for (const card of document.querySelectorAll("[data-review-id]")) {
      const id = card.getAttribute("data-review-id") || "";
      let author =
        card.querySelector(".d4r55")?.textContent?.trim() ||
        card.querySelector('[class*="fontHeadlineSmall"]')?.textContent?.trim() ||
        "";
      if (!author) {
        const btn = card.querySelector("button[aria-label]");
        author = (btn?.getAttribute("aria-label") || "")
          .replace(/\s+\d+\s+reviews?.*/i, "")
          .replace(/\s+Local Guide.*/i, "")
          .trim();
      }
      const aria =
        card.querySelector('span[role="img"][aria-label*="star"]')?.getAttribute("aria-label") ||
        card.querySelector('[aria-label*="star"]')?.getAttribute("aria-label") ||
        "";
      const ratingMatch = aria.match(/([0-9]+(?:\.[0-9]+)?)/);
      const rating = ratingMatch ? Number(ratingMatch[1]) : 5;
      let text =
        card.querySelector(".wiI7pd")?.textContent?.trim() ||
        card.querySelector(".MyEned")?.textContent?.trim() ||
        "";
      text = text
        .replace(/\s*(See )?more\s*$/i, "")
        .replace(/\s*Translated by Google.*/i, "")
        .replace(/\s*See original.*/i, "")
        .trim();
      const dateLabel = card.querySelector(".rsqaWe")?.textContent?.trim() || "";
      if (!author) continue;
      out.push({ id, author, rating, text, dateLabel, source: "Google" });
    }
    return out;
  });
}

function merge(map, batch) {
  for (const r of batch) {
    const key = r.id || `${r.author}|${r.dateLabel}|${(r.text || "").slice(0, 80)}`;
    const existing = map.get(key);
    if (!existing || ((!existing.text || existing.text.length < 5) && r.text)) map.set(key, r);
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    locale: "en-US",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 960 },
  });

  await page.goto("https://www.google.com/maps/search/?api=1&query=Naxos%20Auto%20Rent%20Galanado&hl=en", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(1200);
  await acceptConsent(page);
  await page.waitForTimeout(1800);
  await page.goto(PLACE_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2200);
  if (page.url().includes("consent")) {
    await acceptConsent(page);
    await page.waitForTimeout(1800);
  }

  await page.locator('button[role="tab"]').filter({ hasText: /Reviews/i }).first().click();
  await page.waitForTimeout(1800);

  const sortBtn = page.locator('button[aria-label*="Sort"], button:has-text("Sort")').first();
  if (await sortBtn.count()) {
    await sortBtn.click().catch(() => {});
    await page.waitForTimeout(500);
    const newest = page
      .locator('div[role="menuitemradio"], div[role="menuitem"]')
      .filter({ hasText: /^Newest/i })
      .first();
    if (await newest.count()) {
      await newest.click().catch(() => {});
      await page.waitForTimeout(1200);
    }
  }

  await page.evaluate(() => {
    const card = document.querySelector("[data-review-id], .jftiEf");
    let el = card?.parentElement;
    while (el && el !== document.body) {
      const st = getComputedStyle(el);
      if (
        (st.overflowY === "auto" || st.overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 40
      ) {
        el.setAttribute("data-reviews-scroll", "1");
        return;
      }
      el = el.parentElement;
    }
  });

  const byKey = new Map();
  let prevUnique = 0;
  let uniqueStable = 0;

  for (let i = 0; i < 400; i++) {
    merge(byKey, await harvest(page));
    const withText = [...byKey.values()].filter((r) => r.text).length;
    if (i % 10 === 0 || byKey.size !== prevUnique) {
      console.log(`i=${i} unique=${byKey.size} withText=${withText}`);
    }
    if (byKey.size === prevUnique) {
      uniqueStable += 1;
      if (uniqueStable >= 25) break;
    } else {
      uniqueStable = 0;
      prevUnique = byKey.size;
    }
    await page.evaluate(() => {
      const el = document.querySelector('[data-reviews-scroll="1"]');
      if (el) el.scrollBy(0, 520);
    });
    await page.waitForTimeout(750);
  }

  await browser.close();

  const withText = [...byKey.values()].filter((r) => r.text && r.text.length > 1);
  const normalized = withText
    .map((r) => ({
      author: r.author,
      date: parseRelativeDate(r.dateLabel),
      rating: r.rating,
      text: r.text,
      source: "Google",
    }))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  writeFileSync(OUT, JSON.stringify(normalized, null, 2));
  console.log(`Wrote ${normalized.length} text reviews of ${byKey.size} cards → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
