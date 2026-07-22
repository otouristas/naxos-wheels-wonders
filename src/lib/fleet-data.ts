import carCompact from "@/assets/car-compact.jpg";
import carSuv from "@/assets/car-suv.jpg";
import carCabrio from "@/assets/car-cabrio.jpg";
import carMinivan from "@/assets/car-minivan.jpg";
import carElectric from "@/assets/car-electric.jpg";

export type Vehicle = {
  slug: string;
  name: string;
  category: "Economy" | "SUV" | "Cabrio" | "Compact" | "Family" | "Hybrid" | "Electric" | "7-Seater";
  transmission: "Manual" | "Automatic";
  seats: number;
  doors: number;
  luggage: number;
  ac: boolean;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  engineCc?: number;
  fromPerDay: number;
  image: string;
  tagline: string;
  features: string[];
};

export const fleet: Vehicle[] = [
  {
    slug: "fiat-panda-manual",
    name: "Fiat Panda",
    category: "Economy",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 1,
    ac: true,
    fuel: "Petrol",
    engineCc: 1242,
    fromPerDay: 50,
    image: carCompact,
    tagline: "Slip through Chora's alleys and park anywhere.",
    features: ["Full insurance included", "Unlimited mileage", "Airport & port delivery", "Bluetooth · USB · AC"],
  },
  {
    slug: "fiat-panda-automatic",
    name: "Fiat Panda Automatic",
    category: "Compact",
    transmission: "Automatic",
    seats: 4,
    doors: 5,
    luggage: 1,
    ac: true,
    fuel: "Petrol",
    engineCc: 1242,
    fromPerDay: 65,
    image: carCompact,
    tagline: "Automatic ease for the island's tight village lanes.",
    features: ["Automatic gearbox", "Full insurance", "Unlimited mileage", "Free delivery"],
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
    fromPerDay: 52,
    image: carElectric,
    tagline: "Silent city runs from Chora to Agios Prokopios.",
    features: ["100% electric", "Automatic", "Charging map included", "Free port delivery"],
  },
  {
    slug: "citroen-c3-manual",
    name: "Citroen C3",
    category: "Family",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    engineCc: 1200,
    fromPerDay: 54,
    image: carCompact,
    tagline: "The everyday family favourite — five doors, five seats.",
    features: ["Full insurance", "CarPlay ready", "Unlimited mileage", "Free delivery"],
  },
  {
    slug: "renault-clio-automatic",
    name: "Renault Clio Automatic",
    category: "Compact",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    engineCc: 1229,
    fromPerDay: 60,
    image: carCompact,
    tagline: "Automatic comfort with room for the whole beach kit.",
    features: ["Automatic", "CarPlay", "Reverse sensors", "Full insurance"],
  },
  {
    slug: "peugeot-2008-manual",
    name: "Peugeot 2008 SUV",
    category: "SUV",
    transmission: "Manual",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    engineCc: 1200,
    fromPerDay: 75,
    image: carSuv,
    tagline: "Elevated ride for the mountain villages of Apeiranthos and Chalki.",
    features: ["High ground clearance", "5 seats", "Large boot", "Full insurance"],
  },
  {
    slug: "citroen-c3-aircross-hybrid",
    name: "Citroen C3 Aircross Hybrid",
    category: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 3,
    ac: true,
    fuel: "Hybrid",
    engineCc: 1200,
    fromPerDay: 98,
    image: carSuv,
    tagline: "Hybrid crossover: quiet, tall, and thrifty on fuel.",
    features: ["Hybrid", "Automatic", "CarPlay", "Full insurance"],
  },
  {
    slug: "fiat-500l-open-roof",
    name: "Fiat 500L Open Roof",
    category: "Cabrio",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    engineCc: 1399,
    fromPerDay: 100,
    image: carCabrio,
    tagline: "Roll the roof back — the Aegean is right there.",
    features: ["Open-roof panorama", "Automatic", "5 seats", "Full insurance"],
  },
  {
    slug: "citroen-berlingo-7-seater",
    name: "Citroen Berlingo 7-Seater",
    category: "7-Seater",
    transmission: "Automatic",
    seats: 7,
    doors: 5,
    luggage: 4,
    ac: true,
    fuel: "Diesel",
    engineCc: 1500,
    fromPerDay: 145,
    image: carMinivan,
    tagline: "Seven seats for the whole family — and the luggage.",
    features: ["7 seats", "Automatic", "Huge boot", "Full insurance"],
  },
  {
    slug: "opel-combo-tour-7-seater",
    name: "Opel Combo Tour 7-Seater",
    category: "7-Seater",
    transmission: "Manual",
    seats: 7,
    doors: 5,
    luggage: 3,
    ac: true,
    fuel: "Diesel",
    engineCc: 1600,
    fromPerDay: 115,
    image: carMinivan,
    tagline: "Group-friendly, wallet-friendly, island-tested.",
    features: ["7 seats", "Manual", "Roomy interior", "Full insurance"],
  },
];

export function getVehicle(slug: string) {
  return fleet.find((v) => v.slug === slug);
}