"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Exactly 3 dots matching Figma design
  const totalDots = 3;
  const currentMember = TEAM_MEMBERS[activeIndex % TEAM_MEMBERS.length];
  const currentKey = currentMember.key;

  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const changeSlide = useCallback((nextIdx: number) => {
    if (nextIdx === activeIndex) return;
    setIsFading(true);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setActiveIndex(nextIdx);
      setIsFading(false);
    }, 280);
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    changeSlide((activeIndex - 1 + totalDots) % totalDots);
  }, [activeIndex, changeSlide]);

  const handleNext = useCallback(() => {
    changeSlide((activeIndex + 1) % totalDots);
  }, [activeIndex, changeSlide]);

  // Autoplay automation: smoothly rotates every 5 seconds, pauses on user interaction/hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      changeSlide((activeIndex + 1) % totalDots);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, changeSlide]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  // Touch swipe support on mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
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
              onClick={() => changeSlide(idx)}
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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 items-end lg:grid-cols-12 lg:gap-x-[48px]">
        {/* Left Column: Details & Bio + Desktop Controls */}
        <div className="reveal flex flex-col items-start pb-[20px] lg:col-span-7 lg:pb-[56px]">
          {/* Fading text container for subtle, smooth content transitions */}
          <div
            className={`flex flex-col items-start transition-opacity duration-300 ease-in-out ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            <h2 className="text-[36.5px] leading-[45.6px] font-bold text-[#fcfcff] lg:text-[72px] lg:leading-[81.4px]">
              {t(`members.${currentKey}.name`)}
            </h2>

            {/* Role badge with gradient */}
            <div className="mt-[18px] lg:mt-[32px]">
              <span className="inline-flex items-center justify-center rounded-[9px] bg-gradient-to-r from-[#617af5] to-[#798aff] px-[21px] py-[6px] text-[18px] leading-[22.5px] font-bold text-white shadow-sm lg:rounded-[14px] lg:px-[28px] lg:py-[10px] lg:text-[32px] lg:leading-[37.3px]">
                {t(`members.${currentKey}.role`)}
              </span>
            </div>

            {/* Quote / Bio statement block */}
            <div className="mt-[28px] flex items-stretch gap-[16px] lg:mt-[48px] lg:gap-[25px]">
              <span
                aria-hidden="true"
                className="w-[6px] shrink-0 rounded-full bg-indigo lg:w-[9px]"
              />
              <p className="max-w-[620px] text-[15px] leading-[24px] font-medium text-[#f1f2fc] lg:text-[22px] lg:leading-[40px]">
                {t(`members.${currentKey}.bio`)}
              </p>
            </div>
          </div>

          {/* Desktop Controls (Under the left column, matching Figma desktop) */}
          <div className="hidden lg:flex mt-[48px] w-full max-w-[620px] justify-center">
            {renderControls()}
          </div>
        </div>

        {/* Right Column: Watermark background + Photo + Mobile Controls */}
        <div className="reveal relative mt-[12px] flex flex-col items-end justify-end lg:mt-0 lg:col-span-5">
          {/* Watermark logo: on mobile positioned on the left-center so its circle sits behind the member's right arm and its apex aligns with the member's head */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute start-[10%] sm:start-[12%] top-[65px] sm:top-[40px] -z-10 w-[54%] max-w-[215px] text-[#6078da]/25 lg:start-auto lg:end-[-40px] lg:top-[-40px] lg:w-[476px] lg:text-[#6078da]/30"
          >
            <TeamWatermark className="h-auto w-full" />
          </div>

          {/* High-res member photo with smooth fade transition */}
          <div
            className={`relative -mt-[25px] sm:-mt-[35px] lg:mt-0 w-[134%] max-w-none -me-[30%] sm:w-[110%] sm:-me-[8%] lg:w-full lg:max-w-[540px] xl:max-w-[600px] lg:ms-auto lg:me-0 transition-opacity duration-300 ease-in-out ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            <Image
              src={currentMember.image}
              alt={t(`members.${currentKey}.name`)}
              width={1200}
              height={1214}
              priority
              className="h-auto w-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
              sizes="(max-width: 640px) 480px, (max-width: 1024px) 480px, 600px"
            />
          </div>

          {/* Mobile Controls: clean bare indicators (NO box, NO border) centered horizontally across mobile viewport */}
          <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 z-20 lg:hidden">
            {renderControls()}
          </div>
        </div>
      </div>
    </div>
  );
}
