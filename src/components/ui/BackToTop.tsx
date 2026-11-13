"use client";

import { useTranslations } from "next-intl";

interface BackToTopProps {
  className?: string;
  label?: string;
}

export function BackToTop({
  className = "cursor-pointer transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-periwinkle",
  label,
}: BackToTopProps) {
  const t = useTranslations("Footer");
  const displayLabel = label || t("backToTop");

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    // If the browser URL has a hash, clear it gracefully
    if (window.location.hash) {
      window.history.pushState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <a
      href="#top"
      onClick={scrollToTop}
      className={className}
      aria-label={displayLabel}
    >
      {displayLabel}
    </a>
  );
}
