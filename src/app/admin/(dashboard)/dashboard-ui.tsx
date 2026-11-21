import { collectionNames, collections } from "@/lib/content/editor-fields";

const iconPaths = {
  overview: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  articles: "M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6",
  projects: "M3 7h18v13H3z M8 7V4h8v3 M3 12h18 M10 12v3h4v-3",
  staff: "M15 21v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2 M18 14a4 4 0 0 1 3 4v3 M9 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7 M16 3.5a3.5 3.5 0 0 1 0 6.5",
  testimonials: "M21 4H3v13h5l4 4 4-4h5z M8 8h3v4H8z M14 8h2v4h-2z",
  contact_links: "M9 15l6-6 M8 17l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0 M16 7l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0",
  media: "M3 4h18v16H3z M3 17l5-5 4 4 4-5 5 6 M9 8h.01",
  settings: "M4 6h16 M4 12h16 M4 18h16 M8 4v4 M15 10v4 M10 16v4",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  external: "M13 5h6v6 M19 5l-9 9 M9 5H5v14h14v-4",
  logout: "M10 4H4v16h6 M10 12h10 M16 8l4 4-4 4",
  next: "M9 6l6 6-6 6",
} as const;

export function DashboardIcon({ name, className = "size-5" }: {
  name: keyof typeof iconPaths;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <path d={iconPaths[name]} />
    </svg>
  );
}

const descriptions = {
  articles: "Write, edit, and publish articles.",
  projects: "Manage the work featured on your site.",
  staff: "Keep team profiles up to date.",
  testimonials: "Manage customer quotes on the homepage.",
  contact_links: "Update the ways visitors can reach you.",
};

export const dashboardLinks = [
  { icon: "overview", label: "Overview", href: "/admin", description: "" },
  ...collectionNames.map(icon => ({
    icon, label: collections[icon].label, href: "/admin/" + icon, description: descriptions[icon],
  })),
  { icon: "media", label: "Media library", href: "/admin/media", description: "Upload and manage files." },
  { icon: "settings", label: "Site settings", href: "/admin/settings", description: "Edit site-wide contact and footer text." },
] as const;

export const secondaryButton = "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-line bg-ink-800 px-3 text-sm font-bold text-fg-soft transition-colors hover:border-periwinkle/65 hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle disabled:opacity-60";
export const primaryButton = "inline-flex min-h-[44px] items-center justify-center rounded-sm border border-periwinkle/60 bg-periwinkle px-4 text-sm font-bold text-ink-950 transition-colors hover:bg-fg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle disabled:opacity-60";
export const adminPanel = "rounded-md border border-line bg-ink-800";
export const pageTitle = "text-[28px] leading-tight font-bold tracking-tight text-fg sm:text-h2";
export const adminInput = "block min-h-[44px] w-full rounded-sm border border-line-strong bg-ink-950 px-3 py-2 text-base text-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-periwinkle aria-invalid:border-rose-400";
