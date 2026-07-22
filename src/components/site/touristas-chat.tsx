"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { TouristasLauncher } from "@/components/site/touristas-launcher";
import { ChatMarkdown } from "@/components/site/chat-markdown";
import { whatsappUrl } from "@/lib/discover-cyclades";
import { buildBookingUrl } from "@/lib/site-config";
import type {
  ChatDraft,
  ChatFollowUp,
  ChatVehicleCard,
  LocalChatCard,
  LocalChatReply,
} from "@/lib/touristas-chat";

const STARTER_KEYS = [
  "suggestBook",
  "suggestFamily",
  "suggestFleet",
  "suggestBeaches",
] as const;

const TOURISTAS_AI_URL = "https://touristas.ai";
const DRAFT_STORAGE_KEY = "naxos-touristas-draft";
const EXPANDED_KEY = "touristas:expanded";

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      cards: LocalChatCard[];
      followUps?: ChatFollowUp[];
    };

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function draftSummaryBits(draft: ChatDraft, locale: string) {
  const bits: string[] = [];
  if (draft.vehicleName) bits.push(draft.vehicleName);
  if (draft.from && draft.to) bits.push(`${draft.from} → ${draft.to}`);
  else if (draft.from) bits.push(draft.from);
  if (draft.partySize) {
    const people: Record<string, string> = {
      en: `${draft.partySize} people`,
      el: `${draft.partySize} άτομα`,
      it: `${draft.partySize} persone`,
      fr: `${draft.partySize} personnes`,
      de: `${draft.partySize} Personen`,
      nl: `${draft.partySize} personen`,
    };
    bits.push(people[locale] ?? people.en);
  }
  if (draft.name) bits.push(draft.name);
  return bits;
}

export function TouristasChat({
  locale,
  autoOpen = false,
  autoPrompt,
  onAutoOpenConsumed,
}: {
  locale: string;
  autoOpen?: boolean;
  autoPrompt?: string;
  onAutoOpenConsumed?: () => void;
}) {
  const t = useTranslations("chat");
  const pathname = usePathname();
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(autoOpen);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState<ChatDraft>({});
  const [followUps, setFollowUps] = useState<ChatFollowUp[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathWhenOpened = useRef<string | null>(null);
  const draftRef = useRef<ChatDraft>({});

  useEffect(() => {
    draftRef.current = draft;
    try {
      if (draft && Object.keys(draft).length > 0) {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      }
    } catch {
      /* ignore */
    }
  }, [draft]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as ChatDraft;
      if (saved && typeof saved === "object") {
        setDraft(saved);
        draftRef.current = saved;
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(EXPANDED_KEY) === "1") setExpanded(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function onOpen(e: Event) {
      setOpen(true);
      pathWhenOpened.current = pathname;
      const detail = (e as CustomEvent<{ prompt?: string }>).detail;
      if (detail?.prompt) {
        queueMicrotask(() => {
          void ask(detail.prompt!);
        });
      }
    }
    window.addEventListener("touristas:open", onOpen);
    return () => window.removeEventListener("touristas:open", onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, pathname]);

  useEffect(() => {
    if (!autoOpen) return;
    pathWhenOpened.current = pathname;
    setOpen(true);
    onAutoOpenConsumed?.();
    if (autoPrompt) {
      queueMicrotask(() => {
        void ask(autoPrompt);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen, autoPrompt]);

  useEffect(() => {
    if (!open) {
      pathWhenOpened.current = null;
      return;
    }
    if (pathWhenOpened.current == null) {
      pathWhenOpened.current = pathname;
      return;
    }
    if (pathname !== pathWhenOpened.current) {
      setOpen(false);
    }
  }, [pathname, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (e.shiftKey) {
          if (!open) {
            pathWhenOpened.current = pathname;
            setOpen(true);
            setExpanded(true);
            try {
              sessionStorage.setItem(EXPANDED_KEY, "1");
            } catch {
              /* ignore */
            }
            return;
          }
          setExpanded((prev) => {
            const next = !prev;
            try {
              sessionStorage.setItem(EXPANDED_KEY, next ? "1" : "0");
            } catch {
              /* ignore */
            }
            return next;
          });
          return;
        }
        if (open) {
          pathWhenOpened.current = null;
          setOpen(false);
        } else {
          pathWhenOpened.current = pathname;
          setOpen(true);
        }
        return;
      }
      if (e.key === "Escape" && open) {
        pathWhenOpened.current = null;
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  async function ask(text: string, draftOverride?: ChatDraft) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const draftForRequest = draftOverride ?? draftRef.current;
    setError(null);
    setBusy(true);
    setFollowUps([]);
    setMessages((prev) => [...prev, { id: uid(), role: "user", text: trimmed }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          locale,
          draft: draftForRequest,
        }),
      });
      if (!res.ok) throw new Error(t("unavailable"));
      const data = (await res.json()) as LocalChatReply;
      const nextDraft = data.draft ?? draftForRequest;
      setDraft(nextDraft);
      draftRef.current = nextDraft;
      try {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));
      } catch {
        /* ignore */
      }
      const nextFollowUps = Array.isArray(data.followUps) ? data.followUps : [];
      setFollowUps(nextFollowUps);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          text: data.text,
          cards: Array.isArray(data.cards) ? data.cards : [],
          followUps: nextFollowUps,
        },
      ]);
    } catch {
      setError(t("unavailable"));
    } finally {
      setBusy(false);
    }
  }

  function clearChat() {
    if (busy) return;
    setMessages([]);
    setDraft({});
    draftRef.current = {};
    setFollowUps([]);
    setInput("");
    setError(null);
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  function closeChat() {
    pathWhenOpened.current = null;
    setOpen(false);
  }

  function toggleOpen() {
    if (open) {
      closeChat();
      return;
    }
    pathWhenOpened.current = pathname;
    setOpen(true);
  }

  function toggleExpanded() {
    setExpanded((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(EXPANDED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function onFollowUp(item: ChatFollowUp) {
    if (item.type === "message") {
      void ask(item.label, draftRef.current);
      return;
    }
    if (item.type === "book") {
      closeChat();
      router.push(buildBookingUrl());
      return;
    }
    if (item.type === "whatsapp") {
      const d = draftRef.current;
      const url = whatsappUrl(
        d.vehicleName
          ? `Hello Naxos Auto Rent, I'd like to enquire about the ${d.vehicleName}.\n\nSent via Touristas AI`
          : `Hello Naxos Auto Rent, I'd like help choosing a car.\n\nSent via Touristas AI`,
      );
      closeChat();
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await ask(text);
  }

  const progressBits = draftSummaryBits(draft, locale);

  const panelClass = expanded
    ? "fixed inset-0 z-[9999] flex flex-col bg-white md:inset-4 md:overflow-hidden md:rounded-[2rem] md:shadow-2xl md:ring-1 md:ring-primary/15"
    : "fixed inset-0 z-[9999] flex flex-col bg-white md:inset-auto md:bottom-6 md:right-6 md:h-[min(92vh,820px)] md:w-[min(100vw-2rem,480px)] md:overflow-hidden md:rounded-[2rem] md:shadow-2xl md:ring-1 md:ring-primary/15";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="touristas-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            className={panelClass}
            initial={prefersReduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { type: "spring", damping: 26, stiffness: 320 }
            }
          >
            <header className="touristas-panel shrink-0 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white md:px-4 md:pt-3.5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <TouristasMark className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[oklch(0.38_0.12_248)] bg-emerald-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-lg leading-none">{t("title")}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {t("statusLive")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={toggleExpanded}
                    className="hidden h-11 w-11 items-center justify-center rounded-xl text-white/85 transition hover:bg-white/10 md:inline-flex"
                    aria-label={expanded ? t("collapse") : t("expand")}
                    title={expanded ? t("collapse") : t("expand")}
                  >
                    {expanded ? (
                      <MinimizeIcon className="h-4 w-4" />
                    ) : (
                      <MaximizeIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearChat}
                    disabled={messages.length === 0 || busy}
                    className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label={t("clear")}
                    title={t("clear")}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("clear")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeChat}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/15"
                    aria-label={t("close")}
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 truncate text-xs text-white/55">{t("subtitle")}</p>
              {progressBits.length > 0 && (
                <p className="mt-2 truncate text-[11px] text-accent">{progressBits.join(" · ")}</p>
              )}
            </header>

            <div
              ref={listRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-white px-4 py-4 text-sm"
            >
              <div className="animate-message-in rounded-2xl bg-secondary px-3.5 py-3 text-foreground/90 ring-1 ring-primary/8">
                {t("greeting")}
              </div>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {STARTER_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => void ask(t(key))}
                      className="rounded-full bg-primary/[0.05] px-3.5 py-2 text-left text-xs font-medium text-primary ring-1 ring-primary/10 transition hover:bg-primary/[0.09]"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className="animate-message-in space-y-2">
                  <div
                    className={
                      m.role === "user"
                        ? "ml-10 rounded-2xl bg-primary px-3.5 py-2.5 text-primary-foreground"
                        : "mr-6 rounded-2xl bg-secondary px-3.5 py-2.5 text-foreground ring-1 ring-primary/8 whitespace-pre-wrap [&_p+p]:mt-2"
                    }
                  >
                    {m.role === "user" ? (
                      m.text
                    ) : (
                      <ChatMarkdown text={m.text} onNavigate={closeChat} />
                    )}
                  </div>
                  {m.role === "assistant" &&
                    m.cards.map((card, i) => (
                      <LocalCardView
                        key={`${m.id}-${i}`}
                        card={card}
                        t={t}
                        onNavigate={closeChat}
                      />
                    ))}
                </div>
              ))}

              {!busy && followUps.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {followUps.map((item) => (
                    <button
                      key={`${item.type}-${item.label}`}
                      type="button"
                      onClick={() => onFollowUp(item)}
                      className="rounded-full bg-primary/[0.05] px-3.5 py-2 text-left text-xs font-medium text-primary ring-1 ring-primary/10 transition hover:bg-primary/[0.09]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {busy && (
                <div className="mr-6 flex gap-1.5 rounded-2xl bg-secondary px-3.5 py-3.5 ring-1 ring-primary/8">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/50" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/50 [animation-delay:0.15s]" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/50 [animation-delay:0.3s]" />
                </div>
              )}

              {error && (
                <div className="mr-6 rounded-2xl border border-red-300/50 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <footer className="shrink-0 border-t border-primary/10 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-4">
              <form onSubmit={onSubmit} className="flex items-end gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("placeholder")}
                  className="min-h-12 flex-1 rounded-2xl border border-primary/12 bg-secondary px-4 py-3 text-sm outline-none ring-primary/20 focus:ring-2"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
                >
                  {t("send")}
                </button>
              </form>
              <div className="mt-2.5 space-y-1 text-center">
                <p className="text-[11px] text-muted-foreground">
                  {t("poweredBy")}{" "}
                  <a
                    href={TOURISTAS_AI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary/70 underline-offset-2 hover:text-primary hover:underline"
                  >
                    {t("poweredBrand")}
                  </a>
                </p>
                <p className="text-[10px] leading-snug text-muted-foreground/80">
                  {t("disclaimer")}
                </p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <TouristasLauncher open={open} onToggle={toggleOpen} />
    </>
  );
}

function TouristasMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-5 w-5"} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 5v2.5M12 16.5V19M5 12h2.5M16.5 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-5 w-5"} aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MaximizeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-4 w-4"} aria-hidden>
      <path
        d="M9 4H5v4M15 4h4v4M5 15v4h4M19 15v4h-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-4 w-4"} aria-hidden>
      <path
        d="M9 8H5V4M15 8h4V4M5 16v4h4M19 16v4h-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? "h-4 w-4"} aria-hidden>
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FleetVehicleCard({
  vehicle,
  t,
  onNavigate,
}: {
  vehicle: ChatVehicleCard;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
  onNavigate?: () => void;
}) {
  const detailHref = vehicle.path;
  const bookHref = vehicle.bookUrl || buildBookingUrl();
  const specs = [
    vehicle.transmission,
    vehicle.seats ? t("seatsShort", { count: vehicle.seats }) : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="overflow-hidden rounded-xl border border-primary/12 bg-white shadow-sm">
      <div className="flex gap-3 p-2.5">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-primary/8">
          {vehicle.image ? (
            <Image
              src={vehicle.image}
              alt={vehicle.name}
              fill
              className="object-contain object-center p-1"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
              Naxos
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          {vehicle.category ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {vehicle.category}
            </p>
          ) : null}
          {detailHref ? (
            <Link
              href={detailHref}
              onClick={onNavigate}
              className="mt-0.5 block font-heading text-sm leading-tight text-primary hover:underline"
            >
              {vehicle.name}
            </Link>
          ) : (
            <p className="mt-0.5 font-heading text-sm leading-tight text-primary">{vehicle.name}</p>
          )}
          {specs ? <p className="mt-1 text-[11px] text-muted-foreground">{specs}</p> : null}
          <p className="mt-1.5 text-xs font-semibold text-primary">
            {vehicle.fromPrice != null
              ? t("fromDayShort", { price: vehicle.fromPrice })
              : t("askRate")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 border-t border-primary/8 bg-secondary/50 p-2">
        <Link
          href={bookHref}
          onClick={onNavigate}
          className="inline-flex items-center justify-center rounded-lg bg-accent px-2 py-2 text-[11px] font-semibold text-accent-foreground transition hover:brightness-105"
        >
          {t("toolBook")}
        </Link>
        {vehicle.whatsappUrl ? (
          <a
            href={vehicle.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#25D366] px-2 py-2 text-[11px] font-semibold text-white transition hover:brightness-110"
          >
            <WhatsAppIcon className="h-3 w-3" />
            {t("toolWhatsApp")}
          </a>
        ) : (
          <Link
            href={detailHref || "/fleet"}
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-lg border border-primary/15 bg-white px-2 py-2 text-[11px] font-semibold text-primary"
          >
            {t("toolView")}
          </Link>
        )}
      </div>
    </article>
  );
}

function LocalCardView({
  card,
  t,
  onNavigate,
}: {
  card: LocalChatCard;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
  onNavigate?: () => void;
}) {
  if (card.kind === "recommend") {
    return (
      <div className="mr-6 space-y-2">
        <p className="px-0.5 text-xs font-semibold text-primary/65">{t("toolRecommend")}</p>
        <div className="grid gap-2">
          {card.vehicles.map((v, i) => (
            <FleetVehicleCard
              key={`${v.slug}-${i}`}
              vehicle={v}
              t={t}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    );
  }

  if (card.kind === "prefill") {
    return (
      <div className="mr-6 space-y-2">
        {card.vehicle ? (
          <FleetVehicleCard vehicle={card.vehicle} t={t} onNavigate={onNavigate} />
        ) : null}
        <div className="grid grid-cols-2 gap-1.5">
          <Link
            href={card.url || buildBookingUrl()}
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-3 py-2.5 text-xs font-semibold text-accent-foreground hover:brightness-105"
          >
            {t("toolPrefill")}
          </Link>
          <a
            href={card.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-white hover:brightness-110"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            {t("toolWhatsApp")}
          </a>
        </div>
      </div>
    );
  }

  if (card.kind === "rate") {
    return card.dailyEur != null ? (
      <p className="mr-6 rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-primary">
        {t("toolRate", { price: card.dailyEur })}
      </p>
    ) : null;
  }

  if (card.kind === "guide") {
    return (
      <div className="mr-6 space-y-1.5 rounded-xl border border-primary/12 bg-secondary/60 p-2.5">
        <p className="px-0.5 text-xs font-semibold text-primary/70">{t("toolGuide")}</p>
        <div className="grid gap-1">
          {card.results.map((r) => (
            <Link
              key={r.slug}
              href={r.path}
              onClick={onNavigate}
              className="rounded-lg bg-white px-2.5 py-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              {r.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
