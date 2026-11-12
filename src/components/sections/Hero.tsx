import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { GridBackdrop } from "@/components/ui/GridBackdrop";

const CLIENTS = Array.from({ length: 5 }, (_, i) => ({ id: `ted-${i}`, name: "TED" }));

/*
 * Figma: "HERo" (4:2, 1672×941) and "MOBILE 01 — Hero" (176:678, 853×1844 @2x).
 * Vertical rhythm is taken 1:1 from the frames. On mobile, the frame's 55px
 * status-bar offset is dropped (nav sits 24px from the top), so all mobile
 * content is shifted up by 31px.
 */
export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-ink-900 lg:bg-ink-950"
    >
      <HeroBackground />

      <div className="relative mx-auto flex max-w-[1672px] flex-col items-center px-6 pt-[174.5px] pb-[146px] text-center lg:pt-[252px] lg:pb-[30px]">
        <h1 className="font-normal">
          <span
            className={
              "animate-rise block text-[38.5px] leading-[51px] text-fg [--delay:150ms] " +
              "lg:text-display-light lg:leading-[76px] lg:text-[#f4f3f8]"
            }
          >
            {t("titleLine1")}
          </span>
          <span
            className={
              "animate-rise mt-[2px] block text-[38px] leading-[51px] font-bold [--delay:280ms] " +
              "lg:mt-[6px] lg:text-display-light lg:leading-[78px]"
            }
          >
            <span className="text-gradient-sunset pb-[0.08em] drop-shadow-[0_4px_4px_rgb(0_0_0/0.25)]">
              {t("titleLine2")}
            </span>
          </span>
        </h1>

        <p
          className={
            "animate-rise mt-[15.5px] max-w-[290px] text-[17px] leading-[26.4px] text-fg-muted-blue [--delay:420ms] " +
            "lg:mt-[25px] lg:max-w-[580px] lg:text-lead lg:leading-[35px] lg:text-fg-muted"
          }
        >
          {t("subtitle")}
        </p>

        <div className="animate-rise mt-[41px] flex flex-col items-center gap-[33.5px] [--delay:560ms] lg:mt-[44px] lg:flex-row lg:gap-[28px]">
          <ButtonLink href="#contact" variant="primary" arrow>
            {t("primaryCta")}
          </ButtonLink>
          <ButtonLink href="#services" variant="secondary">
            {t("secondaryCta")}
          </ButtonLink>
        </div>

        <TrustRow caption={t("trustedBy")} label={t("clientsLabel")} />
      </div>
    </section>
  );
}

function TrustRow({ caption, label }: { caption: string; label: string }) {
  return (
    <div className="animate-fade mt-[73.5px] w-full [--delay:800ms] lg:mt-[218px]">
      {/* Caption flanked by hairlines */}
      <div className="flex items-start justify-center gap-[19px] lg:gap-[21px]">
        <span
          aria-hidden="true"
          className="mt-[8px] h-px max-w-[45.5px] flex-1 bg-[#9ba8d0]/80 lg:mt-[17px] lg:max-w-[301px] lg:bg-[#84869a]/46"
        />
        <p
          className={
            "shrink-0 text-[12px] leading-[16px] font-medium tracking-[0.19em] text-fg uppercase " +
            "lg:text-overline lg:leading-[20px] lg:tracking-overline lg:text-fg-muted"
          }
        >
          {caption}
        </p>
        <span
          aria-hidden="true"
          className="mt-[8px] h-px max-w-[45.5px] flex-1 bg-[#9ba8d0]/80 lg:mt-[17px] lg:max-w-[301px] lg:bg-[#84869a]/46"
        />
      </div>

      {/* Client logos (placeholders in Figma) */}
      <ul
        aria-label={label}
        className="mx-auto mt-[24.5px] grid max-w-[392.5px] grid-cols-5 lg:mt-[34px] lg:max-w-[1270px]"
      >
        {CLIENTS.map((client, i) => (
          <li
            key={client.id}
            className={
              "relative flex h-[26px] items-center justify-center lg:h-[27px] " +
              (i > 0
                ? "lg:before:absolute lg:before:start-0 lg:before:inset-y-0 lg:before:w-px lg:before:bg-[#9499b3]/51"
                : "")
            }
          >
            <Image
              src="/images/clients/ted.png"
              alt={client.name}
              width={127}
              height={46}
              className="h-[13.5px] w-auto opacity-60 lg:h-[23px] lg:opacity-[0.53]"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <GridBackdrop />

      {/* Desktop: baked ambient light + native halos, on a centered 1672px canvas */}
      <div className="absolute inset-y-0 left-1/2 hidden w-[max(100%,1672px)] -translate-x-1/2 lg:block">
        <Image
          src="/images/hero/ambient.webp"
          alt=""
          fill
          priority
          sizes="1672px"
          className="animate-fade object-cover"
        />
      </div>
      <div className="absolute inset-y-0 left-1/2 hidden w-[1672px] -translate-x-1/2 lg:block">
        <Halo className="top-[121px] left-[115px] h-[335px] w-[566px] opacity-[0.37] [--delay:0s] [--duration:22s]" color="70 51 255" stops={[0.13, 0.04]} />
        <Halo className="top-[102px] left-[370px] h-[314px] w-[632px] opacity-[0.35] [--delay:-6s] [--duration:26s]" color="51 134 255" stops={[0.1, 0.03]} />
        <Halo className="top-[366px] left-[1060px] h-[389px] w-[503px] opacity-[0.37] [--delay:-12s] [--duration:24s]" color="51 134 255" stops={[0.19, 0.05]} />
        <Halo className="top-[526px] left-[970px] h-[239px] w-[471px] opacity-[0.29] [--delay:-3s] [--duration:20s]" color="70 51 255" stops={[0.1, 0]} />
      </div>

      {/* Mobile: two blurred atmospheric lights (frame coordinates −31px) */}
      <div className="absolute inset-y-0 left-1/2 w-[426.5px] -translate-x-1/2 lg:hidden">
        <span className="animate-drift absolute top-[127px] left-[22.5px] h-[160px] w-[140px] rounded-full bg-[#592add]/12 blur-[47.5px] [--duration:16s]" />
        <span className="animate-drift absolute top-[394px] left-[260px] h-[230px] w-[155px] rounded-full bg-[#188af9]/11 blur-[52.5px] [--delay:-8s] [--duration:20s]" />
      </div>

      {/* Fine analog grain */}
      <div className="bg-grain absolute inset-0 hidden opacity-60 lg:block" />
    </div>
  );
}

function Halo({
  className,
  color,
  stops,
}: {
  className: string;
  color: string;
  stops: [number, number];
}) {
  return (
    <span
      className={`animate-drift absolute rounded-full ${className}`}
      style={{
        backgroundImage: `radial-gradient(closest-side, rgb(${color} / ${stops[0]}) 0%, rgb(${color} / ${stops[1]}) 53%, rgb(${color} / 0) 100%)`,
      }}
    />
  );
}
