import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";

type TestimonialKey = "reza" | "muhammad" | "mojtaba" | "sara";

interface TestimonialItem {
  key: TestimonialKey;
  avatar: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  { key: "reza", avatar: "/images/testimonials/reza.webp" },
  { key: "muhammad", avatar: "/images/testimonials/muhammad.webp" },
  { key: "mojtaba", avatar: "/images/testimonials/mojtaba.webp" },
  { key: "sara", avatar: "/images/testimonials/sara.webp" },
];

/*
 * Figma: "TESTIMONIALS" (93:146, 1774×887) and "MOBILE 05 — Client Testimonials" (176:965, @2x).
 * Parallelogram card styling using CSS transform: -skew-x-[12deg] with counter-skewed inner content.
 * Background: #070e24 / ink-950 with GridBackdrop and ambient falloff.
 */
export async function Testimonials() {
  const t = await getTranslations("Testimonials");

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden bg-ink-950"
    >
      <GridBackdrop className="-z-10" />

      {/* Decorative ambient lavender falloff (Figma 176:1001) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 start-0 -z-10 h-[360px] w-[360px] rounded-full bg-[#4633ff]/10 blur-[85px] lg:h-[520px] lg:w-[520px]"
      />

      <div className="mx-auto max-w-[1672px] px-6 py-[85px] lg:px-[80px] lg:py-[120px] xl:px-[114px]">
        <div className="grid grid-cols-1 items-center gap-y-12 lg:grid-cols-12 lg:gap-x-12">
          {/* Header Column: Title and Subtitle */}
          <header className="reveal flex flex-col items-center text-center lg:col-span-4 lg:items-start lg:text-start">
            <Eyebrow
              tone="periwinkle"
              startLine="w-[50px] lg:w-[80px]"
              endLine="w-[50px] lg:w-[80px]"
            >
              {t("eyebrow")}
            </Eyebrow>

            <h2 className="mt-4 text-[34px] leading-[42px] font-normal text-white sm:text-[40px] sm:leading-[48px] lg:text-[54px] lg:leading-[64px] xl:text-[62px] xl:leading-[72px]">
              <span className="block">{t("titleLine1")}</span>
              <span className="font-bold text-white">{t("titleBold")}</span>{" "}
              <span>{t("titleEnd")}</span>
            </h2>

            <p className="mt-4 max-w-[340px] text-[15px] leading-[24px] text-[#bdc7e4] lg:max-w-[360px] lg:text-[18px] lg:leading-[28px]">
              {t("subtitle")}
            </p>
          </header>

          {/* Cards Grid: 2x2 skewed parallelogram cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-6 xl:gap-8">
              {TESTIMONIALS.map(({ key, avatar }, idx) => (
                <div
                  key={key}
                  className="reveal group relative"
                  style={{
                    ["--reveal-start" as string]: `${8 + idx * 6}%`,
                  }}
                >
                  {/* Skewed background container */}
                  <div className="relative overflow-hidden rounded-[20px] border border-[#2b3a67]/60 bg-[#142043]/90 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo/50 hover:bg-[#182652] lg:p-7 sm:-skew-x-[8deg] sm:rtl:skew-x-[8deg] md:-skew-x-[12deg] md:rtl:skew-x-[12deg]">
                    {/* Inner counter-skewed content so text & avatars remain straight */}
                    <div className="sm:skew-x-[8deg] sm:rtl:-skew-x-[8deg] md:skew-x-[12deg] md:rtl:-skew-x-[12deg]">
                      <blockquote className="min-h-[72px] text-[15px] leading-[24px] font-medium text-[#f1f2fc] lg:text-[16px] lg:leading-[26px]">
                        {t(`items.${key}.quote`)}
                      </blockquote>

                      {/* 1px separation divider */}
                      <div
                        aria-hidden="true"
                        className="my-4 h-[1px] w-full bg-white/10"
                      />

                      {/* Author row */}
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full border border-white/20 lg:h-[54px] lg:w-[54px]">
                          <Image
                            src={avatar}
                            alt={t(`items.${key}.name`)}
                            width={108}
                            height={108}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-white lg:text-[17px]">
                            {t(`items.${key}.name`)}
                          </span>
                          <span className="text-[13px] text-[#b6c0e0] lg:text-[14px]">
                            {t(`items.${key}.role`)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
