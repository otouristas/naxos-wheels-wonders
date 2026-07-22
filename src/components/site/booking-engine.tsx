"use client";

import { useEffect, useRef, useState } from "react";
import { IOSRT_ASSETS, IOSRT_GLOBALS_SCRIPT } from "@/lib/iosrt";

declare global {
  interface Window {
    iosRTInitCalendar?: () => void;
    tippy?: (...args: unknown[]) => unknown;
    flatpickr?: {
      l10ns?: { default?: { firstDayOfWeek?: number } };
      (selector: string | Element, opts?: object): unknown;
    };
  }
}

function ensureStylesheet(href: string) {
  if (document.querySelector(`link[data-iosrt="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.iosrt = href;
  document.head.appendChild(link);
}

function injectGlobals() {
  if (document.querySelector("script[data-iosrt-globals]")) return;
  const script = document.createElement("script");
  script.dataset.iosrtGlobals = "true";
  script.text = IOSRT_GLOBALS_SCRIPT;
  document.head.appendChild(script);
}

function loadScript(src: string, timeoutMs = 15000) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[data-iosrt="${src}"]`,
    ) as HTMLScriptElement | null;

    if (existing?.dataset.loaded === "1") {
      resolve();
      return;
    }

    const timer = window.setTimeout(() => {
      reject(new Error(`Timed out loading ${src}`));
    }, timeoutMs);

    const done = (ok: boolean) => {
      window.clearTimeout(timer);
      if (ok) resolve();
      else reject(new Error(`Failed to load ${src}`));
    };

    if (existing) {
      existing.addEventListener("load", () => {
        existing.dataset.loaded = "1";
        done(true);
      }, { once: true });
      existing.addEventListener("error", () => done(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.iosrt = src;
    script.onload = () => {
      script.dataset.loaded = "1";
      done(true);
    };
    script.onerror = () => done(false);
    document.body.appendChild(script);
  });
}

function runSafeInlineScripts(root: HTMLElement) {
  for (const old of Array.from(root.querySelectorAll("script"))) {
    const src = old.getAttribute("src") || "";
    const text = (old.textContent || "").trim();

    if (src.includes("cdn-cgi") || src.includes("email-decode")) {
      old.remove();
      continue;
    }
    if (!src && /^iosRTInitCalendar\s*\(\s*\)\s*;?$/.test(text)) {
      old.remove();
      continue;
    }
    // tippy init, run after tippy exists
    if (!src && text.includes("tippy(")) {
      old.remove();
      continue;
    }
    // flatpickr locale line, handled in boot
    if (!src && text.includes("flatpickr.l10ns")) {
      old.remove();
      continue;
    }

    try {
      if (src) {
        old.remove();
        continue;
      }
      // eslint-disable-next-line no-new-func
      Function(text)();
      old.remove();
    } catch (err) {
      console.warn("iosrt inline skipped:", err);
      old.remove();
    }
  }
}

function collapseSearchForm(root: HTMLElement) {
  const form = root.querySelector<HTMLElement>("#iosrt_form_search");
  if (form) {
    form.style.maxHeight = "0px";
    form.style.overflow = "hidden";
  }
  root.querySelectorAll(".iosrt_filter_stitle a, .iosrt_filter_stitlemob a").forEach((a) => {
    a.classList.remove("iosrt_filter_lnkup");
    a.classList.add("iosrt_filter_lnkdown");
  });
}

/**
 * On small screens the filter sidebar is heavy and pushes the cars far down.
 * Insert a single "Filters" toggle above it that shows/hides the whole panel.
 */
function setupMobileFilterToggle(root: HTMLElement, label: string) {
  const colswrap = root.querySelector<HTMLElement>(".iosrt_colswrap");
  const sidecol = root.querySelector<HTMLElement>(".iosrt_sidecol");
  if (!colswrap || !sidecol) return;
  if (colswrap.querySelector(".nax-filter-toggle")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nax-filter-toggle";
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `<span>${label}</span><span class="nax-filter-caret" aria-hidden="true"></span>`;
  btn.addEventListener("click", () => {
    const open = colswrap.classList.toggle("nax-filters-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  colswrap.insertBefore(btn, sidecol);
}

type Props = {
  html: string;
  showResults: boolean;
  filtersLabel?: string;
};

/**
 * Paints live availability HTML immediately, then hydrates calendars/tooltips.
 */
export function BookingEngine({ html, showResults, filtersLabel = "Filters" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Paint markup immediately (no wait on scripts)
  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    mount.innerHTML = html;
    if (showResults) {
      collapseSearchForm(mount);
      setupMobileFilterToggle(mount, filtersLabel);
    }
  }, [html, showResults, filtersLabel]);

  // Hydrate iosrt behaviour
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const mount = ref.current;
      if (!mount) return;

      injectGlobals();
      for (const href of IOSRT_ASSETS.css) ensureStylesheet(href);

      try {
        for (const src of IOSRT_ASSETS.js) {
          if (cancelled) return;
          await loadScript(src);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus("error");
        return;
      }

      if (cancelled) return;

      // Re-apply markup after libs in case Strict Mode cleared it
      mount.innerHTML = html;
      runSafeInlineScripts(mount);
      if (showResults) {
        collapseSearchForm(mount);
        setupMobileFilterToggle(mount, filtersLabel);
      }

      try {
        if (window.flatpickr?.l10ns?.default) {
          window.flatpickr.l10ns.default.firstDayOfWeek = 1;
        }
        window.iosRTInitCalendar?.();
        window.tippy?.(".iosrt_wtooltip", { arrow: true });
      } catch (err) {
        console.warn("iosrt init:", err);
      }

      if (!cancelled) setStatus("ready");
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [html, showResults, filtersLabel]);

  return (
    <div className="relative">
      {status === "loading" ? (
        <p className="pointer-events-none absolute inset-x-0 top-3 z-10 text-center text-xs font-semibold text-muted-foreground">
          Loading live availability…
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mb-3 rounded-2xl bg-secondary px-4 py-3 text-center text-sm text-muted-foreground">
          Calendars could not load fully. You can still browse the cars below and continue.
        </p>
      ) : null}
      <div
        ref={ref}
        className={`iosrt-host min-h-[20rem] ${showResults ? "iosrt-host--results" : "iosrt-host--search"}`}
      />
    </div>
  );
}
