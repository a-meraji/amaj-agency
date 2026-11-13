"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";

type ProjectKey = "finly" | "nexora" | "medico";
type Slot = "left" | "center" | "right";

const PROJECTS: { key: ProjectKey; card: string; thumb: string }[] = [
  { key: "finly", card: "/images/work/finly-card.webp", thumb: "/images/work/finly.webp" },
  { key: "nexora", card: "/images/work/nexora-card.webp", thumb: "/images/work/nexora.webp" },
  { key: "medico", card: "/images/work/medico-card.webp", thumb: "/images/work/medico.webp" },
];

/* ------------------------------------------------------------------------- */
/* Slot geometry, straight from Figma (frame coordinates, stage top = 0).     */
/* ------------------------------------------------------------------------- */

type Box = { x: number; y: number; w: number; h: number };
type SlotSpec = {
  card: Box;
  z: number;
  title: { x: number; y: number };
  desc?: { x: number; y: number };
  button?: { x: number; y: number; size: number };
};

/** Desktop "03 / Portfolio carousel" (57:289) — 1672px canvas, stage top = y 258. */
const DESKTOP: Record<Slot, SlotSpec> = {
  left: { card: { x: 289, y: 62, w: 267, h: 385 }, z: 1, title: { x: 18, y: 309 } },
  center: {
    card: { x: 538, y: 0, w: 552, h: 499 },
    z: 3,
    title: { x: 40, y: 371 },
    desc: { x: 40, y: 410 },
    button: { x: 454, y: 399, size: 53 },
  },
  right: {
    card: { x: 1041, y: 54, w: 290, h: 390 },
    z: 2,
    title: { x: 86, y: 303 },
    button: { x: 238, y: 315, size: 51 },
  },
};
const DESKTOP_CANVAS = { w: 1672, h: 499, contentX: 289, contentW: 1042 };

/** Mobile (176:833 ÷ 2) — 426.5px canvas, stage top = y 407. */
type MobileSlot = SlotSpec & { image: Box; radius: number; imageRadius: string; bg: string; border: string };
const MOBILE: Record<Slot, MobileSlot> = {
  left: {
    card: { x: 9.5, y: 24.5, w: 118, h: 213 },
    z: 1,
    radius: 21,
    bg: "#3a246f",
    border: "rgb(170 141 252 / 0.9)",
    image: { x: 13, y: 15, w: 87, h: 147 },
    imageRadius: "19px",
    title: { x: 13, y: 171 },
  },
  center: {
    card: { x: 94, y: 0, w: 227.5, h: 282.5 },
    z: 3,
    radius: 27,
    bg: "#312778",
    border: "#ab96f9",
    image: { x: 1, y: 0, w: 226.5, h: 193 },
    imageRadius: "22px 22px 0 0",
    title: { x: 13, y: 193.5 },
    desc: { x: 13, y: 221.5 },
    button: { x: 183.5, y: 213, size: 30 },
  },
  right: {
    card: { x: 302, y: 27, w: 104.5, h: 209 },
    z: 2,
    radius: 21,
    bg: "#3e388e",
    border: "rgb(170 167 255 / 0.85)",
    image: { x: 5.5, y: 20, w: 83.5, h: 147.5 },
    imageRadius: "15px",
    title: { x: 26.5, y: 170 },
  },
};
const MOBILE_CANVAS = { w: 426.5, h: 282.5 };

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DURATION = 750;
const transition = (props: string[]) =>
  props.map((p) => `${p} ${DURATION}ms ${EASE}`).join(", ");

/** Slot for project i when `active` is the featured index (Figma order: left, center, right). */
function slotFor(i: number, active: number, total: number): Slot {
  const offset = (i - active + total) % total;
  return offset === 0 ? "center" : offset === 1 ? "right" : "left";
}

/* ------------------------------------------------------------------------- */

export function WorkCarousel() {
  const t = useTranslations("Work");
  const rtl = useLocale() === "fa";
  const [active, setActive] = useState(1); // Nexora featured, as designed
  const total = PROJECTS.length;
  const go = useCallback((delta: number) => setActive((a) => (a + delta + total) % total), [total]);

  // Scale the fixed-geometry stages to the available width (never above 1:1).
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

  // Touch & Swipe support (reliable for mobile browsers)
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
    if (Math.abs(dx) > 10) {
      touchMoved.current = true;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Horizontal swipe: threshold 22px and predominantly horizontal
    if (Math.abs(dx) > 22 && Math.abs(dx) > Math.abs(dy) * 0.6) {
      go((dx < 0 ? 1 : -1) * (rtl ? -1 : 1));
    }
    setTimeout(() => {
      touchMoved.current = false;
    }, 50);
  };

  // Mouse drag support for desktop
  const mouseStartX = useRef<number | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const dx = e.clientX - mouseStartX.current;
    mouseStartX.current = null;
    if (Math.abs(dx) > 40) {
      go((dx < 0 ? 1 : -1) * (rtl ? -1 : 1));
    }
  };

  const name = (key: ProjectKey) => t(`projects.${key}.name`);
  const current = PROJECTS[active];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("carouselLabel")}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(rtl ? -1 : 1);
        if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      }}
    >
      <p aria-live="polite" className="sr-only">
        {t("slideStatus", { name: name(current.key), index: active + 1, total })}
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
          {PROJECTS.map((p, i) => {
            const slot = slotFor(i, active, total);
            const s = MOBILE[slot];
            const box = mirror(s.card, MOBILE_CANVAS.w, rtl);
            return (
              <article
                key={p.key}
                aria-hidden={slot !== "center"}
                onClick={() => {
                  if (!touchMoved.current) {
                    setActive(i);
                  }
                }}
                className="absolute cursor-pointer"
                style={{
                  left: box.x,
                  top: box.y,
                  width: box.w,
                  height: box.h,
                  zIndex: s.z,
                  borderRadius: s.radius,
                  background: s.bg,
                  border: `0.5px solid ${s.border}`,
                  transition: transition(["left", "top", "width", "height", "border-radius", "background-color", "border-color", "z-index"]),
                }}
              >
                <div
                  className="absolute overflow-hidden"
                  style={{
                    ...pos(s.image, rtl),
                    width: s.image.w,
                    height: s.image.h,
                    borderRadius: s.imageRadius,
                    transition: transition(["left", "right", "top", "width", "height", "border-radius"]),
                  }}
                >
                  <Image src={p.thumb} alt="" fill sizes="227px" className="object-cover" draggable={false} />
                </div>
                <CardText
                  slot={slot}
                  spec={s}
                  rtl={rtl}
                  title={name(p.key)}
                  description={t(`projects.${p.key}.description`)}
                  variant="mobile"
                />
              </article>
            );
          })}
        </div>
      </div>

      {/* ---------- Desktop stage ---------- */}
      <div
        className="relative hidden select-none lg:block cursor-grab active:cursor-grabbing"
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
          {PROJECTS.map((p, i) => {
            const slot = slotFor(i, active, total);
            const s = DESKTOP[slot];
            const box = mirror(s.card, DESKTOP_CANVAS.w, rtl);
            return (
              <article
                key={p.key}
                aria-hidden={slot !== "center"}
                onClick={() => slot !== "center" && setActive(i)}
                className={
                  "group absolute " +
                  (slot === "center" ? "" : "cursor-pointer")
                }
                style={{
                  left: box.x,
                  top: box.y,
                  width: box.w,
                  height: box.h,
                  zIndex: s.z,
                  transition: transition(["left", "top", "width", "height", "z-index", "filter"]),
                  filter: slot === "center" ? "none" : "brightness(0.92)",
                }}
              >
                <Image
                  src={p.card}
                  alt=""
                  fill
                  sizes="552px"
                  className="object-cover"
                  draggable={false}
                  priority={p.key === "nexora"}
                />
                <CardText
                  slot={slot}
                  spec={s}
                  rtl={rtl}
                  title={name(p.key)}
                  description={t(`projects.${p.key}.description`)}
                  variant="desktop"
                />
              </article>
            );
          })}
        </div>
      </div>

      {/* ---------- Navigation ---------- */}
      <div className="relative z-20 mt-[38.5px] flex items-center justify-center lg:mt-[42px] lg:-translate-x-[20px] lg:rtl:translate-x-[20px]">
        <NavArrow direction="prev" label={t("previous")} onClick={() => go(-1)} />
        <ul className="mx-[16px] flex items-center sm:mx-[24px] lg:mx-[50px] lg:gap-[10px]">
          {PROJECTS.map((p, i) => (
            <li key={p.key}>
              <button
                type="button"
                aria-label={t("goTo", { name: name(p.key) })}
                aria-current={i === active}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                className="group flex min-h-[48px] min-w-[40px] cursor-pointer items-center justify-center p-2 focus-visible:outline-2 focus-visible:outline-periwinkle"
              >
                <span
                  className={
                    "block size-[11px] rounded-full transition-all duration-300 lg:size-[14px] " +
                    (i === active
                      ? "scale-125 bg-[#b67cff] shadow-[0_0_12px_rgba(182,124,255,0.7)] lg:bg-lilac"
                      : "bg-[#959dc5] group-hover:bg-[#b4bbe0] lg:bg-pager")
                  }
                />
              </button>
            </li>
          ))}
        </ul>
        <NavArrow direction="next" label={t("next")} onClick={() => go(1)} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */

function CardText({
  slot,
  spec,
  rtl,
  title,
  description,
  variant,
}: {
  slot: Slot;
  spec: SlotSpec;
  rtl: boolean;
  title: string;
  description: string;
  variant: "mobile" | "desktop";
}) {
  const desktop = variant === "desktop";
  const center = slot === "center";
  const titleClass = desktop
    ? center
      ? "text-[32px] leading-[40px] font-semibold text-white"
      : "text-[25px] leading-[32px] font-normal text-[#f5f4ff]"
    : center
      ? "text-[16px] leading-[25.6px] font-medium text-fg"
      : "text-[16px] leading-[21.3px] font-normal text-fg";

  const fade = (visible: boolean): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transition: `opacity ${visible ? 450 : 200}ms ease ${visible ? DURATION * 0.45 : 0}ms`,
    pointerEvents: visible ? "auto" : "none",
  });

  const desc = spec.desc ?? (desktop ? DESKTOP.center.desc! : MOBILE.center.desc!);
  const btn = spec.button;

  return (
    <>
      <h3
        className={`absolute whitespace-nowrap ${titleClass}`}
        style={{
          ...pos({ ...spec.title, w: 0, h: 0 }, rtl),
          transition: transition(["left", "right", "top", "font-size", "line-height"]),
        }}
      >
        {title}
      </h3>

      <p
        className={
          "absolute whitespace-pre-line " +
          (desktop
            ? "max-w-[300px] text-[20px] leading-[30px] text-[#e6e5f2]"
            : "max-w-[164px] text-[12px] leading-[16.9px] text-[#e1dff8]")
        }
        style={{ ...pos({ ...desc, w: 0, h: 0 }, rtl), ...fade(center) }}
      >
        {description}
      </p>

      <span
        aria-hidden="true"
        className={
          "absolute flex items-center justify-center rounded-full " +
          (desktop
            ? "border-[1.1px] border-[#f0f2ff]/40 bg-[#101639]/12 text-[#eef1ff] transition-[background-color,border-color] duration-300 group-hover:border-white/70 group-hover:bg-white/10"
            : "border-[0.5px] border-[#8392c3]/70 bg-[#121c34]/50 text-[#f5f1ff]")
        }
        style={{
          ...pos({ x: btn?.x ?? 0, y: btn?.y ?? 0, w: btn?.size ?? 0, h: 0 }, rtl),
          width: btn?.size ?? 0,
          height: btn?.size ?? 0,
          ...fade(Boolean(btn)),
        }}
      >
        <svg
          viewBox="0 0 29 29"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="rtl:-scale-x-100"
          style={{
            width: desktop ? "58%" : "55%",
            height: desktop ? "58%" : "55%",
            strokeWidth: desktop ? 2.1 : 1.9,
          }}
        >
          <path d="M4 14.5H24M16 22.5L24 14.5L16 6.5" />
        </svg>
      </span>
    </>
  );
}

function NavArrow({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group flex size-[52px] min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-full text-[#f3f5ff] transition-all hover:bg-white/10 active:scale-90 focus-visible:outline-2 focus-visible:outline-periwinkle lg:size-[52px] lg:text-[#eef1ff]"
    >
      <svg
        viewBox="0 0 29 29"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={
          "size-[26px] stroke-[2.2] transition-transform duration-300 lg:size-[29px] lg:stroke-[2.1] rtl:-scale-x-100 " +
          (direction === "prev" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")
        }
      >
        {direction === "prev" ? (
          <path d="M25 14.5H5M13 22.5L5 14.5L13 6.5" />
        ) : (
          <path d="M4 14.5H24M16 22.5L24 14.5L16 6.5" />
        )}
      </svg>
    </button>
  );
}

/** Mirror a box horizontally inside a canvas for RTL. */
function mirror(b: Box, canvasW: number, rtl: boolean): Box {
  return rtl ? { ...b, x: canvasW - b.x - b.w } : b;
}

/** Position a child inside a card using inline-start so it mirrors in RTL. */
function pos(b: Box, rtl: boolean): CSSProperties {
  return rtl ? { right: b.x, top: b.y } : { left: b.x, top: b.y };
}
