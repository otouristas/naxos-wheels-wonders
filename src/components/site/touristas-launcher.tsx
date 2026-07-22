"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const TIP_KEYS = [
  "tipAsk",
  "tipBook",
  "tipFamily",
  "tipEco",
  "tipFerry",
  "tipBeaches",
] as const;

type IconProps = { className?: string };

function SparklesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3l1.2 4.2L17.5 8.5 13.2 9.8 12 14l-1.2-4.2L6.5 8.5l4.3-1.3L12 3zM18.5 13l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3zM6 14.5l.6 1.8 1.8.6-1.8.6L6 19.3l-.6-1.8-1.8-.6 1.8-.6L6 14.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function CarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 11.5 6.5 7.2A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.2L19 11.5M4 16.5v1a1.5 1.5 0 0 0 3 0v-1m10 0v1a1.5 1.5 0 0 0 3 0v-1M4 14h16a1 1 0 0 1 1 1v1.5H3V15a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BeachIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 18c2-2 4-3 8-3s6 1 8 3M12 15V7m0 0 3 2M12 7l-3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const LAUNCHER_ICONS = [SparklesIcon, CarIcon, BeachIcon, SunIcon] as const;

type TouristasLauncherProps = {
  open: boolean;
  onToggle: () => void;
};

export function TouristasLauncher({ open, onToggle }: TouristasLauncherProps) {
  const t = useTranslations("chat");
  const prefersReduced = useReducedMotion();
  const ambientMotion = !prefersReduced;
  const [tipIndex, setTipIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [hasPulsed, setHasPulsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const LauncherIcon = LAUNCHER_ICONS[iconIndex] ?? SparklesIcon;
  const tip = t(TIP_KEYS[tipIndex] ?? "tipAsk");

  useEffect(() => {
    if (open || !ambientMotion) return;
    const id = window.setInterval(() => setTipIndex((i) => (i + 1) % TIP_KEYS.length), 4000);
    return () => window.clearInterval(id);
  }, [open, ambientMotion]);

  useEffect(() => {
    if (open || !ambientMotion) return;
    const id = window.setInterval(
      () => setIconIndex((i) => (i + 1) % LAUNCHER_ICONS.length),
      6000,
    );
    return () => window.clearInterval(id);
  }, [open, ambientMotion]);

  useEffect(() => {
    const id = window.setTimeout(() => setHasPulsed(true), 3000);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-[60] hidden flex-col items-end gap-3 md:flex"
      aria-live="polite"
    >
      {!open && (
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={ambientMotion ? { opacity: 0, x: 20, filter: "blur(4px)" } : false}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={ambientMotion ? { opacity: 0, x: -10, filter: "blur(4px)" } : undefined}
            transition={{ duration: ambientMotion ? 0.4 : 0 }}
            className="pointer-events-none mr-1 hidden sm:block"
          >
            <div className="rounded-2xl rounded-br-md border border-primary/10 bg-white/95 px-4 py-2 shadow-sunny backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-3 w-3 text-accent" />
                <span className="text-[11px] font-semibold text-primary/70">{tip}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <motion.button
        type="button"
        initial={ambientMotion ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          ambientMotion
            ? { type: "spring", damping: 15, stiffness: 200, delay: 0.3 }
            : { duration: 0 }
        }
        whileHover={ambientMotion ? { scale: 1.12 } : undefined}
        whileTap={ambientMotion ? { scale: 0.9 } : undefined}
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative"
        aria-label={open ? t("close") : t("open")}
        aria-expanded={open}
      >
        {!open && (
          <motion.div
            animate={
              ambientMotion
                ? { scale: [1, 1.18, 1], opacity: [0.18, 0.4, 0.18] }
                : { opacity: 0.28 }
            }
            transition={
              ambientMotion ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : undefined
            }
            className="absolute inset-0 rounded-[20px] bg-gradient-to-tr from-primary via-primary to-accent blur-xl"
            aria-hidden
          />
        )}

        {!open && ambientMotion && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 rounded-[20px] border-2 border-accent/30"
            aria-hidden
          />
        )}

        <div className="relative h-[60px] w-[60px] overflow-hidden rounded-[20px] border border-primary/15 shadow-[0_8px_40px_-8px_oklch(0.5_0.15_245_/_0.45)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-[oklch(0.38_0.12_248)] to-[oklch(0.28_0.08_250)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/25 via-transparent to-accent/15 transition-all duration-500 group-hover:from-accent/40 group-hover:to-accent/25" />

          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <motion.div
              animate={
                isHovered && !open && ambientMotion
                  ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }
                  : {}
              }
              transition={{ duration: 0.6 }}
            >
              {open ? (
                <CloseIcon className="h-6 w-6 text-white" />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={iconIndex}
                    initial={ambientMotion ? { y: 6, opacity: 0, scale: 0.8 } : false}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={ambientMotion ? { y: -6, opacity: 0, scale: 0.8 } : undefined}
                    transition={{ duration: ambientMotion ? 0.45 : 0, ease: "easeOut" }}
                    className="inline-flex"
                  >
                    <LauncherIcon className="h-7 w-7 text-accent drop-shadow-[0_0_8px_oklch(0.85_0.16_90_/_0.55)]" />
                  </motion.span>
                </AnimatePresence>
              )}
            </motion.div>
          </div>

          {!open && (
            <div className="absolute bottom-1 right-1 z-20">
              <div className="relative">
                <div className="h-3 w-3 rounded-full border-2 border-primary bg-emerald-500" />
                {ambientMotion && (
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-emerald-400"
                    aria-hidden
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {!open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: ambientMotion ? 1.5 : 0 }}
            className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-primary/30">
              AI
            </span>
          </motion.div>
        )}

        <AnimatePresence>
          {!hasPulsed && !open && ambientMotion && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
              transition={{ duration: 1.5 }}
              onAnimationComplete={() => setHasPulsed(true)}
              className="pointer-events-none absolute inset-0 rounded-[20px] bg-accent"
              aria-hidden
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
