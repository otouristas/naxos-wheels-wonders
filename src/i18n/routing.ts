import { defineRouting } from "next-intl/routing";

export const locales = ["en", "el", "it", "fr", "de", "nl"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  el: "Ελληνικά",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
  nl: "Nederlands",
};

/** Flag emoji used in the language switcher (accessible name still uses localeNames). */
export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  el: "🇬🇷",
  it: "🇮🇹",
  fr: "🇫🇷",
  de: "🇩🇪",
  nl: "🇳🇱",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
