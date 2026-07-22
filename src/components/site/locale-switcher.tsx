"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ variant = "bar" }: { variant?: "bar" | "grid" }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  function change(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      // @ts-expect-error -- params carry route segments for dynamic paths
      router.replace({ pathname, params }, { locale: next });
    });
  }

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => change(l)}
            disabled={isPending}
            title={localeNames[l]}
            aria-label={localeNames[l]}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-3 text-xl transition-colors",
              l === locale
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-border bg-white hover:border-primary/40",
            )}
          >
            <span aria-hidden>{localeFlags[l]}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {l}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={localeNames[locale]}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white py-1.5 pl-2.5 pr-2 text-sm font-semibold shadow-sm transition-colors hover:border-primary/40"
      >
        <span className="text-base leading-none" aria-hidden>
          {localeFlags[locale]}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {locale}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 z-50 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-border bg-white py-1 shadow-sunny-lg"
        >
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => change(l)}
                disabled={isPending}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                  l === locale
                    ? "bg-primary/10 font-bold text-primary"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {localeFlags[l]}
                </span>
                <span>{localeNames[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
