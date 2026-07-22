import { locales, routing } from "@/i18n/routing";
import { siteConfig } from "./site-config";

export function localizedHref(locale: string, path: string): string {
  const normalized = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return normalized;
  }
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function absoluteUrl(locale: string, path: string): string {
  return `${siteConfig.domain}${localizedHref(locale, path)}`;
}

export function buildAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = absoluteUrl(l, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}
