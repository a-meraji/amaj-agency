import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { ArrowRightBlog, CalendarIcon, ClockIcon } from "@/components/icons/ui";

interface BlogPostItem {
  key: "engineering" | "ux" | "growth";
  image: string;
  date: string;
  minutes: number;
}

const SECONDARY_POSTS: BlogPostItem[] = [
  {
    key: "engineering",
    image: "/images/blog/engineering.webp",
    date: "Jan 20, 2025",
    minutes: 6,
  },
  {
    key: "ux",
    image: "/images/blog/ux.webp",
    date: "Jan 15, 2025",
    minutes: 5,
  },
  {
    key: "growth",
    image: "/images/blog/growth.webp",
    date: "Jan 10, 2025",
    minutes: 6,
  },
];

/*
 * Figma: "BLOG" (138:1190, 1672×941) and "MOBILE 06 — Latest Insights" (176:1037, @2x).
 * Features 1 large featured hero article + 3 secondary articles in a clean 3-col grid.
 * All text translated via next-intl messages (Blog.*).
 */
export async function Blog() {
  const t = await getTranslations("Blog");

  return (
    <section id="blog" className="relative isolate overflow-hidden bg-ink-950">
      <GridBackdrop className="-z-10" />

      {/* Decorative ambient glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 end-0 -z-10 h-[400px] w-[500px] rounded-full bg-[#3561ff]/10 blur-[90px] lg:h-[550px] lg:w-[680px]"
      />

      <div className="mx-auto max-w-[1672px] px-6 pt-[85px] pb-[100px] lg:px-[80px] lg:pt-[110px] lg:pb-[130px] xl:px-[114px]">
        {/* Section Header */}
        <header className="reveal flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col items-start">
            <Eyebrow tone="periwinkle" endLine="w-[150px] lg:w-[260px]">
              {t("eyebrow")}
            </Eyebrow>

            <h2 className="mt-4 text-[34px] leading-[42px] font-normal text-white sm:text-[42px] sm:leading-[50px] lg:text-[58px] lg:leading-[68px]">
              <span className="font-normal">{t("titleLight")}</span>{" "}
              <span className="font-bold text-[#628eff]">{t("titleBold")}</span>
            </h2>

            <div className="mt-3 flex items-stretch gap-3">
              <span
                aria-hidden="true"
                className="w-[4px] shrink-0 rounded-full bg-indigo"
              />
              <p className="max-w-[580px] text-[15px] leading-[24px] text-[#bdc7e4] lg:text-[17px] lg:leading-[27px]">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* View All Button */}
          <div className="shrink-0 self-start sm:self-end">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#4d6bfe] to-[#45b7fe] px-5 py-2.5 text-[15px] font-semibold text-white shadow-lg shadow-[#4d6bfe]/25 transition-all hover:scale-[1.03] hover:shadow-[#4d6bfe]/40 active:scale-[0.98]"
            >
              <span>{t("viewAll")}</span>
              <ArrowRightBlog className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Featured Blog Post (Large Card) */}
        <article className="reveal mt-10 overflow-hidden rounded-[24px] border border-[#232f55] bg-[#0d1633]/85 p-5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-indigo/40 lg:mt-12 lg:p-7">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Image Column */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] lg:col-span-6">
              <Image
                src="/images/blog/featured.webp"
                alt={t("posts.productThinking.title")}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>

            {/* Content Column */}
            <div className="flex flex-col items-start lg:col-span-6">
              <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#4b66f6] to-[#6091fa] px-3.5 py-1 text-[13px] font-semibold text-white shadow-sm">
                {t("posts.productThinking.tag")}
              </span>

              <h3 className="mt-3 text-[22px] leading-[30px] font-bold text-white sm:text-[26px] sm:leading-[34px] lg:mt-4 lg:text-[30px] lg:leading-[40px] xl:text-[34px] xl:leading-[44px]">
                {t("posts.productThinking.title")}
              </h3>

              <p className="mt-2 text-[14px] leading-[23px] text-[#a9b5da] lg:mt-3 lg:text-[16px] lg:leading-[26px]">
                {t("posts.productThinking.excerpt")}
              </p>

              {/* Meta details */}
              <div className="mt-5 flex items-center gap-4 text-[13px] text-[#93a2cf] lg:mt-6 lg:text-[14px]">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Jan 26, 2025</span>
                </div>
                <span aria-hidden="true" className="text-white/20">
                  |
                </span>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  <span>{t("minRead", { minutes: 8 })}</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Secondary Posts Grid (3 Cards) */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECONDARY_POSTS.map(({ key, image, date, minutes }, idx) => (
            <article
              key={key}
              className="reveal flex flex-col overflow-hidden rounded-[20px] border border-[#232f55] bg-[#0d1633]/85 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo/40 hover:bg-[#111c40]"
              style={{
                ["--reveal-start" as string]: `${10 + idx * 6}%`,
              }}
            >
              {/* Card Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[14px]">
                <Image
                  src={image}
                  alt={t(`posts.${key}.title`)}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              </div>

              {/* Title & Excerpt */}
              <h3 className="mt-4 line-clamp-2 text-[18px] leading-[26px] font-bold text-white lg:text-[20px] lg:leading-[28px]">
                {t(`posts.${key}.title`)}
              </h3>

              <p className="mt-2 line-clamp-3 text-[14px] leading-[22px] text-[#a9b5da]">
                {t(`posts.${key}.excerpt`)}
              </p>

              {/* Meta details pushed to bottom */}
              <div className="mt-auto pt-4">
                <div className="flex items-center gap-4 text-[13px] text-[#93a2cf]">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{date}</span>
                  </div>
                  <span aria-hidden="true" className="text-white/20">
                    |
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    <span>{t("minRead", { minutes })}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
