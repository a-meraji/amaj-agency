import type { ContactKind, ContactLink, SiteSettings } from "@/lib/content/database";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  ArrowUpRight,
  MailIcon,
  LinkedInIcon,
  WhatsAppIcon,
  TelegramIcon,
} from "@/components/icons/social";

const icons: Record<ContactKind, typeof MailIcon> = {
  email: MailIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  website: ArrowUpRight,
  phone: ArrowUpRight,
};

export function Contact({ links, settings }: { links: ContactLink[]; settings: SiteSettings | null }) {
  if (!settings && links.length === 0) return <div id="contact" />;

  return (
    <section id="contact" className="relative isolate bg-transparent">
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
        {settings && (
          <header className="reveal flex flex-col items-center text-center">
            <Eyebrow tone="periwinkle" startLine="w-[60px] lg:w-[120px]" endLine="w-[60px] lg:w-[120px]">
              {settings.contact_eyebrow}
            </Eyebrow>

            <h2 className="mt-3 text-[34px] leading-[40px] font-normal text-white sm:text-[42px] sm:leading-[50px] lg:text-[58px] lg:leading-[68px]">
              <span className="block sm:inline font-normal">{settings.contact_heading}</span>{" "}
              <span className="font-bold text-[#628eff]">{settings.contact_heading_accent}</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-3 max-w-[560px] text-[14px] leading-[22px] text-[#bdc7e4] sm:text-[15px] sm:leading-[24px] lg:text-[17px] lg:leading-[27px]">
              {settings.contact_intro}
            </p>
          </header>
        )}

        <div className="reveal mt-10 sm:mt-12 lg:mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          {links.map(({ id, label, kind, url }) => {
            const Icon = icons[kind];
            return (
              <a
                key={id}
                href={url}
                aria-label={label}
                title={label}
                target={url.startsWith("http") ? "_blank" : undefined}
                rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group relative flex size-[62px] sm:size-[72px] lg:size-[80px] items-center justify-center rounded-[18px] sm:rounded-[22px] border border-[#2f3f78] bg-[#121c3b]/90 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-indigo hover:bg-[#18244e] hover:shadow-[0_0_30px_rgba(97,122,245,0.45)] active:scale-95"
              >
                <Icon className="size-[30px] sm:size-[34px] lg:size-[38px] text-[#9bb0ff] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
