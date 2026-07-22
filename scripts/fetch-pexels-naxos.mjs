#!/usr/bin/env node
/**
 * One-shot: search Pexels for Naxos-themed photos, download into public/naxos/,
 * and write src/lib/pexels-credits.ts. Requires PEXELS_API_KEY in .env.local.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SLOTS = [
  { id: "hero", query: "Naxos Greece coastline beach", file: "hero.jpg" },
  { id: "beaches", query: "Naxos beach Greece turquoise", file: "beaches.jpg" },
  { id: "portara", query: "Portara Naxos Temple Apollo", file: "portara.jpg" },
  { id: "villages", query: "Naxos village Greece mountains", file: "villages.jpg" },
  { id: "roadTrip", query: "Naxos Greece scenic landscape hills", file: "road-trip.jpg" },
  { id: "driving", query: "Greek island road Cyclades driving", file: "driving.jpg" },
  { id: "bestTime", query: "Naxos Greece summer landscape sea", file: "best-time.jpg" },
  { id: "family", query: "Naxos Greece sandy beach family coast", file: "family.jpg" },
];

async function loadEnv() {
  try {
    const raw = await readFile(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // optional
  }
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

function creditsTs(credits) {
  const entries = Object.entries(credits)
    .map(
      ([key, c]) => `  ${key}: {
    photographer: ${JSON.stringify(c.photographer)},
    photographerUrl: ${JSON.stringify(c.photographerUrl)},
    photoUrl: ${JSON.stringify(c.photoUrl)},
    alt: ${JSON.stringify(c.alt)},
  }`,
    )
    .join(",\n");

  return `export type PexelsCredit = {
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
  alt: string;
};

export const pexelsCredits = {
${entries},
} as const satisfies Record<string, PexelsCredit>;

export type PexelsCreditSlot = keyof typeof pexelsCredits;
`;
}

async function main() {
  await loadEnv();
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error("Missing PEXELS_API_KEY (set in .env.local)");
    process.exit(1);
  }

  const outDir = join(root, "public", "naxos");
  await mkdir(outDir, { recursive: true });

  const credits = {};
  const usedIds = new Set();

  for (const slot of SLOTS) {
    console.log(`Searching: ${slot.query}`);
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", slot.query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("per_page", "8");

    const res = await fetch(url, { headers: { Authorization: apiKey } });
    if (!res.ok) {
      throw new Error(`Pexels search failed (${res.status}): ${await res.text()}`);
    }
    const data = await res.json();
    const photo = (data.photos || []).find((p) => !usedIds.has(p.id)) || data.photos?.[0];
    if (!photo) throw new Error(`No photos for ${slot.id}`);

    usedIds.add(photo.id);
    const imageUrl = photo.src.large2x || photo.src.original || photo.src.large;
    const dest = join(outDir, slot.file);
    console.log(`  → #${photo.id} by ${photo.photographer} → ${slot.file}`);
    await download(imageUrl, dest);

    credits[slot.id] = {
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      photoUrl: photo.url,
      alt: photo.alt || `Naxos, Greece: ${slot.id}`,
    };

    // Be kind to rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  const creditsPath = join(root, "src", "lib", "pexels-credits.ts");
  await writeFile(creditsPath, creditsTs(credits));
  console.log(`Wrote ${creditsPath}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
