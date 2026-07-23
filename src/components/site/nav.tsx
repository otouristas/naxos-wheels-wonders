"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Star,
  Check,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { siteConfig, buildBookingUrl } from "@/lib/site-config";
import { GUIDE_NAV } from "@/lib/guide-nav";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/fleet", key: "fleet" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/reviews", key: "reviews" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteNav() {
  const t = useTranslations("nav");
  const tc = useTranslations("cta");
  const ti = useTranslations("indicators");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);
  const guideActive = pathname === "/guide" || pathname.startsWith("/guide/");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setGuideOpen(false);
    setMobileGuideOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!guideOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!guideRef.current?.contains(e.target as Node)) setGuideOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGuideOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [guideOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden border-b border-primary/10 bg-primary text-primary-foreground md:block">
        <div className="container-editorial flex h-9 items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${siteConfig.phonePrimaryHref}`}
              className="inline-flex items-center gap-1.5 hover:text-accent"
            >
              <Phone className="h-3.5 w-3.5" />
              {siteConfig.phonePrimary}
            </a>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {ti("rating", { count: siteConfig.reviewCount })}
            </span>
          </div>
          <span className="hidden items-center gap-1.5 lg:inline-flex">
            <Check className="h-3.5 w-3.5 text-accent" />
            {ti("airport")} · {ti("port")}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-border/80 bg-white/95 backdrop-blur-md">
        <div className="container-editorial flex h-[4.25rem] items-center justify-between gap-4">
          <Link
            href="/"
            className="relative flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/logo.png"
              alt={siteConfig.name}
              width={160}
              height={64}
              priority
              className="h-11 w-auto object-contain md:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/fleet"
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                pathname === "/fleet" || pathname.startsWith("/fleet/")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/75 hover:bg-secondary hover:text-primary",
              )}
            >
              {t("fleet")}
            </Link>

            <div className="relative" ref={guideRef}>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  guideActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/75 hover:bg-secondary hover:text-primary",
                )}
                aria-expanded={guideOpen}
                aria-haspopup="menu"
                onClick={() => setGuideOpen((v) => !v)}
              >
                {t("guide")}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition", guideOpen && "rotate-180")}
                />
              </button>
              {guideOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-white py-2 shadow-sunny-lg"
                >
                  {GUIDE_NAV.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/guide" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={cn(
                          "block px-4 py-2.5 text-sm text-foreground/80 transition hover:bg-secondary hover:text-primary",
                          active && "bg-primary/10 font-semibold text-primary",
                        )}
                        onClick={() => setGuideOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {navLinks.slice(1).map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/75 hover:bg-secondary hover:text-primary",
                  )}
                >
                  {t(l.key)}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher />
            <Link href={buildBookingUrl()} className="btn-primary">
              {t("book")}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LocaleSwitcher />
            <button
              aria-label={open ? t("closeMenu") : t("openMenu")}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary"
              type="button"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[4.25rem] z-50 flex h-[calc(100dvh-4.25rem)] flex-col overflow-y-auto bg-white lg:hidden"
          >
            <div className="flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {ti("rating", { count: siteConfig.reviewCount })}
            </div>

            <nav className="flex flex-col px-4 py-2">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <Link
                  href="/fleet"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-border/70 py-4 font-heading text-2xl font-bold text-foreground"
                >
                  {t("fleet")}
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className="border-b border-border/70"
              >
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between py-4 font-heading text-2xl font-bold text-foreground",
                    guideActive && "text-primary",
                  )}
                  aria-expanded={mobileGuideOpen}
                  onClick={() => setMobileGuideOpen((v) => !v)}
                >
                  {t("guide")}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-primary transition",
                      mobileGuideOpen && "rotate-180",
                    )}
                  />
                </button>
                {mobileGuideOpen ? (
                  <div className="flex flex-col gap-1 pb-4 pl-1">
                    {GUIDE_NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "py-2 text-lg text-foreground/70",
                          pathname === item.href && "font-semibold text-primary",
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </motion.div>

              {navLinks.slice(1).map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + 0.04 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-border/70 py-4 font-heading text-2xl font-bold text-foreground"
                  >
                    {t(l.key)}
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-4 px-5 pb-8 pt-4">
              <ul className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-4 text-xs font-medium text-foreground/80">
                {[ti("airport"), ti("port"), ti("cancellation"), ti("mileage")].map((x) => (
                  <li key={x} className="flex items-start gap-1.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {x}
                  </li>
                ))}
              </ul>

              <Link
                href={buildBookingUrl()}
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                {tc("bookOnline")}
              </Link>
              <a
                href={`tel:${siteConfig.phonePrimaryHref}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-4 py-3 text-sm font-bold text-primary"
              >
                <Phone className="h-4 w-4" />
                {tc("call")}
              </a>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent("touristas:open"));
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-accent bg-accent/15 px-4 py-3 text-sm font-bold text-accent-foreground"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {tc("askAi")}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
