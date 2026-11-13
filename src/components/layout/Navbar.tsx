"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { LogoMark, LogoOutline } from "@/components/icons/brand";
import { ChevronDown } from "@/components/icons/ui";
import { ButtonLink } from "@/components/ui/Button";

const LINKS = [
  { key: "services", href: "#services", chevron: true },
  { key: "work", href: "#work" },
  { key: "about", href: "#team" },
  { key: "blogs", href: "#blog" },
] as const;

/*
 * Figma: "02 · Navigation / glass capsule" (desktop 1297×61 @ top 21)
 *        "Navigation / translucent surface" (mobile 369×51, fully rounded)
 * The capsule is fixed so it stays available while scrolling the single page.
 */
export function Navbar() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Close the mobile menu on Escape or when resizing up to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header className="animate-fade fixed inset-x-0 top-6 z-50 px-6 lg:top-[21px] lg:px-10 [--delay:100ms]">
      <nav
        aria-label={t("label")}
        className={
          "relative mx-auto flex h-[51px] max-w-[1297px] items-center justify-between " +
          "rounded-[25.5px] border-[0.5px] border-[#6d7cb0]/76 bg-[#151f3e] ps-[23px] pe-[24.5px] " +
          "lg:h-[61px] lg:rounded-sm lg:border-[1.15px] lg:border-[#646c92]/58 lg:ps-[27px] lg:pe-[13px] " +
          "lg:bg-[linear-gradient(90deg,rgb(26_28_54/0.93)_0%,rgb(19_22_42/0.88)_45%,rgb(17_20_38/0.94)_100%)] " +
          "lg:backdrop-blur-[15px]"
        }
      >
        {/* Glass top reflection (desktop only) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[2px] top-[2px] hidden h-[23px] rounded-[8px] bg-[linear-gradient(180deg,rgb(107_112_159/0.08),rgb(21_24_43/0))] opacity-75 lg:block"
        />

        <a
          href="#top"
          aria-label={t("home")}
          className="relative shrink-0 rounded-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-periwinkle lg:text-white"
        >
          <LogoOutline className="h-[25.5px] w-[30.5px] lg:hidden" />
          <LogoMark className="hidden h-[30px] w-[36px] lg:block" />
        </a>

        {/* Desktop links — centered in the capsule */}
        <ul className="absolute start-1/2 hidden -translate-x-1/2 items-center gap-[73px] rtl:translate-x-1/2 lg:flex">
          {LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="group flex items-center gap-[14px] text-ui font-semibold text-[#f3f2f9] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-periwinkle"
              >
                <span className="relative">
                  {t(link.key)}
                  <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-periwinkle transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right" />
                </span>
                {"chevron" in link && (
                  <ChevronDown className="size-[14px] text-[#f5f4fd] transition-transform duration-300 group-hover:translate-y-0.5" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="relative hidden items-center lg:flex">
          <ButtonLink variant="nav" href="#contact" arrow>
            {t("cta")}
          </ButtonLink>
        </div>

        {/* Mobile hamburger: 3 × 21px strokes, 2px, 8px apart (Figma) */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t("closeMenu") : t("openMenu")}
          onClick={() => setOpen((v) => !v)}
          className="relative -me-2 flex size-[37px] items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-periwinkle lg:hidden"
        >
          <span aria-hidden="true" className="relative block h-[18px] w-[21px]">
            {[0, 8, 16].map((top, i) => (
              <span
                key={top}
                style={{ top }}
                className={
                  "absolute inset-x-0 h-[2px] rounded-full bg-white transition-[translate,rotate,opacity] duration-300 " +
                  (open
                    ? i === 0
                      ? "translate-y-[8px] rotate-45"
                      : i === 1
                        ? "opacity-0"
                        : "-translate-y-[8px] -rotate-45"
                    : "")
                }
              />
            ))}
          </span>
        </button>
      </nav>

      {/* Mobile menu panel (not in Figma — styled to match the capsule) */}
      <div
        id={menuId}
        hidden={!open}
        className="mx-auto mt-3 max-w-[1297px] rounded-[25.5px] border-[0.5px] border-[#6d7cb0]/76 bg-[#151f3e]/95 p-6 backdrop-blur-[15px] lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-[10px] px-3 py-3 text-[17px] font-semibold text-fg transition-colors hover:bg-white/5"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-end border-t border-[#6d7cb0]/30 pt-5">
          <ButtonLink variant="nav" href="#contact" arrow onClick={() => setOpen(false)}>
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
