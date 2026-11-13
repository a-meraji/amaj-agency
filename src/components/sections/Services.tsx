import type { ComponentType, SVGProps } from "react";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import {
  ServiceAiIcon,
  ServiceArrow,
  ServiceDevIcon,
  ServiceMarketingIcon,
  ServiceUiUxIcon,
} from "@/components/icons/services";

type ServiceKey = "ai" | "uiux" | "dev" | "marketing";

const SERVICES: { key: ServiceKey; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { key: "ai", Icon: ServiceAiIcon },
  { key: "uiux", Icon: ServiceUiUxIcon },
  { key: "dev", Icon: ServiceDevIcon },
  { key: "marketing", Icon: ServiceMarketingIcon },
];

/*
 * Figma: "SERVICES" (23:30, 1672×941) and "MOBILE 02 — Digital Services" (176:747, @2x).
 * Normalized: the four cards share one size (Figma had 575/565 widths, 144–153 heights
 * and one card without a border); 2 equal columns, 29px column gap, 27px row gap.
 * Mobile content is shifted up 31px (status-bar offset dropped), like the Hero.
 */
export async function Services() {
  const t = await getTranslations("Services");

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden bg-ink-900 lg:bg-ink-950"
    >
      <GridBackdrop className="-z-10" />

      {/* Mobile: very subtle bottom blue lift */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[804px] left-1/2 -z-10 h-[165px] w-[245px] -translate-x-[83.25px] rounded-full bg-[#2472d0]/8 blur-[60px] lg:hidden"
      />
      {/* Desktop: seamless transition into the Work section (#171b3d) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[145px] bg-[linear-gradient(180deg,rgb(23_27_61/0)_0%,rgb(23_27_61/0.27)_28%,rgb(23_27_61/0.75)_58%,rgb(23_27_61/0.98)_84%,#171b3d_100%)] lg:block"
      />

      <div className="mx-auto max-w-[1672px] px-6 pt-[119px] pb-[138.5px] lg:px-10 lg:pt-[158px] lg:pb-[234px]">
        <header className="reveal flex flex-col items-center text-center">
          <Eyebrow startLine="w-[73px] lg:w-[135px]" endLine="w-[73px] lg:w-[135px]">
            {t("eyebrow")}
          </Eyebrow>

          {/* Desktop: one baseline-aligned line in a fixed 64px line box (Figma lh 64). */}
          <h2 className="mt-[14px] flex flex-col items-center lg:mt-[26px] lg:h-[64px] lg:flex-row lg:items-baseline lg:justify-center lg:gap-x-[19px]">
            <span className="block text-[33.5px] leading-[40.6px] font-normal text-fg lg:text-display-light lg:leading-[64px] lg:text-[#f4f5fc]">
              {t("titleLight")}
            </span>
            <span className="mt-[2px] block text-[36px] leading-[41.3px] font-bold text-fg lg:mt-0 lg:text-display lg:leading-[64px] lg:text-white">
              {t("titleBold")}
            </span>
          </h2>

          <p className="mt-[8.7px] max-w-[298px] text-[14.5px] leading-[21px] text-[#bdc7e4] lg:mt-[13px] lg:max-w-none lg:text-lead lg:leading-[27px] lg:text-fg-muted">
            {t("subtitle")}
          </p>
        </header>

        <ul className="mx-auto mt-[26px] grid max-w-[378.5px] gap-[15px] lg:mt-[68px] lg:max-w-[1169px] lg:grid-cols-2 lg:gap-x-[29px] lg:gap-y-[27px]">
          {SERVICES.map(({ key, Icon }, i) => (
            <li
              key={key}
              className="reveal [--reveal-end:55%]"
              style={{ ["--reveal-start" as string]: `${5 + (i % 2) * 8}%` }}
            >
              <ServiceCard
                title={t(`items.${key}.title`)}
                description={t(`items.${key}.description`)}
                Icon={Icon}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <article
      className={
        "group flex h-full min-h-[99.5px] items-center gap-[8px] rounded-[5px] border-[0.5px] border-[#53638d]/76 bg-[#121b35] py-[9px] ps-[21.5px] pe-[26px] " +
        "transition-[translate,border-color,background-color,box-shadow] duration-300 ease-out " +
        "hover:-translate-y-0.5 hover:border-periwinkle/45 hover:shadow-[0_18px_40px_-24px_rgb(70_51_255/0.7)] " +
        "lg:min-h-[152px] lg:rounded-sm lg:border lg:border-line-subtle lg:bg-card lg:py-[20px] lg:ps-[35px] lg:pe-[30px] " +
        "lg:hover:bg-[#151a2e]"
      }
    >
      {/* Icon tile: mobile 53.5px r11 #202b49 · desktop 72px r17 #1a2033 */}
      <div className="me-[9px] flex size-[53.5px] shrink-0 items-center justify-center rounded-[11px] lg:me-[39px] bg-[#202b49] transition-colors duration-300 group-hover:bg-[#25315a] lg:size-[72px] lg:rounded-[17px] lg:bg-tile lg:group-hover:bg-[#1f2740]">
        <Icon className="size-[32.5px] text-[#adb7d6] transition-colors duration-300 group-hover:text-[#c9d1ee] lg:size-[44px]" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] leading-[18.8px] font-bold text-fg lg:text-h4 lg:leading-[28px] lg:text-[#f6f6fb]">
          {title}
        </h3>
        <p className="mt-[8.7px] max-w-[221px] text-[12px] leading-[18px] whitespace-pre-line text-[#bdc5dd] lg:mt-[11px] lg:max-w-[335px] lg:text-[16px] lg:leading-[25px] lg:text-fg-muted">
          {description}
        </p>
      </div>

      {/* "Learn more" affordance — decorative until service pages exist */}
      <span
        aria-hidden="true"
        className={
          "flex size-[32px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-[#8392c3]/70 bg-[#121c34]/50 text-[#afc0ed] " +
          "transition-[background-color,border-color,color] duration-300 group-hover:border-periwinkle group-hover:bg-brand/25 group-hover:text-white " +
          "lg:h-[38px] lg:w-[48px] lg:rounded-[20px] lg:border-[1.1px] lg:border-[#6d7499]/45 lg:bg-[#11162d]/18 lg:text-[#f5f5ff]"
        }
      >
        <ServiceArrow className="size-[16.5px] stroke-[1.46] transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 lg:size-[20px] lg:stroke-[1.7]" />
      </span>
    </article>
  );
}
