import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "@/components/icons/ui";

type Variant = "primary" | "secondary" | "nav";

type ButtonLinkProps = Omit<ComponentProps<"a">, "children"> & {
  variant?: Variant;
  children: ReactNode;
  /** Show the trailing arrow (mirrors in RTL). */
  arrow?: boolean;
};

/*
 * Figma components:
 *  - "Button / Primary · Start a Project"  desktop 225×61, r10, gradient + 0.8px #6250ff/40
 *                                          mobile  272×54, r5, 18.5/700
 *  - "Button / Secondary · Our Services"   desktop 220×61, r10, 2px #697397/80, #0f1124/28
 *                                          mobile  272×52.5, r5, 0.5px #6475ad/76, #0c1832
 *  - "Navigation / Get in Touch CTA"       174×43, r10, near-solid brand gradient
 */
const base =
  "group inline-flex items-center justify-center font-sans whitespace-nowrap " +
  "transition-[translate,box-shadow,background-color,border-color,filter] duration-300 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-periwinkle";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-primary text-white border-[0.8px] border-[#6250ff]/40 " +
    "h-[54px] w-[272px] rounded-[5px] gap-[5px] text-[18.5px] font-bold " +
    "lg:h-[61px] lg:w-auto lg:rounded-sm lg:ps-[39px] lg:pe-[32px] lg:gap-[18px] lg:text-ui lg:font-semibold " +
    "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgb(70_51_255/0.65)] active:translate-y-0",
  secondary:
    "text-fg bg-[#0c1832] border-[0.5px] border-[#6475ad]/76 " +
    "h-[52.5px] w-[272px] rounded-[5px] text-[17.5px] font-bold " +
    "lg:h-[61px] lg:w-[220px] lg:rounded-sm lg:bg-[#0f1124]/28 lg:border-2 lg:border-line-strong " +
    "lg:text-[#edf0fa] lg:text-ui lg:font-semibold " +
    "hover:-translate-y-0.5 hover:border-periwinkle/70 hover:bg-white/[0.04] active:translate-y-0",
  nav:
    "text-white border-[0.8px] border-[#6658ff]/45 " +
    "bg-[linear-gradient(90deg,#4633ff_0%,#3e2bff_55%,#4332ff_100%)] " +
    "h-[43px] rounded-sm ps-[35px] pe-[16px] gap-[6px] text-ui font-semibold " +
    "hover:shadow-[0_8px_24px_-8px_rgb(70_51_255/0.8)] hover:brightness-110",
};

export function ButtonLink({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          className={
            variant === "primary"
              ? "size-[37px] stroke-[1.32] lg:size-[18px] lg:stroke-[1.6] transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              : "size-[18px] transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          }
        />
      )}
    </a>
  );
}
