/**
 * Architectural background grid shared by all sections.
 * The layer is 2 × 1672px wide and centered, so `--grid-x` offsets are measured
 * from 836px left of the 1672px design frame — this keeps lines where Figma puts them
 * at any viewport width. Mobile offsets are relative to the 426.5px frame the same way.
 *
 * Defaults match the Figma grids: desktop x=8–9 / y=45 (85px cells),
 * mobile x=0 / y=0 (38px cells).
 */
export function GridBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={
        "bg-grid pointer-events-none absolute inset-y-0 start-1/2 w-[3344px] -translate-x-1/2 rtl:translate-x-1/2 " +
        "[--grid-x:14.75px] lg:[--grid-x:80px] lg:[--grid-y:45px] " +
        className
      }
    />
  );
}
