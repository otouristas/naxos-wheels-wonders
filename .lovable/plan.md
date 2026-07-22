# Naxos Auto Rent — Master Plan

A cinematic, editorial car rental platform for Naxos. Real booking engine, AI concierge, curated island guide, SEO blog, and 4 languages. Reference direction: naxos-car-rental.com's density and content depth, elevated with an out-of-this-world Aegean editorial aesthetic.

## 1. Design Direction (Aegean Editorial Luxury)

**Mood:** whitewashed Cycladic minimalism × cinematic travel magazine × precision Swiss grid. Feels like a printed island monograph, not a rent-a-car site.

**Palette (semantic tokens in `src/styles.css`, oklch):**

- `--background`: warm chalk white (near-paper)
- `--foreground`: deep ink navy (Aegean night)
- `--primary`: deep sea blue (booking CTAs)
- `--accent`: sunbaked terracotta (highlights, price tags)
- `--muted`: soft limestone
- Dark mode: midnight Aegean w/ moonlight foreground

**Typography:** Instrument Serif (display, oversized editorial H1s) + Inter (UI/body). Occasional Greek characters as decorative accents.

**Layout signature:** asymmetric magazine grids, oversized serif headlines, generous whitespace, full-bleed cinematic imagery, hairline dividers, quiet numeric micro-labels ("01 / Fleet"), sticky booking bar.

**Motion:** restrained — parallax hero, Framer Motion fade-ups, subtle scroll-linked image reveals. No default shadcn hover states everywhere.

## 2. Sitemap

```text
/                       Home (hero, booking widget, featured fleet, guide teaser, testimonials)
/fleet                  Full catalog with filters (category, transmission, seats, price)
/fleet/$slug            Car detail (gallery, specs, pricing tiers, availability, book CTA)
/book                   Booking flow (dates → car → extras → driver → confirm)
/book/success/$id       Confirmation
/guide                  Naxos guide hub
/guide/beaches          Beaches
/guide/villages         Villages
/guide/routes           Driving routes / itineraries
/guide/$slug            Individual guide article
/blog                   Blog index
/blog/$slug             Article
/about                  Company story
/contact                Contact + location + WhatsApp
/faq                    FAQ
/terms, /privacy        Legal
/auth                   Sign in / up (customer accounts)
/_authenticated/account Customer bookings dashboard
/_authenticated/admin   Admin: fleet, bookings, content, AI drafts
```

Each shareable route gets its own `head()` (title, description, og:title, og:description; og:image on leaf routes only).

## 3. Booking Engine (Lovable Cloud)

**Data model (Supabase):**

- `vehicles` — slug, name, category, transmission, seats, doors, luggage, ac, fuel, mpg, deposit, min_age, images[], features[], daily_rate_tiers (JSON: low/mid/high season), active
- `bookings` — id, vehicle_id, user_id (nullable for guest), pickup_date, return_date, pickup_location, dropoff_location, extras[], driver_info (JSON), total, status (pending/confirmed/cancelled), payment_status, created_at
- `extras` — id, name, description, price_per_day, price_flat
- `blocked_dates` — vehicle_id, start, end, reason (manual blocks / maintenance)
- `seasons` — start, end, tier
- `locations` — pickup/dropoff points (Chora port, airport, hotels)
- `guide_articles` — slug, category (beach/village/route), title, excerpt, hero_image, body_md, coords, i18n JSON
- `blog_posts` — slug, title, excerpt, hero_image, body_md, published_at, author, ai_generated, i18n JSON
- `user_roles` — separate table w/ enum `app_role` and `has_role()` SECURITY DEFINER (per user-roles rules)
- `chat_conversations`, `chat_messages` — AI concierge history

**RLS:** enabled everywhere. Vehicles/guides/blog public SELECT to anon. Bookings owner-scoped + admin via `has_role`. Every public table gets explicit `GRANT` statements in the same migration.

**Availability logic:** `createServerFn` checks overlap between requested range and existing confirmed bookings + blocked_dates for the vehicle. Server computes total from season tiers + extras — never trusts client price.

**Booking flow (4 steps, sticky progress):**

1. Dates + locations (persisted in URL search params)
2. Available vehicles grid (filtered by availability)
3. Extras (child seat, GPS, additional driver, full insurance)
4. Driver details + review + confirm

Confirmation email via Resend (secret). Optional Stripe deposit later — v1 = confirm on-site payment, matching reference site pattern.

## 4. AI Layer (Lovable AI Gateway, `openai/gpt-5.5` default)

All AI calls via `createServerFn` + gateway Responses API. No client-side keys.

- **Trip Planner Chatbot** (`/` floating widget + `/guide` full page): streaming chat via `useChat` → `src/routes/api/chat.ts`. System prompt loaded with Naxos knowledge + fleet context. Tool calls: `recommend_vehicle`, `suggest_itinerary`, `check_availability`.
- **Smart Car Recommender** (`/fleet` sidebar): 5-question quiz (group size, luggage, off-road beaches, budget, transmission) → server fn returns ranked 3 vehicles with reasoning.
- **Naxos Concierge Q&A**: same chat surface, RAG-lite using `guide_articles` embeddings (pgvector) so answers cite real content.
- **Admin blog drafter** (`/admin/blog/new`): topic → structured draft (title, meta, sections, hero prompt) using `Output.object`. Admin edits before publish. Marked `ai_generated: true`.

## 5. Multilingual (EN / GR / DE / FR)

- URL prefix routing: `/`, `/de`, `/gr`, `/fr` — root route reads locale from path segment.
- Static UI copy: `src/i18n/{locale}.json`, tiny helper hook `useT()`.
- Dynamic content (vehicles, guides, blog): JSONB `i18n` column keyed by locale, fallback to EN.
- `hreflang` tags in `head()` for each route.
- Language switcher in nav preserves current path.

## 6. Naxos Guide

Rich editorial content hub. Each guide article: hero image, intro, map (Leaflet, dynamically imported via `<ClientOnly>`), body sections, "recommended vehicle" cross-sell, related articles. Categories: Beaches, Villages, Driving Routes, Practical (ferries, driving tips). AI concierge deep-links here.

## 7. Blog

Standard MDX-style blog (markdown in DB). Admin CMS at `/_authenticated/admin/blog`. Categories, tags, SEO fields per post. RSS feed at `/rss.xml` (server route).

## 8. Admin Dashboard (`/_authenticated/admin`)

Role-gated via `has_role(uid, 'admin')`. Sections:

- Bookings (list, filter, confirm/cancel, export CSV)
- Fleet (CRUD vehicles, upload images, set season tiers)
- Availability calendar (block dates)
- Guide & Blog CMS (with AI draft assist)
- Chat logs (review AI conversations)
- Simple analytics tiles

## 9. Auth

Lovable Cloud auth: email/password + Google. Customer accounts optional for booking (guest checkout allowed). Admin invited via seeded `user_roles` row. `_authenticated/route.tsx` gate is integration-managed.

## 10. SEO & Performance

- Per-route `head()` (title <60, desc <160), og:image on leaf routes only
- `robots.txt`, `sitemap.xml` server route generated from vehicles/guides/blog
- JSON-LD: `Organization`, `Product` (per vehicle), `Article` (per guide/blog)
- Semantic HTML, single H1, alt text on all images
- Image lazy loading, responsive `srcset`
- Preload hero fonts

## 11. Build Phases

**Phase 1 — Foundation (design + core browsing)**
Design tokens, layout shell, nav/footer, home, fleet index + detail, about, contact, FAQ. English only.

**Phase 2 — Booking engine**
Supabase schema + RLS, availability server fns, 4-step booking flow, confirmation email, customer account.

**Phase 3 — Guide + Blog**
Guide hub + article template, blog + article template, admin CMS.

**Phase 4 — AI layer**
Chatbot widget, car recommender quiz, admin blog drafter, pgvector concierge RAG.

**Phase 5 — Admin + i18n**
Admin dashboard (bookings, fleet, calendar, analytics), 4-language rollout, hreflang, SEO polish, JSON-LD, sitemap.

## Technical Notes

- Stack: TanStack Start, Tailwind v4, shadcn, Framer Motion, Leaflet (ClientOnly), Resend (email), Lovable Cloud (Supabase), Lovable AI Gateway.
- All AI/booking logic in `createServerFn`; webhooks (e.g. future Stripe) under `src/routes/api/public/*` with signature verification.
- Images generated via imagegen for placeholder fleet + hero shots until real photos supplied.
- Every migration creating a public table includes explicit GRANT statements.
- Roles in separate `user_roles` table with `has_role()` SECURITY DEFINER.

## What I need from you before Phase 2+

- Real fleet list (models, seats, transmission, daily rates by season) — or I seed with realistic placeholders
- Company contact info, pickup locations, logo, real photos when ready
- Confirm: guest checkout OK, or force account creation?
- Confirm: on-site payment for v1 (Stripe added later)?

## Recommended first build: Phase 1 only

Ship the visual foundation + fleet browsing so you can see the design direction rendered. Then approve Phase 2 booking engine.
