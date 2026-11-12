---
name: figma-to-code
description: Implement a Figma frame/section pixel-accurately in a Next.js + Tailwind project using the free Figma REST API (quota-aware) and offline inspection, then verify it against the design by measuring in the browser. Use when the user asks to build, match, fix or verify a section/component from Figma, or to set up the Figma pipeline in a new project.
---

# Figma → code, pixel-accurate

The workflow assumes `scripts/figma/pull.mjs`, `scripts/figma/inspect.mjs` and
`figma.config.json` exist (copy them from this repo into new projects — they are
project-agnostic; only `figma.config.json` changes).

## 0. New project setup (once)
1. Ask for the Figma file URL; the key is the segment after `/design/`.
2. Ask the user to put `FIGMA_TOKEN=…` in `.env.local` themselves (never echo tokens; if
   they paste one in chat, store it in `.env.local` and recommend revoking it later).
3. Create `figma.config.json` with `fileKey`, then run **only** the `file` step:
   `node scripts/figma/pull.mjs --only=file`. Inspect offline with
   `node scripts/figma/inspect.mjs` to list frames, fill `frames` in the config, then run
   `--only=frames,fills`.
4. Free/Starter Figma plans have a very small REST quota. Budget calls: one per step,
   batched. Never call the API per node. Prefer re-reading `design/file.json`.

## 1. Inspect (offline)
- `node scripts/figma/inspect.mjs <frameId>` (add `--scale=2` for @2x mobile frames).
- `--text` for copy + type specs, `--tokens` for global colour/type usage.
- Read the reference render `design/frames/<name>.png` for intent; use the JSON for numbers.
- Note: layer names lie, fills may be hidden, text boxes are larger than glyphs
  (`lineHeightPx` is the real line box; `textAlignVertical` is usually TOP).

## 2. Plan before coding
- List every element with: position relative to the frame, size, fill/stroke, radius,
  effects, type spec. Derive the vertical rhythm (margins between consecutive blocks)
  from the coordinates — that is what makes the result match.
- Identify icons/vectors to export → add to `figma.config.json` `icons` → one call:
  `node scripts/figma/pull.mjs --only=icons --force`.
- List anything **undesigned** (hover/focus states, menus, breakpoints between frames,
  empty states) and any **inconsistencies** between desktop and mobile. Decide sensible
  defaults, but report them to the user explicitly.

## 3. Build
- Tokens first (Tailwind v4 `@theme`); arbitrary values only for one-off, visibly
  distinct values.
- Desktop at 1:1 under `lg:`; mobile values = Figma ÷ scale.
- Copy goes in i18n messages; logical properties for RTL.
- Images: optimize with `sharp` into `public/` (WebP), `next/image` with explicit size.
- Decorative backgrounds: center a canvas of the frame width; stretch base layers to
  `max(100%, frameWidth)` so wide screens have no seams.

## 4. Verify (mandatory — do not hand off unverified work)
1. `typecheck`, `lint`, `build` pass.
2. In Chrome (claude-in-chrome), open any same-origin page, replace the body with iframes
   of the route at the exact frame widths (e.g. 426.5px and 1672px; scale the big one
   with `transform: scale(.5)` to fit). Do the wait in a separate call from the measure
   (long awaits inside one JS call can drop the connection).
3. Measure with `getBoundingClientRect()` relative to the section top/center and compare
   with inspect coordinates. Target: ≤1px vertical drift, horizontal drift explained.
4. Screenshot both widths (and every locale/direction) and compare with the reference PNG.
5. Fix, re-measure, then report: what matches, what deviates and why, open questions.
