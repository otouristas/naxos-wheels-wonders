"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { GoogleG } from "@/components/site/google-g";
import type { ReviewWithLang } from "@/lib/reviews-data";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-[#4285F4]",
  "bg-[#EA4335]",
  "bg-[#FBBC05] text-foreground",
  "bg-[#34A853]",
  "bg-primary",
  "bg-sea",
  "bg-accent text-accent-foreground",
] as const;

function hashName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function formatReviewDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

type ReviewCardProps = {
  review: ReviewWithLang;
  locale: string;
  /** When false, long quotes stay clamped with no toggle (home teasers). */
  expandable?: boolean;
  className?: string;
};

export const ReviewCard = memo(function ReviewCard({
  review,
  locale,
  expandable = true,
  className,
}: ReviewCardProps) {
  const t = useTranslations("reviews");
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 280;
  const color = AVATAR_COLORS[hashName(review.author) % AVATAR_COLORS.length];
  const showToggle = expandable && long;

  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl border border-border bg-white p-5 shadow-sunny",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
              color,
            )}
            aria-hidden
          >
            {initials(review.author)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{review.author}</p>
            <time className="text-[11px] text-muted-foreground" dateTime={review.date}>
              {formatReviewDate(review.date, locale)}
            </time>
          </div>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-1"
          title={t("verified")}
        >
          <GoogleG className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Google
          </span>
        </span>
      </div>

      <div className="mt-3 flex" aria-label={`${review.rating} stars`}>
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-[#FBBC04] text-[#FBBC04]" />
        ))}
      </div>

      <blockquote
        className={cn(
          "mt-3 flex-1 text-sm leading-relaxed text-foreground",
          !expanded && "line-clamp-6",
        )}
      >
        “{review.text}”
      </blockquote>

      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 self-start text-xs font-bold text-primary hover:underline"
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      ) : null}
    </article>
  );
});
