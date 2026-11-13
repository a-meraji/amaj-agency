// Modern flat design service icons with bold curved strokes, prominent scale, and semantic clarity.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** AI & Automation — Modern curved AI intelligence sparkle with companion automation spark. */
export function ServiceAiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.3} aria-hidden="true" {...stroke} {...props}>
      {/* Primary curved AI Sparkle */}
      <path d="M12 2C12 6.8 8.2 10.5 3 11C8.2 11.5 12 15.2 12 20C12 15.2 15.8 11.5 21 11C15.8 10.5 12 6.8 12 2Z" />
      {/* Secondary automation spark */}
      <path d="M18.5 3.5C18.5 5 17.5 6 16 6.5C17.5 7 18.5 8 18.5 9.5C18.5 8 19.5 7 21 6.5C19.5 6 18.5 5 18.5 3.5Z" strokeWidth={1.8} />
    </svg>
  );
}

/** UI & UX Design — Modern interface artboard canvas with rounded components and controls. */
export function ServiceUiUxIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.3} aria-hidden="true" {...stroke} {...props}>
      {/* Artboard window frame with smooth rounded corners */}
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" />
      {/* Navigation header line */}
      <path d="M2.5 8.5h19" />
      {/* UI window control dots */}
      <circle cx="5.8" cy="6" r="0.8" fill="currentColor" />
      <circle cx="8.8" cy="6" r="0.8" fill="currentColor" />
      {/* Rounded UI component card */}
      <rect x="5.5" y="11.5" width="5.5" height="5.5" rx="1.5" />
      {/* UX interaction / content sliders */}
      <path d="M14 12.5h4.5M14 15.5h3" />
    </svg>
  );
}

/** Web & Mobile Development — Web desktop screen + overlapping mobile smartphone. */
export function ServiceDevIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.3} aria-hidden="true" {...stroke} {...props}>
      {/* Web desktop monitor */}
      <rect x="2" y="3.5" width="13.5" height="11.5" rx="2.5" />
      <path d="M5 19h7M8.75 15v4" />
      {/* Curved code brackets on screen */}
      <path d="M6 7.5L4.8 9.25 6 11M11.5 7.5L12.7 9.25 11.5 11" />
      {/* Mobile smartphone overlapping */}
      <rect x="14.5" y="8" width="7.5" height="12.5" rx="2" fill="#121b35" />
      <path d="M18.25 17.5h.01" />
    </svg>
  );
}

/** Marketing — Audience targeting bullseye (connecting products with the right audience). */
export function ServiceMarketingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.3} aria-hidden="true" {...stroke} {...props}>
      {/* Outer target ring */}
      <circle cx="12" cy="12" r="9.5" />
      {/* Inner target ring */}
      <circle cx="12" cy="12" r="5.5" />
      {/* Bullseye center */}
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      {/* Precision crosshair alignment markers */}
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" strokeWidth={2} />
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
