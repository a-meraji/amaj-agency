import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { TeamCarousel } from "./TeamCarousel";

/*
 * Figma: "OUR TEAM" (106:806, 1672×941) and "MOBILE 04 — Our Team" (176:907, @2x).
 * Background: #09122f (ink-900) with subtle grid and ambient lighting.
 * Mobile content is shifted up 31px like other sections.
 */
export async function Team() {
  const t = await getTranslations("Team");

  return (
    <section
      id="team"
      className="relative isolate overflow-hidden bg-ink-900 lg:h-[941px] lg:min-h-[941px]"
    >
      <GridBackdrop className="-z-10" />

      {/* Decorative ambient violet/indigo bloom */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 end-0 -z-10 h-[380px] w-[450px] rounded-full bg-[#4633ff]/12 blur-[90px] lg:h-[550px] lg:w-[650px]"
      />

      <div className="relative mx-auto flex h-full max-w-[1672px] flex-col justify-between px-6 pt-[95px] pb-[32px] lg:px-[114px] lg:pt-[114px]">
        <header className="reveal relative z-10">
          <Eyebrow
            tone="periwinkle"
            endLine="w-[232.5px] lg:w-[352px]"
          >
            {t("eyebrow")}
          </Eyebrow>
        </header>

        <TeamCarousel />
      </div>
    </section>
  );
}
