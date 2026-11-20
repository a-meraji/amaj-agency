"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { TeamWatermark } from "@/components/icons/brand";

import type { StaffMember } from "@/lib/content/database";
import { imageUrl } from "@/lib/content/presentation";

export function TeamCarousel({ members }: { members: StaffMember[] }) {
  const t = useTranslations("Team");
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const totalMembers = members.length;
  const currentMember = members[displayedIndex] ?? members[0];
  const outgoingMember = outgoingIndex === null ? null : members[outgoingIndex];

  // Refs for stable, non-stale callbacks across wheel, touch, and scroll listeners
  const displayedIndexRef = useRef(0);
  const outgoingIndexRef = useRef<number | null>(null);

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const changeSlide = useCallback(
    (nextIdx: number, dir?: "next" | "prev") => {
      const current = displayedIndexRef.current;
      if (nextIdx === current || outgoingIndexRef.current !== null) return;
      const determinedDir =
        dir ?? (nextIdx > current ? "next" : "prev");
      outgoingIndexRef.current = current;
      displayedIndexRef.current = nextIdx;
      setDirection(determinedDir);
      setOutgoingIndex(current);
      setDisplayedIndex(nextIdx);

      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        outgoingIndexRef.current = null;
        setOutgoingIndex(null);
      }, 550);
    },
    []
  );

  // Scroll-based member switching controller
  useEffect(() => {
    const section = document.getElementById("team");
    if (!section || totalMembers < 2) return;

    let ticking = false;
    let prevProgress = 0;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        // The scrollable track distance
        const scrollDistance = rect.height - window.innerHeight;

        if (scrollDistance > 40) {
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));

          const slideProgress = Math.max(0, Math.min(1, (progress - 0.15) / 0.7));
          const targetIndex = Math.round(slideProgress * (totalMembers - 1));

          if (targetIndex !== displayedIndexRef.current && outgoingIndexRef.current === null) {
            const dir = progress > prevProgress ? "next" : "prev";
            changeSlide(targetIndex, dir);
          }
          prevProgress = progress;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial check
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [changeSlide, totalMembers]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  // Instant single-scroll mouse wheel controller
  const isCooldownRef = useRef(false);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const section = document.getElementById("team");
    if (!section || totalMembers < 2) return;

    const onWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      // Section is active when in viewport
      const isPinned = rect.top <= 35 && rect.bottom >= window.innerHeight - 35;
      if (!isPinned) return;

      // Ignore micro noise
      if (Math.abs(e.deltaY) < 14) return;

      const currentIdx = displayedIndexRef.current;

      if (isCooldownRef.current) {
        if (
          (e.deltaY > 0 && currentIdx < totalMembers - 1) ||
          (e.deltaY < 0 && currentIdx > 0)
        ) {
          e.preventDefault();
        }
        return;
      }

      if (e.deltaY > 0) {
        // Scroll DOWN -> Next member
        if (currentIdx < totalMembers - 1) {
          e.preventDefault();
          isCooldownRef.current = true;
          if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
          cooldownTimerRef.current = setTimeout(() => {
            isCooldownRef.current = false;
          }, 500);

          const nextIdx = currentIdx + 1;
          changeSlide(nextIdx, "next");

          // Sync page scroll progress
          const scrollDistance = rect.height - window.innerHeight;
          const ratio = nextIdx / (totalMembers - 1);
          const targetY = window.scrollY + rect.top + (0.15 + ratio * 0.7) * scrollDistance;
          window.scrollTo({ top: targetY, behavior: "instant" });
        }
        // If at the last member (currentIdx === totalMembers - 1),
        // let standard scroll continue naturally into #testimonials
      } else if (e.deltaY < 0) {
        // Scroll UP -> Previous member
        if (currentIdx > 0) {
          e.preventDefault();
          isCooldownRef.current = true;
          if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
          cooldownTimerRef.current = setTimeout(() => {
            isCooldownRef.current = false;
          }, 500);

          const prevIdx = currentIdx - 1;
          changeSlide(prevIdx, "prev");

          const scrollDistance = rect.height - window.innerHeight;
          const ratio = prevIdx / (totalMembers - 1);
          const targetY = window.scrollY + rect.top + (0.15 + ratio * 0.7) * scrollDistance;
          window.scrollTo({ top: targetY, behavior: "instant" });
        }
        // If at the first member (currentIdx === 0),
        // let standard scroll continue naturally up into #work
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, [totalMembers, changeSlide]);

  // Touch gesture controller on mobile: small swipe triggers instant member transition
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCooldownRef = useRef(false);
  const touchCooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    if (touchCooldownRef.current) return;

    const section = document.getElementById("team");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const isPinned = rect.top <= 45 && rect.bottom >= window.innerHeight - 45;
    if (!isPinned) return;

    const dy = e.touches[0].clientY - touchStartY.current;
    const dx = e.touches[0].clientX - touchStartX.current;

    const currentIdx = displayedIndexRef.current;

    // Small vertical scroll threshold (20px) on mobile
    if (Math.abs(dy) > 20 && Math.abs(dy) >= Math.abs(dx)) {
      if (dy < 0) {
        // Swipe UP (scroll down to next member)
        if (currentIdx < totalMembers - 1) {
          touchCooldownRef.current = true;
          touchStartY.current = e.touches[0].clientY;
          touchStartX.current = e.touches[0].clientX;

          const nextIdx = currentIdx + 1;
          changeSlide(nextIdx, "next");

          const scrollDistance = rect.height - window.innerHeight;
          const ratio = nextIdx / (totalMembers - 1);
          const targetY = window.scrollY + rect.top + (0.15 + ratio * 0.7) * scrollDistance;
          window.scrollTo({ top: targetY, behavior: "instant" });

          if (touchCooldownTimerRef.current) clearTimeout(touchCooldownTimerRef.current);
          touchCooldownTimerRef.current = setTimeout(() => {
            touchCooldownRef.current = false;
          }, 500);
        }
      } else if (dy > 0) {
        // Swipe DOWN (scroll up to previous member)
        if (currentIdx > 0) {
          touchCooldownRef.current = true;
          touchStartY.current = e.touches[0].clientY;
          touchStartX.current = e.touches[0].clientX;

          const prevIdx = currentIdx - 1;
          changeSlide(prevIdx, "prev");

          const scrollDistance = rect.height - window.innerHeight;
          const ratio = prevIdx / (totalMembers - 1);
          const targetY = window.scrollY + rect.top + (0.15 + ratio * 0.7) * scrollDistance;
          window.scrollTo({ top: targetY, behavior: "instant" });

          if (touchCooldownTimerRef.current) clearTimeout(touchCooldownTimerRef.current);
          touchCooldownTimerRef.current = setTimeout(() => {
            touchCooldownRef.current = false;
          }, 500);
        }
      }
    } else if (Math.abs(dx) > 30) {
      // Horizontal swipe support
      touchCooldownRef.current = true;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;

      if (dx < 0 && currentIdx < totalMembers - 1) {
        changeSlide(currentIdx + 1, "next");
      } else if (dx > 0 && currentIdx > 0) {
        changeSlide(currentIdx - 1, "prev");
      }

      if (touchCooldownTimerRef.current) clearTimeout(touchCooldownTimerRef.current);
      touchCooldownTimerRef.current = setTimeout(() => {
        touchCooldownRef.current = false;
      }, 500);
    }
  };

  const onTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleScrollToTestimonials = () => {
    const el = document.getElementById("testimonials");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderControls = () => totalMembers > 1 && (
    <div
      role="group"
      aria-label={t("eyebrow")}
      className="flex max-w-full items-center gap-[10px] overflow-x-auto lg:gap-[14px]"
    >
      {members.map((member, idx) => {
        const isActive = idx === displayedIndex;
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => {
              changeSlide(idx, idx > displayedIndex ? "next" : "prev");
              const section = document.getElementById("team");
              if (section) {
                const rect = section.getBoundingClientRect();
                const scrollRange = rect.height - window.innerHeight;
                const ratio = totalMembers > 1 ? idx / (totalMembers - 1) : 0;
                const targetY = window.scrollY + rect.top + (0.15 + ratio * 0.7) * scrollRange;
                window.scrollTo({ top: targetY, behavior: "smooth" });
              }
            }}
            aria-label={member.name}
            aria-current={isActive}
            className="flex min-h-[36px] min-w-[26px] cursor-pointer items-center justify-center p-1.5 focus-visible:outline-none"
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

  const renderTextContent = (member: StaffMember, isOutgoing: boolean) => (
    <div
      key={isOutgoing ? `out-${outgoingIndex}` : `in-${displayedIndex}`}
      className={`col-start-1 row-start-1 flex flex-col items-start ${getTextAnimationClass(
        isOutgoing
      )}`}
    >
      <h2 className="text-[36.5px] leading-[45.6px] font-bold text-[#fcfcff] lg:text-[72px] lg:leading-[81.4px]">
        {member.name}
      </h2>

      {/* Role badge with gradient */}
      <div className="mt-[18px] lg:mt-[28px] xl:mt-[46px]">
        <span className="inline-flex items-center justify-center rounded-[9px] bg-gradient-to-r from-[#617af5] to-[#798aff] px-[21px] py-[6px] text-[18px] leading-[22.5px] font-bold text-white shadow-sm lg:rounded-[14px] lg:px-[26px] lg:py-[8px] xl:px-[28px] xl:py-[10px] lg:text-[26px] lg:leading-[32px] xl:text-[32px] xl:leading-[37.3px]">
          {member.role}
        </span>
      </div>

      {/* Quote / Bio statement block */}
      <div className="mt-[24px] flex items-stretch gap-[16px] lg:mt-[32px] xl:mt-[52px] lg:gap-[25px]">
        <span
          aria-hidden="true"
          className="w-[6px] shrink-0 rounded-full bg-[#6a84ff] lg:w-[9px]"
        />
        <p className="max-w-[620px] text-[15px] leading-[24px] font-medium text-[#f1f2fc] lg:max-w-[730px] lg:text-[20px] lg:leading-[36px] xl:text-[24px] xl:leading-[45px]">
          {member.bio}
        </p>
      </div>
    </div>
  );

  const renderPhotoContent = (
    member: StaffMember,
    isOutgoing: boolean
  ) => (
    <div
      key={isOutgoing ? `out-photo-${outgoingIndex}` : `in-photo-${displayedIndex}`}
      className={`col-start-1 row-start-1 w-full flex items-end justify-end ${getPhotoAnimationClass(
        isOutgoing
      )}`}
    >
      <Image
        src={imageUrl(member.image_path)}
        alt=""
        width={1200}
        height={1214}
        priority
        className="block h-auto w-full max-w-none lg:w-[920px] xl:w-[1034px] lg:h-[940px] xl:h-[1046px] object-cover object-top drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] [mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.25)_80%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,black_45%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,0.25)_80%,transparent_92%)] lg:[mask-image:linear-gradient(to_bottom,black_52%,rgba(0,0,0,0.85)_64%,rgba(0,0,0,0.3)_76%,transparent_88%)] lg:[-webkit-mask-image:linear-gradient(to_bottom,black_52%,rgba(0,0,0,0.85)_64%,rgba(0,0,0,0.3)_76%,transparent_88%)]"
        sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1034px"
      />
    </div>
  );

  const renderScrollDownButton = () => (
    <button
      type="button"
      onClick={handleScrollToTestimonials}
      aria-label={t("scrollToTestimonials")}
      className="group pointer-events-auto flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <div className="relative flex items-center justify-center w-[92px] h-[92px] sm:w-[98px] sm:h-[98px] lg:w-[106px] lg:h-[106px]">
        {/* Curved SVG Text along the upper arc of the circle */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <path
              id="teamScrollTextArc"
              d="M 10 48 A 42 42 0 0 1 90 48"
              fill="none"
            />
          </defs>
          <text>
            <textPath
              href="#teamScrollTextArc"
              startOffset="50%"
              textAnchor="middle"
              className="fill-[#b2c4ff] text-[8px] sm:text-[8.5px] lg:text-[9px] font-bold tracking-[0.22em] uppercase transition-colors duration-300 group-hover:fill-white drop-shadow-[0_2px_8px_rgba(70,51,255,0.45)]"
              style={{ letterSpacing: "0.22em" }}
            >
              {t("scrollPrompt")}
            </textPath>
          </text>
        </svg>

        {/* Central circular glass button */}
        <div className="flex h-[52px] w-[52px] sm:h-[56px] sm:w-[56px] lg:h-[60px] lg:w-[60px] items-center justify-center rounded-full border border-[#748bd4]/60 bg-[#121c3d]/90 shadow-xl shadow-[#09122f]/80 backdrop-blur-md transition-all duration-300 group-hover:border-indigo group-hover:bg-[#1a2858] group-hover:shadow-[0_0_28px_rgba(99,102,241,0.6)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#9eb4ff] transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-white animate-bounce"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </button>
  );

  if (!currentMember) return null;

  return (
    <div
      className="relative mt-[20px] sm:mt-[24px] flex-1 flex flex-col justify-between w-full h-full touch-pan-y select-none lg:mt-[47px]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Embedded scoped animation keyframes for simultaneous opposite-directional parallax transition */}
      <style jsx global>{`
        @keyframes teamTextExitLeft {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translate3d(-60px, -20px, 0) scale(0.92);
            opacity: 0;
            filter: blur(8px);
          }
        }
        @keyframes teamTextEnterRight {
          0% {
            transform: translate3d(60px, 20px, 0) scale(0.92);
            opacity: 0;
            filter: blur(8px);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }
        @keyframes teamTextExitRight {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translate3d(60px, -20px, 0) scale(0.92);
            opacity: 0;
            filter: blur(8px);
          }
        }
        @keyframes teamTextEnterLeft {
          0% {
            transform: translate3d(-60px, 20px, 0) scale(0.92);
            opacity: 0;
            filter: blur(8px);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes teamPhotoExitUp {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translate3d(0, -80px, 0) scale(1.05);
            opacity: 0;
            filter: blur(10px);
          }
        }
        @keyframes teamPhotoEnterUp {
          0% {
            transform: translate3d(0, 100px, 0) scale(0.94);
            opacity: 0;
            filter: blur(10px);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }
        @keyframes teamPhotoExitDown {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translate3d(0, 80px, 0) scale(1.05);
            opacity: 0;
            filter: blur(10px);
          }
        }
        @keyframes teamPhotoEnterDown {
          0% {
            transform: translate3d(0, -100px, 0) scale(0.94);
            opacity: 0;
            filter: blur(10px);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        .anim-team-text-exit-left {
          animation: teamTextExitLeft 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-text-enter-right {
          animation: teamTextEnterRight 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-text-exit-right {
          animation: teamTextExitRight 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-text-enter-left {
          animation: teamTextEnterLeft 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-team-photo-exit-right {
          animation: teamPhotoExitUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-photo-enter-left {
          animation: teamPhotoEnterUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-photo-exit-left {
          animation: teamPhotoExitDown 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-team-photo-enter-right {
          animation: teamPhotoEnterDown 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="relative flex-1 flex flex-col justify-between w-full h-full lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-[48px]">
        {/* Left Column: Details & Bio */}
        <div className="reveal relative z-20 flex flex-col items-start pb-[20px] lg:col-span-7 lg:pb-0">
          {/* Stacked grid for simultaneous text cross-transition */}
          <div className="grid grid-cols-1 grid-rows-1 w-full">
            {outgoingMember && renderTextContent(outgoingMember, true)}
            {renderTextContent(currentMember, false)}
          </div>
        </div>

        {/* High-res member photo container with stacked grid for simultaneous opposite-direction transition */}
        {/* On mobile: anchored to bottom flush with fade. On desktop: grand portrait matching Figma */}
        <div className="absolute bottom-0 -end-[10%] sm:end-0 w-[112%] sm:w-[95%] max-w-[420px] pointer-events-none z-10 lg:w-[920px] xl:w-[1034px] lg:h-[940px] xl:h-[1046px] lg:top-[-118px] lg:bottom-auto lg:end-[-216px] xl:end-[-264px]">
          {/* Mobile watermark logo: positioned behind member head/shoulder on mobile */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute start-[10%] sm:start-[12%] top-[65px] sm:top-[40px] -z-10 w-[54%] max-w-[215px] text-[#6078da]/25 lg:hidden"
          >
            <TeamWatermark className="h-auto w-full" />
          </div>

          <div className="grid grid-cols-1 grid-rows-1 w-full">
            {outgoingMember && renderPhotoContent(outgoingMember, true)}
            {renderPhotoContent(currentMember, false)}
          </div>
        </div>

        {/* Carousel Controls: lifted on mobile for thumb reach and visibility; anchored to Figma on desktop */}
        <div className="absolute bottom-[64px] sm:bottom-[70px] lg:bottom-[-72px] xl:bottom-[-64px] left-1/2 -translate-x-1/2 z-30">
          {renderControls()}
        </div>

        {/* Prominent Circular Scroll Down Button with curved text: positioned at bottom-left matching user mark on all screens */}
        <div className="absolute bottom-[44px] lg:bottom-[28px] xl:bottom-[36px] start-1 sm:start-3 lg:start-[-75px] xl:start-[-115px] 2xl:start-[-135px] z-30">
          {renderScrollDownButton()}
        </div>
      </div>
    </div>
  );
}
