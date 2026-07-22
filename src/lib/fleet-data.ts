export type VehicleCategory =
  | "Small"
  | "Medium"
  | "Family"
  | "SUV"
  | "Hybrid"
  | "Electric"
  | "7-Seater";

export type Vehicle = {
  slug: string;
  name: string;
  category: VehicleCategory;
  transmission: "Manual" | "Automatic";
  seats: number;
  doors: number;
  luggage: number;
  ac: boolean;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  engineCc?: number;
  /** Derived from the live 6-day total. */
  fromPerDay: number;
  /** Live 6-day total (EUR) from the booking engine. */
  sixDayTotal: number;
  image: string;
  gallery: string[];
  tagline: string;
  /** Short "vibe" chips shown on cards + detail. */
  vibes: string[];
  /** One-line "ideal for" positioning. */
  idealFor: string;
  seoDescription: string;
  /** Everything included in the rate. */
  included: string[];
  similarSlugs: string[];
};

const includedBase = [
  "All taxes & VAT",
  "Free additional driver",
  "Free airport & port delivery",
  "Third-Party Insurance (TPI)",
  "Unlimited mileage",
  "24/7 road assistance",
  "Theft protection",
];

export const fleet: Vehicle[] = [
  {
    slug: "peugeot-108",
    name: "Peugeot 108",
    category: "Small",
    transmission: "Manual",
    seats: 4,
    doors: 5,
    luggage: 1,
    ac: true,
    fuel: "Petrol",
    engineCc: 998,
    fromPerDay: 30,
    sixDayTotal: 180,
    image: "/fleet/peugeot-108.jpg",
    gallery: ["/fleet/peugeot-108.jpg"],
    tagline: "The compact that parks anywhere in Chora.",
    vibes: ["City-nimble", "Cheapest to run", "Two-up getaways"],
    idealFor: "Ideal for couples and duos who want the lowest daily rate and stress-free parking.",
    seoDescription:
      "Looking for a small car rental in Naxos? The Peugeot 108 is a compact, fuel-efficient choice, perfect for couples and friends who want easy driving and simple parking in narrow island streets. Book with Naxos Auto Rent and enjoy free airport or port delivery.",
    included: includedBase,
    similarSlugs: ["fiat-panda", "dacia-spring-electric"],
  },
  {
    slug: "fiat-panda",
    name: "Fiat Panda",
    category: "Medium",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 1,
    ac: true,
    fuel: "Petrol",
    engineCc: 1242,
    fromPerDay: 35,
    sixDayTotal: 210,
    image: "/fleet/fiat-panda.png",
    gallery: ["/fleet/fiat-panda.png"],
    tagline: "The legendary island runabout that slips through every alley.",
    vibes: ["Island classic", "Great value", "Beach-hopper"],
    idealFor:
      "Ideal for small families and groups of friends who want a practical, easy-to-drive favourite.",
    seoDescription:
      "The legendary Fiat Panda is a practical, easy-to-drive car rental in Naxos, ideal for couples, small families and groups of friends. Compact yet comfortable, it handles narrow streets and scenic island roads with confidence.",
    included: includedBase,
    similarSlugs: ["peugeot-108", "citroen-c3"],
  },
  {
    slug: "citroen-c3",
    name: "Citroen C3",
    category: "Family",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    engineCc: 1200,
    fromPerDay: 38,
    sixDayTotal: 228,
    image: "/fleet/citroen-c3.jpg",
    gallery: ["/fleet/citroen-c3.jpg"],
    tagline: "Stylish, comfortable and endlessly practical.",
    vibes: ["Stylish", "Comfy ride", "Easy parking"],
    idealFor: "Ideal for couples and small families who want a little more comfort and style.",
    seoDescription:
      "The Citroen C3 is a stylish, fuel-efficient compact car hire in Naxos, perfect for couples, small families and friends. Its compact size makes it ideal for narrow streets and easy parking in busy villages.",
    included: includedBase,
    similarSlugs: ["fiat-panda", "renault-clio-automatic"],
  },
  {
    slug: "dacia-spring-electric",
    name: "Dacia Spring Electric",
    category: "Electric",
    transmission: "Automatic",
    seats: 4,
    doors: 5,
    luggage: 1,
    ac: true,
    fuel: "Electric",
    fromPerDay: 33,
    sixDayTotal: 198,
    image: "/fleet/dacia-spring-electric.png",
    gallery: ["/fleet/dacia-spring-electric.png", "/fleet/dacia-spring-interior.png"],
    tagline: "Silent, zero-emission runs from Chora to the beaches.",
    vibes: ["100% electric", "Automatic", "Eco & quiet"],
    idealFor:
      "Ideal for eco-conscious couples and small families exploring town and the west-coast beaches.",
    seoDescription:
      "The Dacia Spring Electric Automatic offers smooth, quiet, eco-friendly driving, a perfect electric car rental in Naxos for couples and small families. Automatic transmission with easy airport or port pick-up.",
    included: includedBase,
    similarSlugs: ["peugeot-108", "renault-clio-automatic"],
  },
  {
    slug: "renault-clio-automatic",
    name: "Renault Clio Automatic",
    category: "Medium",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    engineCc: 1229,
    fromPerDay: 67,
    sixDayTotal: 402,
    image: "/fleet/renault-clio-automatic.jpg",
    gallery: ["/fleet/renault-clio-automatic.jpg", "/fleet/renault-clio-interior.jpg"],
    tagline: "Automatic comfort with room for the whole beach kit.",
    vibes: ["Automatic", "Comfortable", "Family-ready"],
    idealFor: "Ideal for travellers who want relaxed automatic driving and a little extra space.",
    seoDescription:
      "The Renault Clio Automatic is a comfortable, fuel-efficient automatic car rental in Naxos, perfect for couples, families and friends who want easy driving and simple parking around the island.",
    included: includedBase,
    similarSlugs: ["citroen-c3", "peugeot-2008-suv"],
  },
  {
    slug: "peugeot-2008-suv",
    name: "Peugeot 2008 SUV",
    category: "SUV",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    engineCc: 1200,
    fromPerDay: 65,
    sixDayTotal: 390,
    image: "/fleet/peugeot-2008-suv.png",
    gallery: ["/fleet/peugeot-2008-suv.png", "/fleet/peugeot-2008-suv-interior.jpg"],
    tagline: "Elevated ride for mountain villages and hidden coves.",
    vibes: ["High driving position", "Big boot", "Adventure-ready"],
    idealFor:
      "Ideal for families and explorers heading to Apeiranthos, Chalki and the mountain roads.",
    seoDescription:
      "The Peugeot 2008 Manual is a modern, spacious SUV rental in Naxos, ideal for families and travellers who want comfort and reliability. Its elevated driving position and large luggage space are perfect for town, mountain villages and beaches.",
    included: includedBase,
    similarSlugs: ["citroen-c3-aircross-hybrid", "dacia-lodgy"],
  },
  {
    slug: "citroen-c3-aircross-hybrid",
    name: "Citroen C3 Aircross Hybrid Automatic",
    category: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 3,
    ac: true,
    fuel: "Hybrid",
    engineCc: 1200,
    fromPerDay: 89,
    sixDayTotal: 534,
    image: "/fleet/citroen-c3-aircross-hybrid.png",
    gallery: ["/fleet/citroen-c3-aircross-hybrid.png"],
    tagline: "Tall, quiet hybrid crossover that is thrifty on every road.",
    vibes: ["Hybrid efficiency", "Automatic", "Roomy crossover"],
    idealFor: "Ideal for families and groups wanting modern hybrid comfort and low fuel bills.",
    seoDescription:
      "The Citroen C3 Aircross Hybrid Automatic is a modern, comfortable crossover hybrid car rental in Naxos, perfect for couples, families or friends who want smooth, efficient driving and a spacious interior.",
    included: includedBase,
    similarSlugs: ["citroen-c4-hybrid", "peugeot-2008-suv"],
  },
  {
    slug: "citroen-c4-hybrid",
    name: "Citroen C4 Hybrid Automatic",
    category: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 3,
    ac: true,
    fuel: "Hybrid",
    engineCc: 1200,
    fromPerDay: 89,
    sixDayTotal: 534,
    image: "/fleet/citroen-c4-hybrid.png",
    gallery: ["/fleet/citroen-c4-hybrid.png", "/fleet/citroen-c4-hybrid-interior.jpg"],
    tagline: "The flagship hybrid crossover: smooth, modern, refined.",
    vibes: ["Premium hybrid", "Automatic", "Most comfortable"],
    idealFor: "Ideal for travellers who want the most comfortable, refined ride in the fleet.",
    seoDescription:
      "The Citroen C4 Hybrid Automatic is a modern, comfortable crossover with advanced hybrid technology, a relaxing, fuel-efficient car rental in Naxos for couples, families and groups exploring the island.",
    included: includedBase,
    similarSlugs: ["citroen-c3-aircross-hybrid", "peugeot-2008-suv"],
  },
  {
    slug: "dacia-lodgy",
    name: "Dacia Lodgy",
    category: "Family",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 3,
    ac: true,
    fuel: "Diesel",
    engineCc: 1500,
    fromPerDay: 40,
    sixDayTotal: 240,
    image: "/fleet/dacia-lodgy.png",
    gallery: ["/fleet/dacia-lodgy.png"],
    tagline: "Spacious, thrifty diesel for families and luggage.",
    vibes: ["Roomy", "Diesel-thrifty", "Luggage-friendly"],
    idealFor: "Ideal for families and groups needing extra passenger and luggage space.",
    seoDescription:
      "The Dacia Lodgy Manual is a practical, comfortable family car rental in Naxos with a roomy interior and flexible seating, perfect for airport transfers, long island drives and beach days.",
    included: includedBase,
    similarSlugs: ["fiat-tipo-station-wagon", "opel-combo-tour"],
  },
  {
    slug: "fiat-tipo-station-wagon",
    name: "Fiat Tipo Station Wagon",
    category: "Family",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 3,
    ac: true,
    fuel: "Petrol",
    engineCc: 1400,
    fromPerDay: 40,
    sixDayTotal: 240,
    image: "/fleet/fiat-tipo-sw.png",
    gallery: ["/fleet/fiat-tipo-sw.png"],
    tagline: "Big boot, big comfort: the estate that swallows suitcases.",
    vibes: ["Huge boot", "Long-drive comfort", "Great value"],
    idealFor: "Ideal for families and groups who want maximum luggage space for a low daily rate.",
    seoDescription:
      "The Fiat Tipo Station Wagon is a practical, comfortable car hire in Naxos with a large boot and roomy interior, ideal for families and groups needing space for luggage and relaxed island driving.",
    included: includedBase,
    similarSlugs: ["dacia-lodgy", "opel-combo-tour"],
  },
  {
    slug: "opel-combo-tour",
    name: "Opel Combo Tour 7-Seater",
    category: "7-Seater",
    transmission: "Manual",
    seats: 7,
    doors: 5,
    luggage: 4,
    ac: true,
    fuel: "Diesel",
    engineCc: 1600,
    fromPerDay: 65,
    sixDayTotal: 390,
    image: "/fleet/opel-combo.jpg",
    gallery: ["/fleet/opel-combo.jpg"],
    tagline: "Seven seats for the whole crew, and all the bags.",
    vibes: ["7 seats", "Group-friendly", "Diesel-economical"],
    idealFor: "Ideal for large families and groups of friends travelling together.",
    seoDescription:
      "The Opel Combo Tour is a spacious 7-seater car rental in Naxos, perfect for families and groups of friends. Seating for up to 7 passengers with comfortable island driving and free airport or port pick-up.",
    included: includedBase,
    similarSlugs: ["dacia-lodgy", "fiat-tipo-station-wagon"],
  },
];

export function getVehicle(slug: string) {
  return fleet.find((v) => v.slug === slug);
}

export const categories: VehicleCategory[] = [
  "Small",
  "Medium",
  "Family",
  "SUV",
  "Hybrid",
  "Electric",
  "7-Seater",
];
