"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fleet, categories, type VehicleCategory } from "@/lib/fleet-data";
import { FleetCard } from "./fleet-card";
import { cn } from "@/lib/utils";

export function FleetCatalog() {
  const t = useTranslations("fleet");
  const [active, setActive] = useState<VehicleCategory | "all">("all");

  const filtered = active === "all" ? fleet : fleet.filter((v) => v.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterButton active={active === "all"} onClick={() => setActive("all")}>
          {t("all")}
        </FilterButton>
        {categories.map((c) => (
          <FilterButton key={c} active={active === c} onClick={() => setActive(c)}>
            {t(`categories.${c}`)}
          </FilterButton>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v, i) => (
          <motion.div
            key={v.slug}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (i % 3) * 0.05 }}
          >
            <FleetCard vehicle={v} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sunny"
          : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
