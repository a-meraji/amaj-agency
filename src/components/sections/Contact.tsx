import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import {
  MailIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TelegramIcon,
} from "@/components/icons/social";

const CONTACT_CHANNELS = [
  {
    key: "email",
    label: "Email",
    icon: MailIcon,
    href: "mailto:hello@amaj.agency",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: LinkedInIcon,
    href: "https://linkedin.com/company/amaj-agency",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: WhatsAppIcon,
    href: "https://wa.me/989120000000",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: TelegramIcon,
    href: "https://t.me/amajagency",
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
        <header className="reveal flex flex-col items-center text-center">
          <Eyebrow tone="periwinkle" startLine="w-[60px] lg:w-[120px]" endLine="w-[60px] lg:w-[120px]">
            {t("eyebrow")}
          </Eyebrow>

          <h2 className="mt-3 text-[34px] leading-[40px] font-normal text-white sm:text-[42px] sm:leading-[50px] lg:text-[58px] lg:leading-[68px]">
            <span className="block sm:inline font-normal">{t("titleLight")}</span>{" "}
            <span className="font-bold text-[#628eff]">{t("titleBold")}</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3 max-w-[560px] text-[14px] leading-[22px] text-[#bdc7e4] sm:text-[15px] sm:leading-[24px] lg:text-[17px] lg:leading-[27px]">
            {t("subtitle")}
          </p>
        </header>

        {/* 4 Big Horizontal Icons in a single row on both mobile and desktop (as requested) */}
        <div className="reveal mt-10 sm:mt-12 lg:mt-14 flex flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          {CONTACT_CHANNELS.map(({ key, label, icon: Icon, href }) => (
            <a
              key={key}
              href={href}
              aria-label={label}
              title={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative flex size-[62px] sm:size-[72px] lg:size-[80px] items-center justify-center rounded-[18px] sm:rounded-[22px] border border-[#2f3f78] bg-[#121c3b]/90 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-indigo hover:bg-[#18244e] hover:shadow-[0_0_30px_rgba(97,122,245,0.45)] active:scale-95"
            >
              {/* Top ambient highlight on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2 top-0 h-[2px] rounded-full bg-gradient-to-r from-[#4b66f6] to-[#6091fa] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <Icon className="size-[30px] sm:size-[34px] lg:size-[38px] text-[#9bb0ff] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
