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
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);

  // Exactly 3 dots matching Figma design
  const totalDots = 3;

  const currentMember = TEAM_MEMBERS[displayedIndex % TEAM_MEMBERS.length];
  const currentKey = currentMember.key;

  const outgoingMember =
    outgoingIndex !== null
      ? TEAM_MEMBERS[outgoingIndex % TEAM_MEMBERS.length]
      : null;
  const outgoingKey = outgoingMember ? outgoingMember.key : null;

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const changeSlide = useCallback(
    (nextIdx: number, dir?: "next" | "prev") => {
      if (nextIdx === displayedIndex || outgoingIndex !== null) return;
      const determinedDir =
        dir ?? (nextIdx > displayedIndex ? "next" : "prev");
      setDirection(determinedDir);
      setOutgoingIndex(displayedIndex);
      setDisplayedIndex(nextIdx);

      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setOutgoingIndex(null);
      }, 480);
    },
    [displayedIndex, outgoingIndex]
  );

  const handlePrev = useCallback(() => {
    changeSlide((displayedIndex - 1 + totalDots) % totalDots, "prev");
  }, [displayedIndex, changeSlide]);

  const handleNext = useCallback(() => {
    changeSlide((displayedIndex + 1) % totalDots, "next");
  }, [displayedIndex, changeSlide]);

  // Autoplay automation: smoothly rotates every 5 seconds, pauses on hover/interaction
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      changeSlide((displayedIndex + 1) % totalDots, "next");
    }, 5000);

    return () => clearInterval(interval);
  }, [displayedIndex, isPaused, changeSlide]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
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
          const isActive = idx === displayedIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() =>
                changeSlide(idx, idx > displayedIndex ? "next" : "prev")
              }
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

  const isAnimating = outgoingIndex !== null;

  // Animation class helper for text:
  // Next: Outgoing exits left (blue arrow), Incoming enters from right (red arrow)
  // Prev: Outgoing exits right, Incoming enters from left
  const getTextAnimationClass = (isOutgoing: boolean) => {
    if (!isAnimating) return "opacity-100 transform-none";
    if (isOutgoing) {
      return direction === "next"
        ? "anim-team-text-exit-left pointer-events-none"
        : "anim-team-text-exit-right pointer-events-none";
    }
    return direction === "next"
      ? "anim-team-text-enter-right"
      : "anim-team-text-enter-left";
  };

  // Animation class helper for photo (Opposite direction!):
  // Next: Outgoing exits right (blue arrow), Incoming enters from left (red arrow)
  // Prev: Outgoing exits left, Incoming enters from right
  const getPhotoAnimationClass = (isOutgoing: boolean) => {
    if (!isAnimating) return "opacity-100 transform-none";
    if (isOutgoing) {
      return direction === "next"
        ? "anim-team-photo-exit-right pointer-events-none"
        : "anim-team-photo-exit-left pointer-events-none";
    }
    return direction === "next"
      ? "anim-team-photo-enter-left"
      : "anim-team-photo-enter-right";
  };

  const renderTextContent = (key: string, isOutgoing: boolean) => (
    <div
      key={isOutgoing ? `out-${outgoingIndex}` : `in-${displayedIndex}`}
      className={`col-start-1 row-start-1 flex flex-col items-start ${getTextAnimationClass(
        isOutgoing
      )}`}
    >
      <h2 className="text-[36.5px] leading-[45.6px] font-bold text-[#fcfcff] lg:text-[72px] lg:leading-[81.4px]">
        {t(`members.${key}.name`)}
      </h2>

      {/* Role badge with gradient */}
      <div className="mt-[18px] lg:mt-[32px]">
        <span className="inline-flex items-center justify-center rounded-[9px] bg-gradient-to-r from-[#617af5] to-[#798aff] px-[21px] py-[6px] text-[18px] leading-[22.5px] font-bold text-white shadow-sm lg:rounded-[14px] lg:px-[28px] lg:py-[10px] lg:text-[32px] lg:leading-[37.3px]">
          {t(`members.${key}.role`)}
        </span>
      </div>

      {/* Quote / Bio statement block */}
      <div className="mt-[28px] flex items-stretch gap-[16px] lg:mt-[48px] lg:gap-[25px]">
        <span
          aria-hidden="true"
          className="w-[6px] shrink-0 rounded-full bg-indigo lg:w-[9px]"
        />
        <p className="max-w-[620px] text-[15px] leading-[24px] font-medium text-[#f1f2fc] lg:text-[22px] lg:leading-[40px]">
          {t(`members.${key}.bio`)}
        </p>
      </div>
    </div>
  );

  const renderPhotoContent = (
    member: { key: string; image: string },
    isOutgoing: boolean
  ) => (
    <div
      key={isOutgoing ? `out-photo-${outgoingIndex}` : `in-photo-${displayedIndex}`}
      className={`col-start-1 row-start-1 w-full ${getPhotoAnimationClass(
        isOutgoing
      )}`}
    >
      <Image
        src={member.image}
        alt={t(`members.${member.key}.name`)}
        width={1200}
        height={1214}
        priority
        className="h-auto w-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
        sizes="(max-width: 640px) 480px, (max-width: 1024px) 480px, 600px"
      />
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
      {/* Embedded scoped animation keyframes for simultaneous opposite-directional parallax transition */}
      <style jsx global>{`
        @keyframes teamTextExitLeft {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-40px);
            opacity: 0;
          }
        }
        @keyframes teamTextEnterRight {
          0% {
            transform: translateX(40px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes teamTextExitRight {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(40px);
            opacity: 0;
          }
        }
        @keyframes teamTextEnterLeft {
          0% {
            transform: translateX(-40px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes teamPhotoExitRight {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(50px);
            opacity: 0;
          }
        }
        @keyframes teamPhotoEnterLeft {
          0% {
            transform: translateX(-50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes teamPhotoExitLeft {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-50px);
            opacity: 0;
          }
        }
        @keyframes teamPhotoEnterRight {
          0% {
            transform: translateX(50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .anim-team-text-exit-left {
          animation: teamTextExitLeft 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-text-enter-right {
          animation: teamTextEnterRight 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-text-exit-right {
          animation: teamTextExitRight 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-text-enter-left {
          animation: teamTextEnterLeft 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-team-photo-exit-right {
          animation: teamPhotoExitRight 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-photo-enter-left {
          animation: teamPhotoEnterLeft 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-photo-exit-left {
          animation: teamPhotoExitLeft 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-photo-enter-right {
          animation: teamPhotoEnterRight 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="grid grid-cols-1 items-end lg:grid-cols-12 lg:gap-x-[48px]">
        {/* Left Column: Details & Bio + Desktop Controls */}
        <div className="reveal flex flex-col items-start pb-[20px] lg:col-span-7 lg:pb-[56px]">
          {/* Stacked grid for simultaneous text cross-transition */}
          <div className="grid grid-cols-1 grid-rows-1 w-full">
            {outgoingKey && renderTextContent(outgoingKey, true)}
            {renderTextContent(currentKey, false)}
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

          {/* High-res member photo container with stacked grid for simultaneous opposite-direction transition */}
          <div className="relative -mt-[25px] sm:-mt-[35px] lg:mt-0 w-[134%] max-w-none -me-[30%] sm:w-[110%] sm:-me-[8%] lg:w-full lg:max-w-[540px] xl:max-w-[600px] lg:ms-auto lg:me-0">
            <div className="grid grid-cols-1 grid-rows-1 w-full">
              {outgoingMember && renderPhotoContent(outgoingMember, true)}
              {renderPhotoContent(currentMember, false)}
            </div>
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
