import type { ReactNode } from "react";

type Tone = "periwinkle" | "light";

const tones: Record<Tone, { text: string; line: string }> = {
  periwinkle: { text: "text-periwinkle", line: "bg-periwinkle" },
  light: { text: "text-[#f3f3ff]", line: "bg-[#d8dffa]/43" },
};

/**
 * Section label ("WHAT WE DO", "OUR WORK", …) with hairlines.
 * Normalized style (approved): desktop 24px/700, mobile 12px/700, tracking 0.16em.
 * Hairline lengths differ per section in Figma, so they are passed in.
 */
export function Eyebrow({
  children,
  tone = "periwinkle",
  startLine,
  endLine,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  /** Tailwind width classes for the leading hairline (omit for none). */
  startLine?: string;
  /** Tailwind width classes for the trailing hairline (omit for none). */
  endLine?: string;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <div className={`flex items-center gap-[18px] lg:gap-[13px] ${className}`}>
      {startLine && <span aria-hidden="true" className={`h-px shrink ${t.line} ${startLine}`} />}
      <p
        className={`shrink-0 text-[12px] leading-[16px] font-bold tracking-eyebrow uppercase lg:text-eyebrow lg:leading-[20px] ${t.text}`}
      >
        {children}
      </p>
      {endLine && <span aria-hidden="true" className={`h-px shrink ${t.line} ${endLine}`} />}
    </div>
  );
}
