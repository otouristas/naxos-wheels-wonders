export type PexelsCredit = {
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
  alt: string;
};

export const pexelsCredits = {
  hero: {
    photographer: "Charalampos Kiriakou",
    photographerUrl: "https://www.pexels.com/@charalampos-kiriakou-424960592",
    photoUrl: "https://www.pexels.com/photo/greek-hawai-27852623/",
    alt: "Stunning aerial view of Naxos beach with rocky cliffs and clear blue sea under sunny skies in Greece.",
  },
  beaches: {
    photographer: "Efrem  Efre",
    photographerUrl: "https://www.pexels.com/@efrem-efre-2786187",
    photoUrl:
      "https://www.pexels.com/photo/scenic-view-of-coastal-naxos-beachfront-in-greece-31369918/",
    alt: "Idyllic beach scene in Naxos, Greece with charming white buildings and blue shutters.",
  },
  portara: {
    photographer: "Dimis Choropanitis",
    photographerUrl: "https://www.pexels.com/@chdimis",
    photoUrl: "https://www.pexels.com/photo/temple-of-apollo-during-sunset-9553494/",
    alt: "The ancient Portara silhouetted against a stunning sunset in Naxos, Greece.",
  },
  villages: {
    photographer: "Zach LeBlanc",
    photographerUrl: "https://www.pexels.com/@zach-leblanc-278510173",
    photoUrl: "https://www.pexels.com/photo/white-concrete-building-on-top-of-a-mountain-13978583/",
    alt: "Picturesque white church with blue dome on a hill in Naxos, Greece, with sea and mountain views.",
  },
  roadTrip: {
    photographer: "Petra Nesti",
    photographerUrl: "https://www.pexels.com/@petra-nesti-1766376",
    photoUrl: "https://www.pexels.com/photo/scenic-view-of-greek-landscape-with-chapel-28574627/",
    alt: "Beautiful landscape of Naxos, Greece featuring a hilltop chapel and sea view.",
  },
  driving: {
    photographer: "Hector MARABELLE",
    photographerUrl: "https://www.pexels.com/@hector-marabelle-2157578915",
    photoUrl: "https://www.pexels.com/photo/aerial-view-of-coastal-road-in-syros-greece-34978734/",
    alt: "Scenic aerial view of winding coastal road and sea in Syros, Greece, showcasing natural beauty.",
  },
  bestTime: {
    photographer: "Nikolaos Sakellaris",
    photographerUrl: "https://www.pexels.com/@sakellarisnikolaos",
    photoUrl: "https://www.pexels.com/photo/ruin-on-island-5653362/",
    alt: "A scenic view of the Portara on Naxos Island during sunset, highlighting its ancient charm.",
  },
  family: {
    photographer: "Efrem  Efre",
    photographerUrl: "https://www.pexels.com/@efrem-efre-2786187",
    photoUrl:
      "https://www.pexels.com/photo/charming-beachfront-architecture-in-naxos-greece-30170141/",
    alt: "Coastal scene with traditional architecture on Naxos, Greece, by the Aegean Sea.",
  },
} as const satisfies Record<string, PexelsCredit>;

export type PexelsCreditSlot = keyof typeof pexelsCredits;
