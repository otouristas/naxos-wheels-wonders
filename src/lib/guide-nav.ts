/** Primary Naxos Guide items for header / mobile nav (routes match guide-data slugs). */
export const GUIDE_NAV = [
  { href: "/guide", key: "guideHub" as const },
  { href: "/guide/how-to-get-to-naxos", key: "guideHowToGet" as const },
  { href: "/guide/naxos-beaches-guide", key: "guideBeaches" as const },
  { href: "/guide/naxos-villages", key: "guideVillages" as const },
  { href: "/guide/naxos-road-trip-itinerary", key: "guideRoadTrip" as const },
  { href: "/guide/driving-in-naxos", key: "guideDriving" as const },
] as const;
