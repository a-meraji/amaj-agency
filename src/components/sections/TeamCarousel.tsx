"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { TeamWatermark } from "@/components/icons/brand";
import { ArrowNext, ArrowPrev } from "@/components/icons/ui";

const TEAM_MEMBERS = [
  { key: "amin", image: "/images/team/amin.webp" },
  { key: "sepehr", image: "/images/team/vp.webp" },
] as const;

export function TeamCarousel() {
  const t = useTranslations("Team");
  const [activeIndex, setActiveIndex] = useState(0);

  // Exactly 3 dots matching Figma design
  const totalDots = 3;
  const currentMember = TEAM_MEMBERS[activeIndex % TEAM_MEMBERS.length];
  const currentKey = currentMember.key;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalDots) % totalDots);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalDots);
  };

  // Touch swipe support on mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const renderControls = () => (
    <div
      role="group"
      aria-label={t("eyebrow")}
      className="flex items-center gap-[16px] lg:gap-[20px]"
    >
      <button
        type="button"
        onClick={handlePrev}
        aria-label={t("previous")}
        className="flex size-[36px] cursor-pointer items-center justify-center text-[#eef1ff] transition-opacity hover:opacity-80 active:scale-90 focus-visible:outline-2 focus-visible:outline-periwinkle lg:size-[42px]"
      >
        <ArrowPrev className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
      </button>

      <div className="flex items-center gap-[9px] lg:gap-[12px]">
        {Array.from({ length: totalDots }).map((_, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              aria-current={isActive}
              className="flex min-h-[40px] min-w-[28px] cursor-pointer items-center justify-center p-1.5 focus-visible:outline-none"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-[10px] w-[10px] scale-125 bg-lilac shadow-[0_0_12px_rgba(164,117,255,0.85)] lg:h-[13px] lg:w-[13px]"
                    : "h-[8px] w-[8px] bg-pager hover:opacity-80 lg:h-[10px] lg:w-[10px]"
                }`}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        aria-label={t("next")}
        className="flex size-[36px] cursor-pointer items-center justify-center text-[#eef1ff] transition-opacity hover:opacity-80 active:scale-90 focus-visible:outline-2 focus-visible:outline-periwinkle lg:size-[42px]"
      >
        <ArrowNext className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px]" />
      </button>
    </div>
  );

  return (
    <div
      className="relative mt-[24px] touch-pan-y select-none lg:mt-[36px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="grid grid-cols-1 items-end lg:grid-cols-12 lg:gap-x-[48px]">
        {/* Left Column: Details & Bio + Desktop Controls */}
        <div className="reveal flex flex-col items-start pb-[20px] lg:col-span-7 lg:pb-[56px]">
          <h2 className="text-[36.5px] leading-[45.6px] font-bold text-[#fcfcff] transition-all duration-300 lg:text-[72px] lg:leading-[81.4px]">
            {t(`members.${currentKey}.name`)}
          </h2>

          {/* Role badge with gradient */}
          <div className="mt-[18px] lg:mt-[32px]">
            <span className="inline-flex items-center justify-center rounded-[9px] bg-gradient-to-r from-[#617af5] to-[#798aff] px-[21px] py-[6px] text-[18px] leading-[22.5px] font-bold text-white shadow-sm transition-all duration-300 lg:rounded-[14px] lg:px-[28px] lg:py-[10px] lg:text-[32px] lg:leading-[37.3px]">
              {t(`members.${currentKey}.role`)}
            </span>
          </div>

          {/* Quote / Bio statement block */}
          <div className="mt-[28px] flex items-stretch gap-[16px] lg:mt-[48px] lg:gap-[25px]">
            <span
              aria-hidden="true"
              className="w-[6px] shrink-0 rounded-full bg-indigo lg:w-[9px]"
            />
            <p className="max-w-[620px] text-[15px] leading-[24px] font-medium text-[#f1f2fc] transition-all duration-300 lg:text-[22px] lg:leading-[40px]">
              {t(`members.${currentKey}.bio`)}
            </p>
          </div>

          {/* Desktop Controls (Under the left column, matching Figma desktop) */}
          <div className="hidden lg:flex mt-[48px] w-full max-w-[620px] justify-center">
            {renderControls()}
          </div>
        </div>

        {/* Right Column: Watermark background + Photo + Mobile Controls */}
        <div className="reveal relative flex items-end justify-end lg:col-span-5">
          {/* Watermark logo: on mobile positioned on the LEFT side so it is clearly visible next to the person */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute start-[-8px] sm:start-4 top-[30px] sm:top-[10px] -z-10 w-[260px] sm:w-[320px] text-[#6078da]/25 lg:start-auto lg:end-[-40px] lg:top-[-40px] lg:w-[476px] lg:text-[#6078da]/30"
          >
            <TeamWatermark className="h-auto w-full" />
          </div>

          {/* High-res optimized member photo (shifted to right on mobile so left watermark shows) */}
          <div className="relative ms-auto me-[-12px] sm:me-0 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[540px] xl:max-w-[600px]">
            <Image
              key={currentMember.key}
              src={currentMember.image}
              alt={t(`members.${currentKey}.name`)}
              width={1200}
              height={1214}
              priority
              className="h-auto w-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-opacity duration-300"
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 400px, 600px"
            />

            {/* Mobile Controls: clean bare indicators (NO box, NO border) directly overlaid at bottom */}
            <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 z-20 lg:hidden">
              {renderControls()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
