@AGENTS.md

# Amaj Agency — marketing site

Single-page Next.js site implemented **pixel-accurately** from Figma
(file `B3iC5nfXKqOsDhrtc2UC4r`, page "Amaj Redesign"). Accuracy to the design
is the top priority; when the design is silent or inconsistent, ask — don't guess.

## Stack
- Next.js 16 (App Router, `src/`, `cacheComponents`), React 19, TypeScript
- Tailwind CSS v4 — tokens live in `src/app/globals.css` (`@theme`), no tailwind.config
- `next-intl` 4 — locales `en` (default, LTR) and `fa` (RTL); copy in `messages/*.json`
- Fonts via `next/font/google`: Quicksand (Latin) + Vazirmatn (Persian) in one stack

## Commands
```bash
npm run dev            # http://localhost:3000/en  (dev-only token sheet: /en/styleguide)
npm run build          # production build — must pass before committing
npm run lint
npm run typecheck
npm run figma:pull     # download design data into ./design (needs FIGMA_TOKEN in .env.local)
npm run figma:inspect -- 4:2              # node tree for a frame (offline)
npm run figma:inspect -- 176:678 --scale=2  # mobile frames are @2x → divide by 2
```

## Design pipeline (Figma free plan → tiny API quota)
- `./design/` is git-ignored and regenerated with `npm run figma:pull`. Every step is ONE
  batched request and is skipped if its output exists. **Never loop over nodes with
  separate API calls.** Work offline from `design/file.json` with `figma:inspect`.
- New icons/exports: add the node id to `figma.config.json` → `icons`, then
  `npm run figma:pull -- --only=icons --force` (1 call for all of them).
- Reference renders for visual comparison: `design/frames/<n>-<section>-<desktop|mobile>.png`.
- Image fills: `design/images/<imageRef>.<ext>`; optimize into `public/images/**` with
  `sharp` (WebP for photos/gradients). Don't ship raw Figma PNGs.

## Layout rules
- Desktop frames are **1672px** wide → implement at 1:1 for `lg:` (≥1024px); content is
  centered in a 1672px canvas; backgrounds stretch to full width.
- Mobile frames are **853px @2x** → divide every value by 2 (CSS width 426.5px).
  The mobile frames include a ~55px status-bar offset that we drop (nav sits 24px from
  top), so mobile content is shifted up by 31px.
- Minimum mobile text size is **12px** (design values below 12px are raised).
- Normalized tokens (approved): near-duplicate colours/sizes were merged; anything that
  is *visibly* different stays exact as an arbitrary value. Comments in `globals.css`
  list which Figma values each token absorbed.
- Section labels ("WHAT WE DO", …) share one style: `tracking-eyebrow` (0.16em).
- Primary-button gradient is the Figma component's (`bg-gradient-primary`) everywhere.

## i18n / RTL rules
- All visible copy comes from `messages/en.json` + `messages/fa.json` — no literals in JSX.
  Persian copy is a draft pending client review.
- Use logical properties only (`ps-/pe-/ms-/me-/start-/end-`, `text-start`). Physical
  `left/right` only for decorative backgrounds that must not mirror.
- Directional icons mirror via `rtl:-scale-x-100` (built into `ArrowRight`).
- Letter-spacing is force-reset for `:lang(fa)` (it breaks Persian joining).

## Verification (required before showing work)
1. `npm run typecheck && npm run lint && npm run build`
2. Measure against Figma with the browser: render `/en` and `/fa` in same-origin iframes
   at exactly **426.5px** and **1672px** wide, read `getBoundingClientRect()` of key
   elements, compare with `figma:inspect` coordinates (target ≤1px vertical drift).
3. Screenshot both widths and both locales; compare with `design/frames/*.png`.
4. Report deviations and undesigned decisions explicitly to the user.

## Structure
```
src/app/[locale]/        layout (html lang/dir, fonts, intl provider), page, styleguide
src/components/sections/ one file per page section (Hero, …)
src/components/layout/   Navbar
src/components/ui/       Button (variants mirror Figma components)
src/components/icons/    SVG components generated from design/icons
src/i18n/                routing, request config, navigation helpers
src/proxy.ts             next-intl locale routing (Next 16 "proxy" = old middleware)
scripts/figma/           pull.mjs (API, quota-aware) + inspect.mjs (offline)
```

## Workflow with the user
- Build one section per cycle → self-verify → user review → commit after approval.
- Commits: conventional style (`feat(hero): …`); never commit `.env.local` or `design/`.

## Open items (waiting on client)
- Real client logos (Hero trust row uses TED placeholders from the design)
- Contact target for "Get in Touch" / "Start a Project" (currently `#contact`; no contact section designed)
- Services dropdown + mobile menu are not designed (minimal versions implemented)
- Persian copy review; Persian spelling of team member names
- Desktop vs mobile logo differ in Figma (filled vs outlined) — confirm which is canonical
- Services "Learn more" arrow buttons and Work "case study" arrow buttons have no
  destination (decorative for now) — **remind the user at the very end of the project**
- Work carousel: Figma only has perspective-baked artwork per slot; need flat,
  front-facing artwork (≥1104×998) for Finly, Nexora, Medico for non-default states
