"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, Phone, Plane, Ship, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { pexelsCredits } from "@/lib/pexels-credits";
import { BookingWidget } from "./booking-widget";

export function HomeHero() {
  const t = useTranslations("hero");
  const ti = useTranslations("indicators");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section className="relative bg-primary">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/naxos/hero.jpg"
          alt={pexelsCredits.hero.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/55 to-sea/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-primary/20" />
      </div>

      <div className="container-editorial relative z-10 grid gap-10 pb-28 pt-14 md:pb-36 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div className="text-white">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/95 backdrop-blur-sm"
          >
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.25rem]"
          >
            {t("titleLead")} <span className="text-accent">{t("titleEmphasis")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-white/90 md:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-7 flex flex-wrap gap-2.5"
          >
            <Badge icon={<Star className="h-3.5 w-3.5 fill-accent text-accent" />}>
              {t("ratingLabel", {
                rating: siteConfig.rating.toFixed(1),
                count: siteConfig.reviewCount,
              })}
            </Badge>
            <Badge icon={<Plane className="h-3.5 w-3.5 text-accent" />}>{ti("airport")}</Badge>
            <Badge icon={<Ship className="h-3.5 w-3.5 text-accent" />}>{ti("port")}</Badge>
            <Badge icon={<ShieldCheck className="h-3.5 w-3.5 text-accent" />}>
              {ti("cancellation")}
            </Badge>
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            href={`tel:${siteConfig.phonePrimaryHref}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/95 underline decoration-accent decoration-2 underline-offset-4"
          >
            <Phone className="h-4 w-4 text-accent" />
            {siteConfig.phonePrimary}
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="relative z-10"
        >
          <BookingWidget />
        </motion.div>
      </div>

      {/* Overlapping trust strip, above following sections */}
      <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2">
        <div className="container-editorial">
          <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border bg-white shadow-sunny-lg md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="border-border px-4 py-5 text-center odd:border-r md:border-r md:last:border-r-0 md:py-6"
              >
                <p className="font-heading text-2xl font-extrabold text-primary md:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
      {icon}
      {children}
    </span>
  );
}
