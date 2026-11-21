import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getPublishedTestimonials } from "@/lib/content/public";
import { imageUrl } from "@/lib/content/presentation";

export async function Testimonials() {
  const [t, entries] = await Promise.all([
    getTranslations("Testimonials"),
    getPublishedTestimonials(),
  ]);

  if (entries.length === 0) return <div id="testimonials" />;

  const renderCard = (entry: (typeof entries)[number], copy = 0) => (
    <div
      key={entry.id + "-" + copy}
      aria-hidden={copy > 0 || undefined}
      className="group relative mb-5 sm:mb-6 lg:mb-7"
    >
      {/* px wrapper so skew corners don't get clipped by parent overflow:hidden */}
      <div className="px-5 lg:px-7">
        {/* Skewed card */}
        <div className="relative overflow-hidden rounded-[14px] sm:rounded-[20px] border border-[#2b3a67]/60 bg-[#142043]/90 p-3 sm:p-5 lg:p-7 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo/50 hover:bg-[#182652] -skew-x-[8deg] sm:-skew-x-[10deg] lg:-skew-x-[12deg]">
          {/* Inner counter-skewed content */}
          <div className="skew-x-[8deg] sm:skew-x-[10deg] lg:skew-x-[12deg]">
            <blockquote className="min-h-[44px] sm:min-h-[60px] lg:min-h-[72px] text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px] leading-[1.4] sm:leading-[1.5] lg:leading-[26px] font-normal sm:font-medium text-[#f1f2fc]">
              {entry.quote}
            </blockquote>

            <div
              aria-hidden="true"
              className="my-2 sm:my-3 lg:my-4 h-[1px] w-full bg-white/10"
            />

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5">
              <div className="relative h-[30px] w-[30px] sm:h-[42px] sm:w-[42px] lg:h-[54px] lg:w-[54px] shrink-0 overflow-hidden rounded-full border border-white/20">
                <Image
                  src={imageUrl(entry.image_path)}
                  alt=""
                  width={108}
                  height={108}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="truncate text-[11px] sm:text-[14px] lg:text-[17px] font-bold text-white">
                  {entry.name}
                </span>
                <span className="truncate text-[9.5px] sm:text-[12px] lg:text-[14px] text-[#b6c0e0]">
                  {entry.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden bg-transparent"
    >
      {/* Scoped keyframes for infinite marquee columns */}
      <style>{`
        @keyframes marqueeUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        @keyframes marqueeDown {
          0%   { transform: translateY(-33.333%); }
          100% { transform: translateY(0); }
        }
        .marquee-up {
          animation: marqueeUp 18s linear infinite;
        }
        .marquee-down {
          animation: marqueeDown 18s linear infinite;
        }
        .marquee-up:hover,
        .marquee-down:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Decorative ambient lavender falloff */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 start-0 -z-10 h-[360px] w-[360px] rounded-full bg-[#4633ff]/10 blur-[85px] lg:h-[520px] lg:w-[520px]"
      />

      <div className="mx-auto max-w-[1672px] px-4 pt-[48px] pb-[70px] sm:px-6 sm:py-[85px] lg:px-[80px] lg:py-[120px] xl:px-[114px]">
        <div className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-12 lg:gap-x-12">
          {/* Header Column */}
          <header className="reveal flex flex-col items-center lg:col-span-4 lg:items-start">
            <Eyebrow
              tone="periwinkle"
              startLine="w-[50px] lg:w-[80px]"
              endLine="w-[50px] lg:w-[80px]"
            >
              {t("eyebrow")}
            </Eyebrow>

            <div className="mt-4 sm:mt-6 flex flex-col items-start text-start w-fit ps-[11%] sm:ps-0">
              <h2 className="text-[38px] sm:text-[44px] leading-[1.15] font-normal text-white lg:text-[54px] lg:leading-[64px] xl:text-[62px] xl:leading-[72px]">
                <span className="block font-normal text-white">{t("titleLine1")}</span>
                <span className="inline-flex items-baseline gap-[40px] sm:gap-[48px] lg:gap-[32px]">
                  <span className="font-bold text-white">{t("titleBold")}</span>
                  <span className="font-normal text-white">{t("titleEnd")}</span>
                </span>
              </h2>

              <p className="mt-3 sm:mt-4 max-w-[280px] sm:max-w-[340px] text-[14px] sm:text-[15px] leading-[1.45] text-[#bdc7e4] lg:max-w-[360px] lg:text-[18px] lg:leading-[28px]">
                {t("subtitle")}
              </p>
            </div>
          </header>

          {/* Infinite scroll cards — 2 columns */}
          <div className="lg:col-span-8">
            {entries.length === 1 ? (
              <div className="mx-auto max-w-lg">{renderCard(entries[0])}</div>
            ) : (
              <div
                className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-5 overflow-hidden"
                style={{
                  maxHeight: "680px",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                }}
              >
                {["marquee-up", "marquee-down"].map((direction, column) => {
                  const items = entries.filter((_, index) => index % 2 === column);
                  return (
                    <div key={direction} className={direction + " flex flex-col pt-6"}>
                      {[0, 1, 2].flatMap(copy => items.map(entry => renderCard(entry, copy)))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
