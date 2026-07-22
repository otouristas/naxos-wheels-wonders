/** Discover Cyclades partner URL helpers (Naxos deep links). */

export function discoverCycladesUrl(locale: string, path = "") {
  const loc = locale === "el" ? "el" : "en";
  if (!path || path === "/") return `https://discovercyclades.gr/${loc}`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `https://discovercyclades.gr/${loc}${clean}`;
}

export function naxosFerryUrl(locale: string) {
  return discoverCycladesUrl(locale, "/ferry-routes/direct/athens-piraeus-to-naxos");
}

export function naxosHotelsUrl(locale: string) {
  return discoverCycladesUrl(locale, "/hotels/naxos");
}

export function naxosGuideDcUrl(locale: string) {
  return discoverCycladesUrl(locale, "/naxos");
}

export function tripPlannerUrl(locale: string, prompt?: string) {
  const loc = locale === "el" ? "el" : "en";
  const url = new URL(`https://discovercyclades.gr/${loc}/touristas-ai/chat`);
  url.searchParams.set("island", "naxos");
  if (prompt) url.searchParams.set("prompt", prompt);
  return url.toString();
}

export function whatsappUrl(text?: string) {
  const digits = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "306930993670";
  const url = new URL(`https://wa.me/${digits}`);
  if (text) url.searchParams.set("text", text);
  return url.toString();
}
