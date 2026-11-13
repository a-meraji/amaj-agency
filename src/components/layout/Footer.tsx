import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/icons/brand";

const FOOTER_LINKS = [
  { key: "services", href: "#services" },
  { key: "work", href: "#work" },
  { key: "team", href: "#team" },
  { key: "blog", href: "#blog" },
  { key: "contact", href: "#contact" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const navT = await getTranslations("Nav");
  const currentYear = 2026;

  return (
    <footer className="relative border-t border-[#1d274f] bg-[#070c20] text-[#a5b4dc]">
      <div className="mx-auto max-w-[1672px] px-6 py-10 sm:py-12 lg:px-[80px] xl:px-[114px]">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
          {/* Brand & Slogan */}
          <div className="flex flex-col items-center text-center md:items-start md:text-start">
            <a
              href="#top"
              aria-label="Amaj Agency"
              className="flex items-center gap-3 text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-periwinkle"
            >
              <LogoMark className="h-7 w-8 text-white" />
              <span className="text-[18px] font-bold tracking-tight text-white">
                Amaj Agency
              </span>
            </a>
            <p className="mt-2 max-w-[340px] text-[13px] leading-[20px] text-[#8e9ecb]">
              {t("tagline")}
            </p>
          </div>

          {/* Quick Nav Links */}
          <ul className="flex flex-wrap items-center justify-center gap-6 text-[14px] font-medium sm:gap-8">
            {FOOTER_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-periwinkle"
                >
                  {key === "contact" ? navT("cta") : t(`links.${key}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom subtle divider & copyright */}
        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col items-center justify-between gap-3 text-[12px] text-[#7180aa] sm:flex-row">
          <p>
            © {currentYear} Amaj Agency. {t("rights")}
          </p>
          <a
            href="#top"
            className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-periwinkle"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
