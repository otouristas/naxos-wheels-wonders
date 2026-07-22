import { fleet, type Vehicle } from "./fleet-data";

export type QuizAnswers = {
  group?: "solo" | "family" | "group";
  budget?: "low" | "mid" | "high";
  vibe?: "city" | "explore" | "family" | "eco";
  transmission?: "any" | "manual" | "automatic";
  notes?: string;
};

export type Recommendation = {
  vehicle: Vehicle;
  score: number;
  reason: string;
};

const cheapest = Math.min(...fleet.map((v) => v.fromPerDay));
const priciest = Math.max(...fleet.map((v) => v.fromPerDay));

export function recommendFleet(answers: QuizAnswers, limit = 3): Recommendation[] {
  const scored = fleet.map((v) => {
    let score = 0;

    // Group size
    if (answers.group === "solo") {
      if (["Small", "Electric", "Medium"].includes(v.category)) score += 3;
      if (v.seats <= 5) score += 1;
    } else if (answers.group === "family") {
      if (["Medium", "Family", "SUV", "Hybrid"].includes(v.category)) score += 3;
      if (v.seats >= 5) score += 1;
    } else if (answers.group === "group") {
      if (v.category === "7-Seater") score += 5;
      if (v.seats >= 7) score += 3;
    }

    // Budget
    const priceNorm = (v.fromPerDay - cheapest) / (priciest - cheapest || 1);
    if (answers.budget === "low") score += (1 - priceNorm) * 4;
    else if (answers.budget === "high") score += priceNorm * 3;
    else score += (1 - Math.abs(priceNorm - 0.5)) * 2;

    // Vibe
    if (answers.vibe === "city" && ["Small", "Electric", "Medium"].includes(v.category)) score += 3;
    if (answers.vibe === "explore" && ["SUV", "Hybrid"].includes(v.category)) score += 3;
    if (answers.vibe === "family" && ["Family", "7-Seater", "SUV"].includes(v.category)) score += 3;
    if (answers.vibe === "eco" && ["Electric", "Hybrid"].includes(v.category)) score += 4;

    // Transmission
    if (answers.transmission && answers.transmission !== "any") {
      if (v.transmission.toLowerCase() === answers.transmission) score += 2;
      else score -= 3;
    }

    // Free-text keyword nudges
    const notes = (answers.notes || "").toLowerCase();
    if (notes) {
      if (/(electric|eco|green|silent)/.test(notes) && v.fuel === "Electric") score += 3;
      if (/(hybrid)/.test(notes) && v.fuel === "Hybrid") score += 3;
      if (/(cheap|budget|low|save|affordable)/.test(notes)) score += (1 - priceNorm) * 3;
      if (
        /(family|kids|children)/.test(notes) &&
        ["Family", "SUV", "7-Seater"].includes(v.category)
      )
        score += 2;
      if (/(7|seven|group|friends|large)/.test(notes) && v.seats >= 7) score += 3;
      if (/(automatic)/.test(notes) && v.transmission === "Automatic") score += 2;
      if (
        /(mountain|village|off.?road|suv|apeiranthos|chalki)/.test(notes) &&
        ["SUV", "Hybrid"].includes(v.category)
      )
        score += 2;
    }

    return { vehicle: v, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ vehicle, score }) => ({
      vehicle,
      score,
      reason: `${vehicle.idealFor} From €${vehicle.fromPerDay}/day, with insurance, unlimited mileage and free delivery included.`,
    }));
}

export function fleetSummaryForPrompt(): string {
  return fleet
    .map(
      (v) =>
        `- ${v.name} (${v.category}, ${v.transmission}, ${v.seats} seats, ${v.fuel}): €${v.fromPerDay}/day. ${v.idealFor} slug=${v.slug}`,
    )
    .join("\n");
}
