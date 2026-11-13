// Modern flat design service icons with bold curved strokes and geometric balance.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** AI & Automation — Modern curved neural brain with synaptic automation nodes. */
export function ServiceAiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden="true" {...stroke} {...props}>
      {/* Left hemisphere */}
      <path d="M9.5 4.5A3 3 0 0 0 6 7.5c0 .4.08.78.22 1.13A3.5 3.5 0 0 0 4.5 12a3.5 3.5 0 0 0 1.28 2.69c-.18.4-.28.84-.28 1.31a3 3 0 0 0 3 3c.6 0 1.16-.18 1.63-.48M9.5 4.5c.78 0 1.48.36 1.95.93.34.41.55.94.55 1.57v10c0 .63-.21 1.16-.55 1.57-.47.57-1.17.93-1.95.93" />
      {/* Right hemisphere */}
      <path d="M14.5 4.5A3 3 0 0 1 18 7.5c0 .4-.08.78-.22 1.13A3.5 3.5 0 0 1 19.5 12a3.5 3.5 0 0 1-1.28 2.69c.18.4.28.84.28 1.31a3 3 0 0 1-3 3c-.6 0-1.16-.18-1.63-.48M14.5 4.5c-.78 0-1.48.36-1.95.93-.34.41-.55.94-.55 1.57v10c0 .63.21 1.16.55 1.57.47.57 1.17.93 1.95.93" />
      {/* Central neural divider and synaptic connections */}
      <path d="M12 4v16" />
      <path d="M8.5 10H12M12 14h3.5" />
      <circle cx="8.5" cy="10" r="0.8" fill="currentColor" />
      <circle cx="15.5" cy="14" r="0.8" fill="currentColor" />
    </svg>
  );
}

/** UI & UX Design — Modern stacked UI interface layers / components. */
export function ServiceUiUxIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden="true" {...stroke} {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </svg>
  );
}

/** Web & Mobile Development — Modern curved code brackets. */
export function ServiceDevIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden="true" {...stroke} {...props}>
      <path d="M8 6L3.5 10.5a2.12 2.12 0 0 0 0 3L8 18M16 6l4.5 4.5a2.12 2.12 0 0 1 0 3L16 18M13.5 4.5l-3 15" />
    </svg>
  );
}

/** Marketing — Aerodynamic curved megaphone with expanding sound waves. */
export function ServiceMarketingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden="true" {...stroke} {...props}>
      <path d="M11 5L6 8.8H3.5A1.5 1.5 0 0 0 2 10.3v3.4A1.5 1.5 0 0 0 3.5 15.2H6L11 19V5z" />
      <path d="M6 15.2V19a1.5 1.5 0 0 0 1.5 1.5h1" />
      <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M18 7a7 7 0 0 1 0 10" />
      <path d="M21 4.5a10.5 10.5 0 0 1 0 15" />
    </svg>
  );
}

/** Small arrow inside the service "learn more" pill (Figma I23:50;23:41, 20×20). Mirrors in RTL. */
export function ServiceArrow({ className = "", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" strokeWidth={1.7} aria-hidden="true" className={`rtl:-scale-x-100 ${className}`} {...stroke} {...props}>
      <path d="M3.59998 10H15.9M11.4 5.4L16 10L11.4 14.6" />
    </svg>
  );
}
