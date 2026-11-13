import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Right arrow (Figma 4:56). Mirrors automatically in RTL. */
export function ArrowRight({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`rtl:-scale-x-100 ${className}`}
      {...props}
    >
      <path d="M2.7 9h11.7M9 14.4 14.4 9 9 3.6" />
    </svg>
  );
}

/** Chevron down (Figma 4:49). */
export function ChevronDown(props: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.625 5.25 7 9.625l4.375-4.375" />
    </svg>
  );
}

/** Carousel Previous Arrow (Figma 217:16 / 57:310). Mirrors in RTL. */
export function ArrowPrev({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`rtl:-scale-x-100 ${className}`}
      {...props}
    >
      <path d="M25 14.5H5M13 22.5L5 14.5L13 6.5" />
    </svg>
  );
}

/** Carousel Next Arrow (Figma 217:18 / 57:312). Mirrors in RTL. */
export function ArrowNext({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`rtl:-scale-x-100 ${className}`}
      {...props}
    >
      <path d="M4 14.5H24M16 22.5L24 14.5L16 6.5" />
    </svg>
  );
}

/** Calendar icon (Figma 138:1300) */
export function CalendarIcon({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 23 23"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M4.79167 4.7915H18.2083C19.2669 4.7915 20.125 5.64962 20.125 6.70817V19.1665C20.125 20.225 19.2669 21.0832 18.2083 21.0832H4.79167C3.73312 21.0832 2.875 20.225 2.875 19.1665V6.70817C2.875 5.64962 3.73312 4.7915 4.79167 4.7915Z"
        strokeWidth="1.7"
      />
      <path
        d="M6.70833 2.396V7.18766M16.2917 2.396V7.18766M2.875 9.5835H20.125"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Clock icon (Figma 138:1305) */
export function ClockIcon({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 23 23"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M20.7001 11.4998C20.7001 16.5808 16.5811 20.6998 11.5 20.6998C6.41903 20.6998 2.30005 16.5808 2.30005 11.4998C2.30005 6.41879 6.41903 2.2998 11.5 2.2998C16.5811 2.2998 20.7001 6.41879 20.7001 11.4998Z"
        strokeWidth="1.7"
      />
      <path
        d="M11.5 5.6543V12.0751L15.3333 14.471"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Blog View All arrow (Figma 138:1287). Mirrors in RTL. */
export function ArrowRightBlog({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 25 25"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`rtl:-scale-x-100 ${className}`}
      {...props}
    >
      <path d="M3.125 12.4998H20.8333M14.0625 19.2707L20.8333 12.4998L14.0625 5.729" />
    </svg>
  );
}
