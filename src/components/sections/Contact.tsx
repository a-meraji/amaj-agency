import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import {
  MailIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TelegramIcon,
  ArrowUpRight,
} from "@/components/icons/social";

const CONTACT_CHANNELS = [
  {
    key: "email",
    icon: MailIcon,
    href: "mailto:hello@amaj.agency",
    color: "from-[#4b66f6] to-[#6091fa]",
    badgeBg: "bg-[#18234d]",
    badgeBorder: "border-[#2f3f78]",
    iconColor: "text-[#8ea8ff]",
  },
  {
    key: "linkedin",
    icon: LinkedInIcon,
    href: "https://linkedin.com/company/amaj-agency",
    color: "from-[#0a66c2] to-[#3b82f6]",
    badgeBg: "bg-[#0e2448]",
    badgeBorder: "border-[#1d4480]",
    iconColor: "text-[#60a5fa]",
  },
  {
    key: "whatsapp",
    icon: WhatsAppIcon,
    href: "https://wa.me/989120000000",
    color: "from-[#10b981] to-[#22c55e]",
    badgeBg: "bg-[#0e3029]",
    badgeBorder: "border-[#1a5948]",
    iconColor: "text-[#25d366]",
  },
  {
    key: "telegram",
    icon: TelegramIcon,
    href: "https://t.me/amajagency",
    color: "from-[#0284c7] to-[#38bdf8]",
    badgeBg: "bg-[#0e2740]",
    badgeBorder: "border-[#1c4d75]",
    iconColor: "text-[#38bdf8]",
  },
] as const;

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink-950">
      <GridBackdrop className="-z-10" />

      {/* Ambient background glows */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 start-0 -z-10 h-[400px] w-[500px] rounded-full bg-[#4633ff]/12 blur-[100px] lg:h-[550px] lg:w-[650px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 end-0 -z-10 h-[350px] w-[450px] rounded-full bg-[#3561ff]/12 blur-[90px] lg:h-[480px] lg:w-[580px]"
      />

      <div className="mx-auto max-w-[1672px] px-6 pt-[85px] pb-[95px] lg:px-[80px] lg:pt-[110px] lg:pb-[120px] xl:px-[114px]">
        {/* Section Header */}
        <header className="reveal flex flex-col justify-between gap-3 sm:gap-4">
          <Eyebrow tone="periwinkle" endLine="w-[150px] lg:w-[260px]">
            {t("eyebrow")}
          </Eyebrow>

          <h2 className="text-[34px] leading-[40px] font-normal text-white sm:text-[42px] sm:leading-[50px] lg:text-[58px] lg:leading-[68px]">
            <span className="block sm:inline font-normal">{t("titleLight")}</span>{" "}
            <span className="font-bold text-[#628eff]">{t("titleBold")}</span>
          </h2>

          {/* Subtitle with vertical accent bar */}
          <div className="mt-1 flex items-stretch gap-2.5 sm:gap-3">
            <span
              aria-hidden="true"
              className="w-[4px] shrink-0 rounded-full bg-indigo"
            />
            <p className="max-w-[620px] text-[14px] leading-[22px] text-[#bdc7e4] sm:text-[15px] sm:leading-[24px] lg:text-[17px] lg:leading-[27px]">
              {t("subtitle")}
            </p>
          </div>
        </header>

        {/* Contact Channels Grid */}
        <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {CONTACT_CHANNELS.map(({ key, icon: Icon, href, color, badgeBg, badgeBorder, iconColor }, idx) => (
            <a
              key={key}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="reveal group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#232f55] bg-[#0d1633]/85 p-6 sm:p-7 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-indigo/50 hover:bg-[#111c40] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo/10"
              style={{
                ["--reveal-start" as string]: `${10 + idx * 8}%`,
              }}
            >
              {/* Top ambient highlight line on hover */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between">
                {/* Glowing icon badge */}
                <div
                  className={`flex size-13 sm:size-14 items-center justify-center rounded-[16px] border ${badgeBg} ${badgeBorder} shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(97,122,245,0.35)]`}
                >
                  <Icon className={`h-6 w-6 ${iconColor} transition-colors duration-300 group-hover:text-white`} />
                </div>

                {/* Subtle external arrow icon */}
                <div className="flex size-8 items-center justify-center rounded-full bg-white/5 text-[#8898cb] transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col items-start">
                <span className="text-[12px] sm:text-[13px] font-bold tracking-wider text-[#8da1db] uppercase">
                  {t(`links.${key}.label`)}
                </span>
                <span className="mt-1 text-[16px] sm:text-[17px] lg:text-[18px] font-semibold text-white transition-colors duration-200 group-hover:text-[#6aa3ff] break-all">
                  {t(`links.${key}.value`)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
