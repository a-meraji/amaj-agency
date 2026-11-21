# Amaj Agency

The Amaj Agency site is built with the Next.js App Router and uses English content.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The development design-token sheet is at
http://localhost:3000/styleguide.

## Content database

Supabase provides PostgreSQL, Auth, and object storage. Copy `.env.example` to
`.env.local` and set the project URL and publishable key. Use a dedicated Supabase
project for test data.

Apply the migrations in `supabase/migrations/` in filename order through the
Supabase CLI (`supabase link --project-ref <project-ref>`, then `supabase db push`).
The content migration copies the original article summaries, portfolio, staff,
and contact links. For admin access, create an Auth user and add its UUID through
the Supabase SQL editor:

```sql
insert into content_private.admins (user_id)
values ('<auth-user-uuid>')
on conflict do nothing;
```

For this invite-only dashboard, turn off public sign-ups in Supabase Auth. Open
`/admin` and sign in with the provisioned account. The app checks admin access at
the dashboard, at each write, and again at the database policy.

In Supabase Authentication, set the site URL to the deployment origin and allow
`/admin/password/callback` on that origin. The admin sign-in page links to a
password setup and recovery form. On Vercel the form uses the production
domain, which you can override with the `SITE_URL` environment variable.

Use **Media library** to upload, open, rename, or remove files. Supported images,
PDFs, and MP4 or WebM videos can be up to 25 MiB each. Uploaded images can also be
selected or uploaded from the article, portfolio, and staff editors. Replace an
image in all entries before deleting it. If an upload gets interrupted, use
**Check upload** to verify it or **Delete file** to discard it. **Retry cleanup**
clears removed entries after their two-hour signed upload links expire.

## Vercel Hobby test deployment

Import the GitHub repository as a Next.js project. Configure the values from
`.env.example` for the intended deployment environment and apply database migrations
before deploying. Use the Supabase HTTP API for runtime content queries, so Vercel
functions need no direct PostgreSQL connections. Send media directly from the browser
to Supabase Storage to stay within Vercel's 4.5 MB function payload limit.

The Supabase Free plan currently includes 500 MB of database space and 1 GB of file
storage. A free project can pause after a week of inactivity. Review current quotas
before deploying.

- [Vercel Functions limits](https://vercel.com/docs/functions/limitations)
- [Supabase on Vercel](https://vercel.com/marketplace/supabase/supabase)
- [Supabase pricing and quotas](https://supabase.com/pricing)

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

- `src/app` — application routes and layout
- `src/components` — sections, layout, UI and icon components
- `messages/` — English interface copy
- `src/app/globals.css` — design tokens (Tailwind v4 `@theme`)
- `scripts/figma` — design pull/inspect tooling

See `CLAUDE.md` for implementation rules and conventions.
