import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { WorkCarousel } from "./WorkCarousel";

/*
 * Figma: "OUR WORK" (57:279, 1672×941) and "MOBILE 03 — Our Work" (176:833, @2x).
 * Desktop has no grid; its atmosphere is a baked image plus a 380px fade from the
 * Services section's #171b3d. Mobile content is shifted up 31px like other sections.
 */
export async function Work() {
  const t = await getTranslations("Work");

  return (
    <section id="work" className="relative isolate overflow-hidden bg-ink-900">
      <WorkBackground />

      <div className="relative pt-[124px] pb-[150px] lg:pt-[58px] lg:pb-[98px]">
        <header className="reveal flex flex-col items-center px-6 text-center">
          <Eyebrow tone="light" startLine="w-[73px] lg:w-[97px]" endLine="w-[73px] lg:w-[97px]">
            {t("eyebrow")}
          </Eyebrow>

          <h2 className="mt-[20.5px] flex flex-col items-center lg:mt-[19px] lg:h-[67px] lg:flex-row lg:items-baseline lg:gap-x-[19px]">
            <span className="block text-[33.5px] leading-[43.8px] font-normal text-fg lg:text-display-light lg:leading-[67px] lg:text-[#f5f3ff]">
              {t("titleLight")}
            </span>
            <span className="mt-[6.7px] block text-[36px] leading-[48.1px] font-bold text-fg lg:mt-0 lg:text-display lg:leading-[67px] lg:text-[#f7f6ff]">
              {t("titleBold")}
            </span>
          </h2>

          <p className="mt-[16.4px] max-w-[360px] text-[15px] leading-[21.8px] text-[#e0e5f5] lg:mt-[16px] lg:max-w-none lg:text-lead lg:leading-[28px] lg:text-[#f3edff]">
            {t.rich("subtitle", { br: () => <br className="lg:hidden" /> })}
          </p>
        </header>

        <div className="reveal mt-[56.9px] lg:mt-[50px] [--reveal-end:40%]">
          <WorkCarousel />
        </div>
      </div>
    </section>
  );
}

function WorkBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {/* Mobile: grid + three blurred atmospheric lights (frame y − 31px) */}
      <div className="lg:hidden">
        <GridBackdrop />
        <div className="absolute inset-y-0 left-1/2 w-[426.5px] -translate-x-1/2">
          <span className="animate-drift absolute top-[151px] left-[21px] h-[250px] w-[145px] rounded-full bg-[#6c2bfb]/20 blur-[55px] [--duration:18s]" />
          <span className="animate-drift absolute top-[214px] left-[305px] h-[270px] w-[125px] rounded-full bg-[#1973d9]/15 blur-[65px] [--delay:-7s] [--duration:22s]" />
          {/* Figma stacks this ellipse twice (16% each) */}
          <span className="absolute top-[644px] left-[57.5px] h-[150px] w-[305px] rounded-full bg-[#5426bd]/30 blur-[65px]" />
        </div>
      </div>

      {/* Desktop: baked ambient field, stretched to the full width */}
      <div className="absolute inset-y-0 left-1/2 hidden w-[max(100%,1672px)] -translate-x-1/2 lg:block">
        <Image src="/images/work/ambient.webp" alt="" fill sizes="100vw" className="object-cover" />
        {/* Seamless transition from Services (#171b3d → transparent, 380px) */}
        <span className="absolute inset-x-0 top-0 h-[380px] bg-[linear-gradient(180deg,#171b3d_0%,rgb(23_27_61/0.98)_16%,rgb(23_27_61/0.75)_42%,rgb(23_27_61/0.27)_72%,rgb(23_27_61/0)_100%)]" />
      </div>
    </div>
  );
}
