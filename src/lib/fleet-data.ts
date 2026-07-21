import carCompact from "@/assets/car-compact.jpg";
import carSuv from "@/assets/car-suv.jpg";
import carCabrio from "@/assets/car-cabrio.jpg";

export type Vehicle = {
  slug: string;
  name: string;
  category: "Economy" | "SUV" | "Cabrio" | "Compact" | "Family";
  transmission: "Manual" | "Automatic";
  seats: number;
  doors: number;
  luggage: number;
  ac: boolean;
  fuel: "Petrol" | "Diesel" | "Hybrid";
  fromPerDay: number;
  image: string;
  tagline: string;
  features: string[];
};

export const fleet: Vehicle[] = [
  {
    slug: "fiat-panda",
    name: "Fiat Panda",
    category: "Economy",
    transmission: "Manual",
    seats: 4,
    doors: 5,
    luggage: 1,
    ac: true,
    fuel: "Petrol",
    fromPerDay: 28,
    image: carCompact,
    tagline: "Slip through Chora's alleys and park anywhere.",
    features: ["Bluetooth", "USB", "Full insurance included", "Airport delivery"],
  },
  {
    slug: "toyota-yaris",
    name: "Toyota Yaris",
    category: "Compact",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 2,
    ac: true,
    fuel: "Hybrid",
    fromPerDay: 42,
    image: carCompact,
    tagline: "Sip fuel between beaches all day long.",
    features: ["Hybrid engine", "CarPlay", "Reverse camera", "Cruise control"],
  },
  {
    slug: "suzuki-jimny",
    name: "Suzuki Jimny",
    category: "SUV",
    transmission: "Manual",
    seats: 4,
    doors: 3,
    luggage: 2,
    ac: true,
    fuel: "Petrol",
    fromPerDay: 65,
    image: carSuv,
    tagline: "Reach the wild beaches at the end of the dirt road.",
    features: ["4x4", "Roof rack", "Off-road tires", "Elevated ride height"],
  },
  {
    slug: "jeep-renegade",
    name: "Jeep Renegade",
    category: "SUV",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 3,
    ac: true,
    fuel: "Diesel",
    fromPerDay: 78,
    image: carSuv,
    tagline: "Family-sized comfort with proper off-road capability.",
    features: ["4x4", "Automatic", "Large boot", "CarPlay"],
  },
  {
    slug: "fiat-500-cabrio",
    name: "Fiat 500 Cabrio",
    category: "Cabrio",
    transmission: "Manual",
    seats: 4,
    doors: 3,
    luggage: 1,
    ac: true,
    fuel: "Petrol",
    fromPerDay: 58,
    image: carCabrio,
    tagline: "Wind, sun, and the Aegean overhead.",
    features: ["Convertible roof", "Bluetooth", "Retro interior", "Full insurance"],
  },
  {
    slug: "vw-tiguan",
    name: "Volkswagen Tiguan",
    category: "Family",
    transmission: "Automatic",
    seats: 5,
    doors: 5,
    luggage: 4,
    ac: true,
    fuel: "Diesel",
    fromPerDay: 89,
    image: carSuv,
    tagline: "Long trips across the island in quiet comfort.",
    features: ["Automatic", "Panoramic roof", "CarPlay", "Large boot"],
  },
];

export function getVehicle(slug: string) {
  return fleet.find((v) => v.slug === slug);
}