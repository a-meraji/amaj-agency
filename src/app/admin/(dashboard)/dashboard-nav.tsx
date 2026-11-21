"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { DashboardIcon, dashboardLinks } from "./dashboard-ui";

export function DashboardNav() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  const navigation = (
      <nav aria-label="Admin navigation" className="px-3 pb-3 lg:p-4">
        <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {dashboardLinks.map(({ icon, href, label }) => {
            const active = href === pathname || (href !== "/admin" && pathname.startsWith(href + "/"));
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => { if (menu.current) menu.current.open = false; }}
                  className="flex min-h-[44px] items-center gap-3 rounded-sm border border-transparent px-3 text-sm font-bold text-fg-muted-blue transition-colors hover:bg-ink-800 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle aria-[current=page]:border-periwinkle/35 aria-[current=page]:bg-ink-700 aria-[current=page]:text-fg"
                >
                  <DashboardIcon name={icon} className="size-[19px] shrink-0 text-periwinkle" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
  );

  return (
    <>
      <aside className="hidden self-start border-e border-line bg-ink-950 lg:sticky lg:top-[64px] lg:block lg:h-[calc(100dvh-64px)] lg:overflow-y-auto">
        {navigation}
      </aside>
      <details ref={menu} className="group/nav border-b border-line bg-ink-950 lg:hidden">
        <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 font-bold text-fg-soft focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-periwinkle sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-3"><DashboardIcon name="menu" /> Admin menu</span>
          <DashboardIcon name="next" className="size-4 transition-transform group-open/nav:rotate-90" />
        </summary>
        {navigation}
      </details>
    </>
  );
}
