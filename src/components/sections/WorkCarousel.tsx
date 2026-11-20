"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";

import type { Project } from "@/lib/content/database";
import { imageUrl } from "@/lib/content/presentation";

type Slot = "left" | "center" | "right" | "back";

/* ------------------------------------------------------------------------- */
/* Slot geometry & styling specifications                                    */
/* ------------------------------------------------------------------------- */

type Box = { x: number; y: number; w: number; h: number };

type DesktopSlotSpec = {
  card: Box;
  z: number;
  radius: number;
  bg: string;
  border: string;
  image: Box;
  imageRadius: number;
  title: { x: number; y: number };
  desc?: { x: number; y: number };
  button?: { x: number; y: number; size: number };
};

const DESKTOP: Record<Slot, DesktopSlotSpec> = {
  left: {
    card: { x: 289, y: 62, w: 267, h: 385 },
    z: 1,
    radius: 22,
    bg: "linear-gradient(160deg, #22184e 0%, #140f31 100%)",
    border: "rgba(160, 140, 240, 0.28)",
    image: { x: 12, y: 12, w: 243, h: 280 },
    imageRadius: 16,
    title: { x: 20, y: 312 },
  },
  center: {
    card: { x: 538, y: 0, w: 552, h: 499 },
    z: 3,
    radius: 28,
    bg: "linear-gradient(165deg, #2e216e 0%, #191444 65%, #100d2e 100%)",
    border: "rgba(180, 160, 255, 0.5)",
    image: { x: 18, y: 18, w: 516, h: 335 },
    imageRadius: 20,
    title: { x: 32, y: 374 },
    desc: { x: 32, y: 418 },
    button: { x: 462, y: 405, size: 52 },
  },
  right: {
    card: { x: 1041, y: 54, w: 290, h: 390 },
    z: 2,
    radius: 22,
    bg: "linear-gradient(160deg, #261d56 0%, #151136 100%)",
    border: "rgba(160, 140, 240, 0.3)",
    image: { x: 12, y: 12, w: 266, h: 285 },
    imageRadius: 16,
    title: { x: 24, y: 315 },
    button: { x: 226, y: 318, size: 48 },
  },
  back: {
    card: { x: 736, y: 70, w: 200, h: 320 },
    z: 0,
    radius: 18,
    bg: "linear-gradient(160deg, #18113a 0%, #0d0a22 100%)",
    border: "rgba(120, 100, 200, 0.15)",
    image: { x: 10, y: 10, w: 180, h: 220 },
    imageRadius: 14,
    title: { x: 16, y: 250 },
  },
};
const DESKTOP_CANVAS = { w: 1672, h: 499, contentX: 289, contentW: 1042 };

/** Mobile (176:833 ÷ 2) — 426.5px canvas, stage top = y 407. */
type MobileSlot = {
  card: Box;
  z: number;
  radius: number;
  bg: string;
  border: string;
  image: Box;
  imageRadius: number;
  title: { x: number; y: number };
  desc?: { x: number; y: number };
  button?: { x: number; y: number; size: number };
};

const MOBILE: Record<Slot, MobileSlot> = {
  left: {
    card: { x: 9.5, y: 24.5, w: 118, h: 213 },
    z: 1,
    radius: 18,
    bg: "#321f61",
    border: "rgb(170 141 252 / 0.7)",
    image: { x: 8, y: 8, w: 102, h: 145 },
    imageRadius: 14,
    title: { x: 10, y: 168 },
  },
  center: {
    card: { x: 94, y: 0, w: 227.5, h: 282.5 },
    z: 3,
    radius: 24,
    bg: "#2b1f68",
    border: "#ab96f9",
    image: { x: 8, y: 8, w: 211.5, h: 178 },
    imageRadius: 18,
    title: { x: 12, y: 198 },
    desc: { x: 12, y: 224 },
    button: { x: 183.5, y: 220, size: 32 },
  },
  right: {
    card: { x: 302, y: 27, w: 104.5, h: 209 },
    z: 2,
    radius: 18,
    bg: "#362e78",
    border: "rgb(170 167 255 / 0.7)",
    image: { x: 8, y: 8, w: 88.5, h: 145 },
    imageRadius: 14,
    title: { x: 12, y: 168 },
  },
  back: {
    card: { x: 173, y: 35, w: 80, h: 160 },
    z: 0,
    radius: 14,
    bg: "#201440",
    border: "rgb(130 100 200 / 0.3)",
    image: { x: 6, y: 6, w: 68, h: 110 },
    imageRadius: 10,
    title: { x: 8, y: 125 },
  },
};
const MOBILE_CANVAS = { w: 426.5, h: 282.5 };

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 750;
const transition = (props: string[]) =>
  props.map((p) => `${p} ${DURATION}ms ${EASE}`).join(", ");

function slotFor(i: number, active: number, total: number): Slot {
  const offset = (i - active + total) % total;
  if (offset === 0) return "center";
  if (offset === 1) return "right";
  if (offset === total - 1) return "left";
  return "back";
}

/* ------------------------------------------------------------------------- */

export function WorkCarousel({ projects }: { projects: Project[] }) {
  const t = useTranslations("Work");
  const [selected, setActive] = useState(0);
  const total = projects.length;
  const active = selected % total;
  const go = useCallback((delta: number) => setActive((a) => (a + delta + total) % total), [total]);

  // Infinite loop auto-advance every 3 seconds
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    if (isHovered || total < 2) return;
    const interval = setInterval(() => {
      go(1);
    }, 3000);
    return () => clearInterval(interval);
  }, [go, isHovered, total]);

  // Scale fixed geometry to available container width
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState({ desktop: 1, mobile: 1 });
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale({
        desktop: Math.min(1, (w - 48) / DESKTOP_CANVAS.contentW),
        mobile: Math.min(1, w / MOBILE_CANVAS.w),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Touch & Swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMoved = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 10) touchMoved.current = true;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(dx) > 22 && Math.abs(dx) > Math.abs(dy) * 0.6) {
      go(dx < 0 ? 1 : -1);
    }
    setTimeout(() => {
      touchMoved.current = false;
    }, 50);
  };

  // Mouse drag support
  const mouseStartX = useRef<number | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const dx = e.clientX - mouseStartX.current;
    mouseStartX.current = null;
    if (Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const current = projects[active];

  if (!current) return null;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("carouselLabel")}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <p aria-live="polite" className="sr-only">
        {t("slideStatus", { name: current.name, index: active + 1, total })}
      </p>

      {/* ---------- Mobile stage ---------- */}
      <div
        className="relative touch-pan-y select-none lg:hidden cursor-grab active:cursor-grabbing"
        style={{ height: MOBILE_CANVAS.h * scale.mobile }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div
          className="absolute top-0 left-1/2"
          style={{
            width: MOBILE_CANVAS.w,
            height: MOBILE_CANVAS.h,
            transform: `translateX(-50%) scale(${scale.mobile})`,
            transformOrigin: "top center",
          }}
        >
          {projects.map((p, i) => {
            const slot = slotFor(i, active, total);
            const s = MOBILE[slot];
            const isCenter = slot === "center";

            const isVisualLeft = slot === "left";
            const isVisualRight = slot === "right";
            const mobileTransform = isCenter
              ? "perspective(600px) rotateY(0deg)"
              : isVisualLeft
              ? "perspective(600px) rotateY(12deg)"
              : isVisualRight
              ? "perspective(600px) rotateY(-12deg)"
              : "perspective(600px) rotateY(0deg) scale(0.85)";

            return (
              <article
                key={p.id}
                aria-hidden={!isCenter}
                onClick={() => {
                  if (touchMoved.current) return;
                  if (isCenter) {
                    window.open(p.url, "_blank", "noopener,noreferrer");
                  } else {
                    setActive(i);
                  }
                }}
                className={`absolute cursor-pointer overflow-hidden transition-all ${
                  isCenter
                    ? "shadow-[0_14px_30px_-8px_rgba(0,0,0,0.38)]"
                    : "shadow-[0_10px_22px_-8px_rgba(0,0,0,0.25)]"
                }`}
                style={{
                  left: s.card.x,
                  top: s.card.y,
                  width: s.card.w,
                  height: s.card.h,
                  zIndex: s.z,
                  transform: mobileTransform,
                  transformOrigin: "center center",
                  borderRadius: s.radius,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  opacity: slot === "back" ? 0 : 1,
                  pointerEvents: slot === "back" ? "none" : "auto",
                  transition: transition(["left", "top", "width", "height", "border-radius", "background-color", "border-color", "z-index", "filter", "opacity", "transform", "box-shadow"]),
                  filter: isCenter ? "none" : "brightness(0.85)",
                }}
              >
                {/* Curved Thumbnail Preview */}
                <div
                  className="absolute overflow-hidden border border-white/10"
                  style={{
                    left: s.image.x,
                    top: s.image.y,
                    width: s.image.w,
                    height: s.image.h,
                    borderRadius: s.imageRadius,
                    transition: transition(["left", "top", "width", "height", "border-radius"]),
                  }}
                >
                  <Image
                    src={imageUrl(p.image_path)}
                    alt={p.name}
                    fill
                    sizes="227px"
                    className="object-cover object-top"
                    draggable={false}
                  />
                </div>

                <CardText
                  slot={slot}
                  title={p.name}
                  description={p.description}
                  url={p.url}
                  variant="mobile"
                  specTitle={s.title}
                  specDesc={s.desc}
                  specBtn={s.button}
                />
              </article>
            );
          })}
        </div>
      </div>

      {/* ---------- Desktop stage ---------- */}
      <div
        className="relative hidden select-none lg:block"
        style={{ height: DESKTOP_CANVAS.h * scale.desktop }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div
          className="absolute top-0 left-1/2"
          style={{
            width: DESKTOP_CANVAS.w,
            height: DESKTOP_CANVAS.h,
            transform: `translateX(-50%) scale(${scale.desktop})`,
            transformOrigin: "top center",
          }}
        >
          {projects.map((p, i) => {
            const slot = slotFor(i, active, total);
            const s = DESKTOP[slot];
            const isCenter = slot === "center";

            const isVisualLeft = slot === "left";
            const isVisualRight = slot === "right";
            const desktopTransform = isCenter
              ? "perspective(1100px) rotateY(0deg)"
              : isVisualLeft
              ? "perspective(1100px) rotateY(16deg)"
              : isVisualRight
              ? "perspective(1100px) rotateY(-16deg)"
              : "perspective(1100px) rotateY(0deg) scale(0.85)";

            return (
              <article
                key={p.id}
                aria-hidden={!isCenter}
                onClick={() => {
                  if (isCenter) {
                    window.open(p.url, "_blank", "noopener,noreferrer");
                  } else {
                    setActive(i);
                  }
                }}
                className={`group absolute cursor-pointer overflow-hidden backdrop-blur-md transition-all ${
                  isCenter
                    ? "shadow-[0_20px_45px_-12px_rgba(0,0,0,0.38)] hover:shadow-[0_25px_50px_-10px_rgba(80,50,220,0.35)] hover:border-[#c5b5ff]"
                    : "shadow-[0_16px_36px_-12px_rgba(0,0,0,0.28)] hover:brightness-105"
                }`}
                style={{
                  left: s.card.x,
                  top: s.card.y,
                  width: s.card.w,
                  height: s.card.h,
                  zIndex: s.z,
                  transform: desktopTransform,
                  transformOrigin: "center center",
                  borderRadius: s.radius,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  opacity: slot === "back" ? 0 : 1,
                  pointerEvents: slot === "back" ? "none" : "auto",
                  transition: transition(["left", "top", "width", "height", "z-index", "filter", "border-color", "box-shadow", "opacity", "transform"]),
                  filter: isCenter ? "none" : "brightness(0.82) saturate(0.9)",
                }}
              >
                {/* Curved Thumbnail Preview */}
                <div
                  className="absolute overflow-hidden border border-white/10 bg-black/40 shadow-inner"
                  style={{
                    left: s.image.x,
                    top: s.image.y,
                    width: s.image.w,
                    height: s.image.h,
                    borderRadius: s.imageRadius,
                    transition: transition(["left", "top", "width", "height", "border-radius"]),
                  }}
                >
                  <Image
                    src={imageUrl(p.image_path)}
                    alt={p.name}
                    fill
                    sizes="552px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    draggable={false}
                    priority={isCenter}
                  />
                  {/* Subtle dark overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
                </div>

                <CardText
                  slot={slot}
                  title={p.name}
                  description={p.description}
                  url={p.url}
                  variant="desktop"
                  specTitle={s.title}
                  specDesc={s.desc}
                  specBtn={s.button}
                />
              </article>
            );
          })}
        </div>
      </div>

      {/* Desktop Navigation Controls (matching Figma x:697 y:877) */}
      {total > 1 && (
        <div className="mt-8 hidden items-center justify-center gap-6 lg:flex">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t("previous")}
            className="flex size-9 cursor-pointer items-center justify-center text-white/70 transition-colors hover:text-white active:scale-95"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex max-w-[65%] items-center gap-2.5 overflow-x-auto py-1">
            {projects.map((project, idx) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActive(idx)}
                aria-label={t("goTo", { name: project.name })}
                className={`shrink-0 cursor-pointer rounded-full transition-all duration-300 ${
                  idx === active
                    ? "h-2 w-2.5 scale-125 bg-[#ab96f9] shadow-[0_0_10px_rgba(171,150,249,0.8)]"
                    : "h-2 w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t("next")}
            className="flex size-9 cursor-pointer items-center justify-center text-white/70 transition-colors hover:text-white active:scale-95"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */

function CardText({
  slot,
  title,
  description,
  url,
  variant,
  specTitle,
  specDesc,
  specBtn,
}: {
  slot: Slot;
  title: string;
  description: string;
  url: string;
  variant: "mobile" | "desktop";
  specTitle: { x: number; y: number };
  specDesc?: { x: number; y: number };
  specBtn?: { x: number; y: number; size: number };
}) {
  const desktop = variant === "desktop";
  const center = slot === "center";

  const fade = (visible: boolean): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transition: `opacity ${visible ? 450 : 200}ms ease ${visible ? DURATION * 0.45 : 0}ms`,
    pointerEvents: visible ? "auto" : "none",
  });

  return (
    <>
      <h3
        className={
          "absolute font-bold tracking-tight text-white transition-all " +
          (desktop
            ? center
              ? "text-[26px] leading-[34px]"
              : "text-[20px] leading-[28px] text-[#e0ddfc]"
            : center
              ? "text-[16px] leading-[22px]"
              : "text-[13px] leading-[18px] text-[#ded9fb]")
        }
        style={{
          left: specTitle.x,
          top: specTitle.y,
          transition: transition(["left", "top", "font-size", "line-height"]),
        }}
      >
        {title}
      </h3>

      {specDesc && (
        <p
          className={
            "absolute whitespace-pre-line text-[#cfd3ea] transition-all " +
            (desktop
              ? "max-w-[340px] text-[15px] leading-[22px]"
              : "max-w-[160px] text-[11px] leading-[15px]")
          }
          style={{
            left: specDesc.x,
            top: specDesc.y,
            ...fade(center),
          }}
        >
          {description}
        </p>
      )}

      {specBtn && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${title}`}
          className={
            "absolute flex items-center justify-center rounded-full transition-all duration-300 " +
            (desktop
              ? "border border-white/30 bg-white/10 text-white hover:scale-110 hover:border-white hover:bg-brand/80 hover:shadow-[0_0_20px_rgba(70,51,255,0.7)]"
              : "border border-white/20 bg-white/10 text-white active:scale-95")
          }
          style={{
            left: specBtn.x,
            top: specBtn.y,
            width: specBtn.size,
            height: specBtn.size,
            ...fade(Boolean(specBtn)),
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: "48%",
              height: "48%",
              strokeWidth: 2.2,
            }}
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      )}
    </>
  );
}
