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
 * Parallelogram card styling using CSS transform: -skew-x-[8deg] to -skew-x-[12deg] with counter-skewed inner content.
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

      <div className="mx-auto max-w-[1672px] px-4 py-[70px] sm:px-6 sm:py-[85px] lg:px-[80px] lg:py-[120px] xl:px-[114px]">
        <div className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-12 lg:gap-x-12">
          {/* Header Column: Title and Subtitle */}
          <header className="reveal flex flex-col items-center lg:col-span-4 lg:items-start">
            <Eyebrow
              tone="periwinkle"
              startLine="w-[50px] lg:w-[80px]"
              endLine="w-[50px] lg:w-[80px]"
            >
              {t("eyebrow")}
            </Eyebrow>

            {/* Left-aligned title block centered in viewport on mobile, left-aligned in column on desktop */}
            <div className="mt-4 sm:mt-6 flex flex-col items-start text-start w-fit ps-[11%] sm:ps-0">
              <h2 className="text-[38px] sm:text-[44px] leading-[1.15] font-normal text-white lg:text-[54px] lg:leading-[64px] xl:text-[62px] xl:leading-[72px]">
                <span className="block font-normal text-white">{t("titleLine1")}</span>
                <span className="font-bold text-white">{t("titleBold")}</span>{" "}
                <span className="font-normal text-white">{t("titleEnd")}</span>
              </h2>

              <p className="mt-3 sm:mt-4 max-w-[280px] sm:max-w-[340px] text-[14px] sm:text-[15px] leading-[1.45] text-[#bdc7e4] lg:max-w-[360px] lg:text-[18px] lg:leading-[28px]">
                {t("subtitle")}
              </p>
            </div>
          </header>

          {/* Cards Grid: 2-col skewed parallelogram cards on both mobile & desktop */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-6 xl:gap-8">
              {TESTIMONIALS.map(({ key, avatar }, idx) => (
                <div
                  key={key}
                  className="reveal group relative"
                  style={{
                    ["--reveal-start" as string]: `${8 + idx * 6}%`,
                  }}
                >
                  {/* Skewed background container */}
                  <div className="relative overflow-hidden rounded-[14px] sm:rounded-[20px] border border-[#2b3a67]/60 bg-[#142043]/90 p-3 sm:p-5 lg:p-7 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo/50 hover:bg-[#182652] -skew-x-[8deg] sm:-skew-x-[10deg] lg:-skew-x-[12deg]">
                    {/* Inner counter-skewed content so text & avatars remain straight */}
                    <div className="skew-x-[8deg] sm:skew-x-[10deg] lg:skew-x-[12deg]">
                      <blockquote className="min-h-[44px] sm:min-h-[60px] lg:min-h-[72px] line-clamp-2 sm:line-clamp-none text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px] leading-[1.4] sm:leading-[1.5] lg:leading-[26px] font-normal sm:font-medium text-[#f1f2fc]">
                        {t(`items.${key}.quote`)}
                      </blockquote>

                      {/* 1px separation divider */}
                      <div
                        aria-hidden="true"
                        className="my-2 sm:my-3 lg:my-4 h-[1px] w-full bg-white/10"
                      />

                      {/* Author row */}
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5">
                        <div className="relative h-[30px] w-[30px] sm:h-[42px] sm:w-[42px] lg:h-[54px] lg:w-[54px] shrink-0 overflow-hidden rounded-full border border-white/20">
                          <Image
                            src={avatar}
                            alt={t(`items.${key}.name`)}
                            width={108}
                            height={108}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-[11px] sm:text-[14px] lg:text-[17px] font-bold text-white">
                            {t(`items.${key}.name`)}
                          </span>
                          <span className="truncate text-[9.5px] sm:text-[12px] lg:text-[14px] text-[#b6c0e0]">
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
