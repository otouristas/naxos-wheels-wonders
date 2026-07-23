"use client";

import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig, buildBookingUrl } from "@/lib/site-config";

function TouristasSparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-4 w-4"} aria-hidden>
      <path
        d="M12 3l1.2 4.2L17.5 8.5 13.2 9.8 12 14l-1.2-4.2L6.5 8.5l4.3-1.3L12 3zM18.5 13l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3zM6 14.5l.6 1.8 1.8.6-1.8.6L6 19.3l-.6-1.8-1.8-.6 1.8-.6L6 14.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MobileBookBar() {
  const t = useTranslations("cta");
  const tn = useTranslations("nav");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="glass-dock pointer-events-auto mx-auto flex max-w-lg items-center gap-2 p-2 pl-2.5">
        <Link
          href={buildBookingUrl()}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-accent px-4 text-sm font-bold text-accent-foreground shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition hover:brightness-105"
        >
          {t("bookNow")}
        </Link>

        <a
          href={`tel:${siteConfig.phonePrimaryHref}`}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white/45 px-3 text-xs font-semibold text-primary ring-1 ring-white/50 backdrop-blur-md transition hover:bg-white/65"
          aria-label={t("call")}
        >
          <Phone className="h-3.5 w-3.5" />
          {t("call")}
        </a>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("touristas:open"))}
          className="touristas-glass-btn inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold text-primary"
          aria-label={tn("askTouristas")}
        >
          <TouristasSparklesIcon className="h-4 w-4 text-accent" />
          <span>AI</span>
        </button>
      </div>
    </div>
  );
}
