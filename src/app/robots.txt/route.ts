import { buildRobotsTxt, ROBOTS_HEADERS } from "@/lib/seo-parity/robots-parity";

export const dynamic = "force-static";

/** Same group structure as discovercyclades.gr/robots.txt; see robots-parity.ts. */
export function GET() {
  const body = buildRobotsTxt({
    name: "Naxos Car Rental",
    origin: "https://naxos-car-rental.com",
    disallow: ["/api/"],
    sitemaps: ["https://naxos-car-rental.com/sitemap.xml"],
  });
  return new Response(body, { headers: ROBOTS_HEADERS });
}
