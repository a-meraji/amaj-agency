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
