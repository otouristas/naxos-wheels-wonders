"use client";

import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig, buildBookingUrl } from "@/lib/site-config";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
          href={`https://wa.me/${siteConfig.whatsappHref}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/90 text-white shadow-sm ring-1 ring-white/40 backdrop-blur-md transition hover:brightness-110"
          aria-label={t("whatsapp")}
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>

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
