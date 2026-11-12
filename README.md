# Amaj Agency

Marketing site for Amaj Agency — a single-page Next.js app built from the Figma design,
in English and Persian (RTL).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 (redirects to `/en`, or `/fa` for Persian browsers).
The dev-only design-token sheet is at http://localhost:3000/en/styleguide.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |
| `npm run figma:pull` | Download design data from Figma into `./design` (see below) |
| `npm run figma:inspect -- <nodeId>` | Print a frame's layers, positions and styles (offline) |

## Figma design data

The design source is not committed. To fetch it, create `.env.local`:

```
FIGMA_TOKEN=<your Figma personal access token>
```

then run `npm run figma:pull`. It makes at most four batched API calls (the free Figma
plan has a small quota) and skips anything already downloaded. Frames and icons to
export are configured in `figma.config.json`.

## Project layout

- `src/app/[locale]` — localized layout and page
- `src/components` — sections, layout, UI and icon components
- `messages/` — English and Persian copy
- `src/app/globals.css` — design tokens (Tailwind v4 `@theme`)
- `scripts/figma` — design pull/inspect tooling

See `CLAUDE.md` for implementation rules and conventions.
