"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Facebook, Star, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { pexelsCredits } from "@/lib/pexels-credits";
import {
  discoverCycladesUrl,
  naxosFerryUrl,
  naxosGuideDcUrl,
  naxosHotelsUrl,
  tripPlannerUrl,
} from "@/lib/discover-cyclades";
import { GUIDE_NAV } from "@/lib/guide-nav";

function uniquePhotographers() {
  const seen = new Set<string>();
  const list: { name: string; url: string }[] = [];
  for (const credit of Object.values(pexelsCredits)) {
    if (seen.has(credit.photographerUrl)) continue;
    seen.add(credit.photographerUrl);
    list.push({ name: credit.photographer, url: credit.photographerUrl });
  }
  return list;
}

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const ti = useTranslations("indicators");
  const locale = useLocale();
  const photographers = uniquePhotographers();
  const year = new Date().getFullYear();

  const exploreLinks = [
    { href: "/fleet", key: "fleet" as const },
    { href: "/blog", key: "blog" as const },
    { href: "/reviews", key: "reviews" as const },
  ];

  const companyLinks = [
    { href: "/about", key: "about" as const },
    { href: "/faq", key: "faq" as const },
    { href: "/contact", key: "contact" as const },
  ];

  const dcHow = discoverCycladesUrl(locale, "/naxos/how-to-get-there");
  const dcThings = discoverCycladesUrl(locale, "/naxos/things-to-do");

  return (
    <footer className="mt-20 bg-primary pb-[5.5rem] text-primary-foreground md:pb-0">
      <div className="container-editorial grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="inline-flex rounded-2xl bg-white p-3 shadow-sunny">
            <Image
              src="/brand/logo.png"
              alt={siteConfig.name}
              width={140}
              height={56}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
            {t("tagline")}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {ti("rating", { count: siteConfig.reviewCount })}
          </div>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </div>

        {/* Explore + Company */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {t("explore")}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  {tn(l.key)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {t("company")}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  {tn(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Naxos Guide */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{t("guide")}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {GUIDE_NAV.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-primary-foreground/80 transition-colors hover:text-accent"
                >
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Discover Cyclades */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {t("discover")}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={dcHow}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
              >
                {t("dcHowToGet")}
              </a>
            </li>
            <li>
              <a
                href={naxosFerryUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
              >
                {t("dcFerries")}
              </a>
            </li>
            <li>
              <a
                href={dcThings}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
              >
                {t("dcThings")}
              </a>
            </li>
            <li>
              <a
                href={naxosGuideDcUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
              >
                {t("dcGuide")}
              </a>
            </li>
            <li>
              <a
                href={naxosHotelsUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 transition-colors hover:text-accent"
              >
                {t("dcHotels")}
              </a>
            </li>
            <li>
              <a
                href={tripPlannerUrl(locale, "Plan a Naxos stay and nearby Cyclades hop")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent transition hover:brightness-110"
              >
                {t("touristas")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + perks */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {t("contact")}
          </p>
          <ul className="mt-4 space-y-4 text-sm text-primary-foreground/85">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-accent" />
              <a href={`tel:${siteConfig.phonePrimaryHref}`} className="hover:text-accent">
                {siteConfig.phonePrimary}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-accent" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" />
              {siteConfig.office}
            </li>
          </ul>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {t("perks.title")}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            {[t("perks.mileage"), t("perks.airport"), t("perks.port")].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-accent" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-editorial flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">
          <p className="text-center text-sm text-primary-foreground/50 sm:text-left">
            © {year} {siteConfig.name}. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-primary-foreground/50 sm:justify-end">
            <a
              href="https://anotherseoguru.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground"
            >
              {t("designedBy")}{" "}
              <Image
                src="/images/brand/credits/anotherseoguru.svg"
                alt="AnotherSEOGuru"
                width={106}
                height={24}
                className="ml-1 inline-block h-6 w-auto align-middle"
                unoptimized
              />
            </a>
            <a
              href="https://touristas.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground"
            >
              {t("poweredBy")}{" "}
              <Image
                src="/images/brand/credits/touristas-ai-white.png"
                alt="Touristas AI"
                width={123}
                height={19}
                className="ml-1 inline-block h-[19px] w-auto align-middle"
                unoptimized
              />
            </a>
            <a
              href={discoverCycladesUrl(locale, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:opacity-90"
            >
              <Image
                src="/images/brand/credits/discover-cyclades.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full bg-white"
              />
              <span className="leading-tight">
                <span className="block text-xs font-bold text-primary-foreground">
                  Discover Cyclades
                </span>
                <span className="block text-[9px] font-medium uppercase tracking-wider text-primary-foreground/40">
                  {t("dcPartner")}
                </span>
              </span>
            </a>
          </div>
        </div>
        <div className="container-editorial flex flex-col gap-3 border-t border-white/10 pb-5 pt-4 text-xs text-primary-foreground/50 md:flex-row md:items-center md:justify-between">
          <p>{t("registration", { mhte: siteConfig.mhte, gemi: siteConfig.gemi })}</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-accent">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="hover:text-accent">
              {t("privacy")}
            </Link>
          </div>
        </div>
        <div className="container-editorial border-t border-white/10 pb-5 pt-4 text-xs leading-relaxed text-primary-foreground/50">
          <p>
            Photos provided by{" "}
            <a
              href="https://www.pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-2 hover:text-accent"
            >
              Pexels
            </a>
            . Photographers:{" "}
            {photographers.map((p, i) => (
              <span key={p.url}>
                {i > 0 && ", "}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/30 underline-offset-2 hover:text-accent"
                >
                  {p.name}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
