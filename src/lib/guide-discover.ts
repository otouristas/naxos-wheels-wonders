import {
  discoverCycladesUrl,
  naxosFerryUrl,
  naxosGuideDcUrl,
  naxosHotelsUrl,
  tripPlannerUrl,
} from "@/lib/discover-cyclades";

export type DiscoverLink = {
  href: string;
  labelKey:
    | "dcHowToGet"
    | "dcFerries"
    | "dcThings"
    | "dcGuide"
    | "dcHotels"
    | "touristas";
};

/** Contextual Discover Cyclades deep links for each guide article. */
export function getGuideDiscoverLinks(locale: string, slug: string): DiscoverLink[] {
  const how = discoverCycladesUrl(locale, "/naxos/how-to-get-there");
  const things = discoverCycladesUrl(locale, "/naxos/things-to-do");
  const guide = naxosGuideDcUrl(locale);
  const ferries = naxosFerryUrl(locale);
  const hotels = naxosHotelsUrl(locale);
  const planner = tripPlannerUrl(locale, "Plan a Naxos stay and Cyclades hop");

  switch (slug) {
    case "how-to-get-to-naxos":
      return [
        { href: how, labelKey: "dcHowToGet" },
        { href: ferries, labelKey: "dcFerries" },
        { href: guide, labelKey: "dcGuide" },
        { href: planner, labelKey: "touristas" },
      ];
    case "naxos-beaches-guide":
    case "naxos-villages":
      return [
        { href: things, labelKey: "dcThings" },
        { href: guide, labelKey: "dcGuide" },
        { href: planner, labelKey: "touristas" },
      ];
    case "naxos-road-trip-itinerary":
      return [
        { href: things, labelKey: "dcThings" },
        { href: guide, labelKey: "dcGuide" },
        { href: hotels, labelKey: "dcHotels" },
        { href: planner, labelKey: "touristas" },
      ];
    case "driving-in-naxos":
      return [
        { href: guide, labelKey: "dcGuide" },
        { href: how, labelKey: "dcHowToGet" },
        { href: things, labelKey: "dcThings" },
        { href: planner, labelKey: "touristas" },
      ];
    default:
      return [
        { href: guide, labelKey: "dcGuide" },
        { href: how, labelKey: "dcHowToGet" },
        { href: ferries, labelKey: "dcFerries" },
        { href: things, labelKey: "dcThings" },
        { href: hotels, labelKey: "dcHotels" },
        { href: planner, labelKey: "touristas" },
      ];
  }
}
