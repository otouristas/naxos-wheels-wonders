"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ReviewCard } from "@/components/site/review-card";
import type { ReviewWithLang } from "@/lib/reviews-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

type Order = "newest" | "oldest";

type ReviewsListProps = {
  reviews: ReviewWithLang[];
  locale: string;
};

export function ReviewsList({ reviews, locale }: ReviewsListProps) {
  const t = useTranslations("reviews");
  const [order, setOrder] = useState<Order>("newest");
  const [lang, setLang] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "language" });
    } catch {
      return null;
    }
  }, [locale]);

  const languages = useMemo(() => {
    const set = new Set(reviews.map((r) => r.lang));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [reviews]);

  const filtered = useMemo(() => {
    const base = lang === "all" ? reviews : reviews.filter((r) => r.lang === lang);
    if (order === "oldest") return [...base].reverse();
    return base;
  }, [reviews, lang, order]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [order, lang]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const langLabel = (code: string) => {
    if (code === "all") return t("allLanguages");
    return displayNames?.of(code) ?? code.toUpperCase();
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-white/80 p-4 shadow-sunny backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("sortLabel")}
          </span>
          <div className="inline-flex rounded-full border border-border bg-muted/40 p-0.5">
            {(["newest", "oldest"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setOrder(value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                  order === value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value === "newest" ? t("sortNewest") : t("sortOldest")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("filterLanguage")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {["all", ...languages].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-bold transition-colors",
                  lang === code
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {langLabel(code)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs font-semibold text-muted-foreground sm:ml-auto">
          {t("showingOf", { shown: shown.length, total: filtered.length })}
        </p>
      </div>

      <div className="mt-6 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => (
          <ReviewCard
            key={`${r.author}-${r.date}-${r.text.slice(0, 24)}`}
            review={r}
            locale={locale}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-blue">
            {t("loadMore")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
