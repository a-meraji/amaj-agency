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
    <section id="work" className="relative isolate overflow-hidden bg-[#09122f] lg:bg-transparent">
      <WorkBackground />

      <div className="relative pt-[124px] pb-[130px] lg:pt-[58px] lg:pb-[160px]">
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
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Mobile: Native glowing atmospheric fields (grid is provided continuously by parent content-canvas) */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-y-0 left-1/2 w-[426.5px] -translate-x-1/2">
          {/* Left vibrant rich violet/purple glow */}
          <span
            className="animate-work-glow-left absolute top-[90px] -left-[50px] h-[440px] w-[360px] rounded-full bg-[#872bfb]/46 blur-[85px]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Left companion deep purple aura */}
          <span
            className="animate-work-glow-left absolute top-[170px] left-[30px] h-[380px] w-[310px] rounded-full bg-[#6c1ce8]/44 blur-[75px] [animation-delay:-3s]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Right azure/royal blue glow */}
          <span
            className="animate-work-glow-right absolute top-[120px] right-[0px] h-[430px] w-[340px] rounded-full bg-[#186ef9]/40 blur-[85px]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Right deep sapphire companion */}
          <span
            className="animate-work-glow-right absolute top-[200px] right-[30px] h-[350px] w-[290px] rounded-full bg-[#1442e6]/42 blur-[75px] [animation-delay:-3.5s]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Bottom subtle violet glow behind active card */}
          <span
            className="animate-work-glow-center absolute top-[420px] left-1/2 h-[290px] w-[440px] rounded-full bg-[#7924fa]/42 blur-[75px]"
            style={{ willChange: "transform, opacity" }}
          />
        </div>
      </div>

      {/* Desktop: High-resolution native lighting fields */}
      <div className="absolute inset-0 hidden lg:block [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
        {/* Centered 1672px atmospheric canvas with dynamic organic floating motion */}
        <div className="absolute inset-y-0 left-1/2 w-[1672px] -translate-x-1/2">
          {/* Left primary rich vibrant violet/purple glow */}
          <span
            className="animate-work-glow-left absolute top-[100px] left-[20px] h-[700px] w-[820px] rounded-full bg-[#8224f8]/44 blur-[125px]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Left deep purple companion aura */}
          <span
            className="animate-work-glow-left absolute top-[190px] left-[200px] h-[600px] w-[700px] rounded-full bg-[#641eed]/42 blur-[115px] [animation-delay:-3s]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Right primary azure/royal blue glow */}
          <span
            className="animate-work-glow-right absolute top-[140px] left-[920px] h-[700px] w-[800px] rounded-full bg-[#1a5eff]/38 blur-[125px]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Right deep sapphire companion aura */}
          <span
            className="animate-work-glow-right absolute top-[240px] left-[1040px] h-[580px] w-[660px] rounded-full bg-[#1034b8]/38 blur-[115px] [animation-delay:-3.5s]"
            style={{ willChange: "transform, opacity" }}
          />
          {/* Bottom-center subtle violet glow behind active card */}
          <span
            className="animate-work-glow-center absolute top-[490px] left-1/2 h-[380px] w-[760px] rounded-full bg-[#6e22f5]/40 blur-[110px]"
            style={{ willChange: "transform, opacity" }}
          />
        </div>
      </div>

      {/* Seamless top transition from Services (#171b3d → transparent) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[180px] lg:h-[380px] bg-seam-top"
      />
    </div>
  );
}
