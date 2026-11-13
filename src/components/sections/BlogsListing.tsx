"use client";

import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { CalendarIcon, ClockIcon, ArrowRightBlog } from "@/components/icons/ui";

export type BlogCategory = "all" | "product" | "engineering" | "design" | "ai" | "growth";
export type SortOption = "latest" | "oldest" | "readingTime";

export interface Article {
  id: string;
  category: BlogCategory;
  categoryKey: string;
  tagColor: string;
  image: string;
  titleKey: string;
  excerptKey: string;
  dateStr: string;
  dateObj: Date;
  readMinutes: number;
}

const ARTICLES: Article[] = [
  {
    id: "product-thinking",
    category: "product",
    categoryKey: "product",
    tagColor: "from-[#4b66f6] to-[#6091fa]",
    image: "/images/blog/featured.webp",
    titleKey: "productThinking.title",
    excerptKey: "productThinking.excerpt",
    dateStr: "Jan 26, 2025",
    dateObj: new Date("2025-01-26"),
    readMinutes: 8,
  },
  {
    id: "engineering-scale",
    category: "engineering",
    categoryKey: "engineering",
    tagColor: "from-[#10b981] to-[#34d399]",
    image: "/images/blog/engineering.webp",
    titleKey: "engineering.title",
    excerptKey: "engineering.excerpt",
    dateStr: "Jan 20, 2025",
    dateObj: new Date("2025-01-20"),
    readMinutes: 6,
  },
  {
    id: "better-ux",
    category: "design",
    categoryKey: "design",
    tagColor: "from-[#8b5cf6] to-[#a78bfa]",
    image: "/images/blog/ux.webp",
    titleKey: "ux.title",
    excerptKey: "ux.excerpt",
    dateStr: "Jan 15, 2025",
    dateObj: new Date("2025-01-15"),
    readMinutes: 5,
  },
  {
    id: "sustainable-growth",
    category: "growth",
    categoryKey: "growth",
    tagColor: "from-[#f59e0b] to-[#fbbf24]",
    image: "/images/blog/growth.webp",
    titleKey: "growth.title",
    excerptKey: "growth.excerpt",
    dateStr: "Jan 10, 2025",
    dateObj: new Date("2025-01-10"),
    readMinutes: 6,
  },
  {
    id: "ai-agents-production",
    category: "ai",
    categoryKey: "ai",
    tagColor: "from-[#ec4899] to-[#f472b6]",
    image: "/images/blog/featured.webp",
    titleKey: "ai.title",
    excerptKey: "ai.excerpt",
    dateStr: "Jan 05, 2025",
    dateObj: new Date("2025-01-05"),
    readMinutes: 7,
  },
  {
    id: "resilient-frontend",
    category: "engineering",
    categoryKey: "engineering",
    tagColor: "from-[#10b981] to-[#34d399]",
    image: "/images/blog/engineering.webp",
    titleKey: "frontend.title",
    excerptKey: "frontend.excerpt",
    dateStr: "Dec 28, 2024",
    dateObj: new Date("2024-12-28"),
    readMinutes: 4,
  },
];

const CATEGORIES: { key: BlogCategory; labelKey: string }[] = [
  { key: "all", labelKey: "all" },
  { key: "product", labelKey: "product" },
  { key: "engineering", labelKey: "engineering" },
  { key: "design", labelKey: "design" },
  { key: "ai", labelKey: "ai" },
  { key: "growth", labelKey: "growth" },
];

export function BlogsListing() {
  const tBlog = useTranslations("Blog");
  const tPage = useTranslations("BlogsPage");

  const [activeCategory, setActiveCategory] = useState<BlogCategory>("all");
  const [sortOption, setSortOption] = useState<SortOption>("latest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown on outside click or Escape key
  useEffect(() => {
    if (!isSortOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSortOpen]);

  // Helper to resolve localized title and excerpt with fallback
  const getArticleTitle = (titleKey: string) => {
    try {
      if (titleKey === "productThinking.title") return tBlog("posts.productThinking.title");
      if (titleKey === "engineering.title") return tBlog("posts.engineering.title");
      if (titleKey === "ux.title") return tBlog("posts.ux.title");
      if (titleKey === "growth.title") return tBlog("posts.growth.title");
      if (titleKey === "ai.title") return "Autonomous AI Agents in Enterprise Workflows";
      if (titleKey === "frontend.title") return "Next.js & Turbopack: Building Ultra-Fast Frontends";
      return titleKey;
    } catch {
      return titleKey;
    }
  };

  const getArticleExcerpt = (excerptKey: string) => {
    try {
      if (excerptKey === "productThinking.excerpt") return tBlog("posts.productThinking.excerpt");
      if (excerptKey === "engineering.excerpt") return tBlog("posts.engineering.excerpt");
      if (excerptKey === "ux.excerpt") return tBlog("posts.ux.excerpt");
      if (excerptKey === "growth.excerpt") return tBlog("posts.growth.excerpt");
      if (excerptKey === "ai.excerpt")
        return "Architecting multi-agent LLM systems with verifiable validation layers and human-in-the-loop telemetry.";
      if (excerptKey === "frontend.excerpt")
        return "Tactical patterns for lightning-fast server components, aggressive asset caching, and zero layout shift.";
      return excerptKey;
    } catch {
      return excerptKey;
    }
  };

  // Filter & Sort logic
  const filteredArticles = useMemo(() => {
    let result = ARTICLES.filter((article) => {
      if (activeCategory === "all") return true;
      return article.category === activeCategory;
    });

    result = [...result].sort((a, b) => {
      if (sortOption === "latest") return b.dateObj.getTime() - a.dateObj.getTime();
      if (sortOption === "oldest") return a.dateObj.getTime() - b.dateObj.getTime();
      if (sortOption === "readingTime") return a.readMinutes - b.readMinutes;
      return 0;
    });

    return result;
  }, [activeCategory, sortOption]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ink-950 pt-[120px] pb-[130px] lg:pt-[150px] lg:pb-[160px]">
      <GridBackdrop className="-z-10" />

      {/* Ambient background glows */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-20 start-1/4 -z-10 h-[500px] w-[600px] rounded-full bg-[#4633ff]/10 blur-[120px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/3 end-10 -z-10 h-[450px] w-[550px] rounded-full bg-[#3561ff]/10 blur-[110px]"
      />

      <div className="mx-auto max-w-[1672px] px-6 lg:px-[80px] xl:px-[114px]">
        {/* Minimalist Header */}
        <header className="flex flex-col items-center text-center">
          <Eyebrow tone="periwinkle" startLine="w-[60px] lg:w-[120px]" endLine="w-[60px] lg:w-[120px]">
            {tPage("eyebrow")}
          </Eyebrow>

          <h1 className="mt-3 text-[36px] leading-[44px] font-normal text-white sm:text-[46px] sm:leading-[54px] lg:text-[64px] lg:leading-[74px]">
            <span className="block sm:inline font-normal">{tPage("titleLight")}</span>{" "}
            <span className="font-bold text-[#628eff]">{tPage("titleBold")}</span>
          </h1>

          <p className="mt-3 max-w-[620px] text-[14.5px] leading-[23px] text-[#bdc7e4] sm:text-[16px] sm:leading-[26px]">
            {tPage("subtitle")}
          </p>
        </header>

        {/* Filter & Sort Bar (Minimalism and Essentialism) */}
        <div className="mt-10 sm:mt-12 flex flex-col gap-4 border-b border-[#232f55]/80 pb-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Categories Pill Navigation */}
          <div
            role="tablist"
            aria-label="Filter blog by category"
            className="flex flex-wrap items-center gap-2 sm:gap-2.5"
          >
            {CATEGORIES.map(({ key, labelKey }) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(key)}
                  className={`cursor-pointer rounded-[12px] px-3.5 py-1.5 text-[13px] sm:px-4 sm:py-2 sm:text-[14px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#4d6bfe] to-[#45b7fe] text-white shadow-md shadow-[#4d6bfe]/30 font-semibold scale-[1.02]"
                      : "border border-[#232f55] bg-[#111933]/70 text-[#9bb0ff] hover:border-indigo/50 hover:bg-[#162144] hover:text-white"
                  }`}
                >
                  {tPage(`categories.${labelKey}`)}
                </button>
              );
            })}
          </div>

          {/* Sort Controls & Counter */}
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <span className="text-[12.5px] sm:text-[13px] text-[#8697c7]">
              {tPage("showingCount", { count: filteredArticles.length })}
            </span>

            {/* Custom Dark Glass Dropdown (No native OS white picker!) */}
            <div ref={sortDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                className="group flex cursor-pointer items-center gap-2 rounded-[11px] sm:rounded-xl border border-[#263560] bg-[#111936]/90 px-3.5 py-1.5 text-[12.5px] sm:text-[13.5px] font-medium text-white shadow-sm backdrop-blur-md transition-all hover:border-indigo/50 hover:bg-[#162148] active:scale-95"
              >
                <span className="text-[#8697c7] hidden sm:inline">{tPage("sort.label")}:</span>
                <span className="font-semibold text-[#f1f2fc]">
                  {sortOption === "latest"
                    ? tPage("sort.latest")
                    : sortOption === "oldest"
                    ? tPage("sort.oldest")
                    : tPage("sort.readingTime")}
                </span>
                <svg
                  className={`size-4 text-[#8697c7] transition-transform duration-200 group-hover:text-white ${
                    isSortOpen ? "rotate-180 text-white" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 7.5L10 12.5L15 7.5" />
                </svg>
              </button>

              {/* Custom Dropdown Menu Panel */}
              <div
                role="listbox"
                className={`absolute end-0 top-full mt-2 z-40 min-w-[170px] origin-top-right rounded-[14px] border border-[#2b3a6b] bg-[#0f1733]/95 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-200 ${
                  isSortOpen
                    ? "scale-100 opacity-100 pointer-events-auto"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                {(
                  [
                    { value: "latest", labelKey: "sort.latest" },
                    { value: "oldest", labelKey: "sort.oldest" },
                    { value: "readingTime", labelKey: "sort.readingTime" },
                  ] as const
                ).map(({ value, labelKey }) => {
                  const isSelected = value === sortOption;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortOption(value);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-[10px] px-3 py-2 text-start text-[13px] transition-colors ${
                        isSelected
                          ? "bg-[#4d6bfe]/20 font-semibold text-[#6aa3ff]"
                          : "text-[#cbd5e1] hover:bg-[#18234d] hover:text-white"
                      }`}
                    >
                      <span>{tPage(labelKey)}</span>
                      {isSelected && (
                        <svg
                          className="size-4 text-[#6aa3ff]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filteredArticles.map((article) => {
              const title = getArticleTitle(article.titleKey);
              const excerpt = getArticleExcerpt(article.excerptKey);

              return (
                <article
                  key={article.id}
                  className="group flex flex-col overflow-hidden rounded-[20px] border border-[#232f55] bg-[#0d1633]/85 p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo/50 hover:bg-[#111c40] hover:shadow-2xl hover:shadow-indigo/10"
                >
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
                    <Image
                      src={article.image}
                      alt={title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="mt-4 flex flex-1 flex-col items-start">
                    {/* Category Tag */}
                    <span
                      className={`inline-flex items-center rounded-lg bg-gradient-to-r ${article.tagColor} px-2.5 py-0.5 text-[11px] sm:text-[12px] font-semibold text-white shadow-sm`}
                    >
                      {tPage(`categories.${article.categoryKey}`)}
                    </span>

                    {/* Title */}
                    <h2 className="mt-2.5 text-[17px] sm:text-[19px] leading-[25px] sm:leading-[27px] font-bold text-white transition-colors duration-200 group-hover:text-[#6aa3ff]">
                      {title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-2 text-[13px] sm:text-[14px] leading-[21px] sm:leading-[22px] text-[#a9b5da] line-clamp-3">
                      {excerpt}
                    </p>

                    {/* Meta Footer */}
                    <div className="mt-auto pt-5 w-full flex items-center justify-between border-t border-[#1e2a52] text-[12.5px] sm:text-[13px] text-[#93a2cf]">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>{article.dateStr}</span>
                        </div>
                        <span aria-hidden="true" className="text-white/20">
                          |
                        </span>
                        <div className="flex items-center gap-1.5">
                          <ClockIcon className="h-3.5 w-3.5" />
                          <span>{tPage("minRead", { minutes: article.readMinutes })}</span>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-[13px] font-medium text-[#6aa3ff] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        <span>{tPage("readArticle")}</span>
                        <ArrowRightBlog className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-16 flex flex-col items-center justify-center text-center p-8 rounded-[20px] border border-[#232f55] bg-[#0d1633]/60">
            <p className="text-[16px] text-[#a9b5da]">{tPage("noArticles")}</p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-4 cursor-pointer rounded-xl bg-gradient-to-r from-[#4d6bfe] to-[#45b7fe] px-4 py-2 text-[14px] font-semibold text-white shadow-md transition-all hover:scale-105"
            >
              {tPage("allCategories")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
