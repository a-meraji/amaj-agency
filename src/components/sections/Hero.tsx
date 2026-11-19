import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { GridBackdrop } from "@/components/ui/GridBackdrop";

const CLIENTS = [
  {
    id: "mimmo",
    name: "Mimmo",
    src: "/images/clients/mimmo.png",
    width: 232,
    height: 148,
    className: "h-[22px] w-auto opacity-70 lg:h-[38px] lg:opacity-[0.62]",
  },
  {
    id: "bm",
    name: "BM",
    src: "/images/clients/bm.png",
    width: 460,
    height: 500,
    className: "h-[26px] w-auto opacity-70 lg:h-[45px] lg:opacity-[0.62]",
  },
  {
    id: "rahino",
    name: "Rahino Academy",
    src: "/images/clients/rahino.png",
    width: 1014,
    height: 414,
    className: "h-[22px] w-auto opacity-70 lg:h-[38px] lg:opacity-[0.62]",
  },
  {
    id: "pixel-c",
    name: "Pixel C",
    src: "/images/clients/pixel-c.png",
    width: 224,
    height: 244,
    className: "h-[20px] w-auto opacity-70 lg:h-[33px] lg:opacity-[0.62]",
  },
  {
    id: "blue-clinic",
    name: "Blue Clinic",
    src: "/images/clients/blue-clinic.png",
    width: 722,
    height: 321,
    className: "h-[22px] w-auto opacity-70 lg:h-[38px] lg:opacity-[0.62]",
  },
];

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
        dir="ltr"
        className="mx-auto mt-[24.5px] grid max-w-[392.5px] grid-cols-5 lg:mt-[34px] lg:max-w-[1270px]"
      >
        {CLIENTS.map((client, i) => (
          <li
            key={client.id}
            className={
              "relative flex h-[34px] items-center justify-center lg:h-[50px] " +
              (i > 0
                ? "lg:before:absolute lg:before:start-0 lg:before:inset-y-0 lg:before:w-px lg:before:bg-[#9499b3]/51"
                : "")
            }
          >
            <Image
              src={client.src}
              alt={client.name}
              width={client.width}
              height={client.height}
              className={client.className}
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
      {/* Desktop: baked ambient light + native halos, on a centered 1672px canvas with seamless bottom fade */}
      <div className="absolute inset-y-0 left-1/2 hidden w-[max(100%,1672px)] -translate-x-1/2 lg:block [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
        <Image
          src="/images/hero/ambient.webp"
          alt=""
          fill
          priority
          sizes="1672px"
          className="animate-fade object-cover opacity-50"
        />
      </div>
      <div className="absolute inset-y-0 left-1/2 hidden w-[1672px] -translate-x-1/2 lg:block">
        {/* Top-left lighting zone: drifting along the defined path */}
        <div className="animate-halo-path-left absolute inset-0" style={{ willChange: "transform" }}>
          <Halo
            className="top-[110px] left-[95px] h-[370px] w-[610px] opacity-[0.85] blur-[60px]"
            color="70 51 255"
            stops={[0.55, 0.18]}
          />
          <Halo
            className="top-[90px] left-[350px] h-[340px] w-[670px] opacity-[0.75] blur-[55px]"
            color="51 134 255"
            stops={[0.44, 0.14]}
          />
        </div>

        {/* Bottom-right lighting zone: drifting along the defined path */}
        <div className="animate-halo-path-right absolute inset-0" style={{ willChange: "transform" }}>
          <Halo
            className="top-[350px] left-[1040px] h-[420px] w-[540px] opacity-[0.85] blur-[60px]"
            color="51 134 255"
            stops={[0.56, 0.2]}
          />
          <Halo
            className="top-[510px] left-[950px] h-[270px] w-[500px] opacity-[0.72] blur-[55px]"
            color="70 51 255"
            stops={[0.42, 0.12]}
          />
        </div>
      </div>

      {/* Grid backdrop placed above ambient light, matching section 2 scale & style */}
      <GridBackdrop />

      {/* Mobile: two blurred atmospheric lights with dynamic drift */}
      <div className="absolute inset-y-0 left-1/2 w-[426.5px] -translate-x-1/2 lg:hidden">
        <span className="animate-drift absolute top-[110px] left-[15px] h-[230px] w-[190px] rounded-full bg-[#592add]/32 blur-[55px] [--duration:7.5s]" />
        <span className="animate-drift absolute top-[370px] left-[230px] h-[290px] w-[210px] rounded-full bg-[#188af9]/30 blur-[60px] [--delay:-4s] [--duration:9s]" />
      </div>

      {/* Fine analog grain with smooth feathering into next section */}
      <div className="bg-grain absolute inset-0 hidden opacity-25 lg:block [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]" />
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
