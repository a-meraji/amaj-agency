import Link from "next/link";
import { Suspense } from "react";
import { LogoMark } from "@/components/icons/brand";
import { requireContentAdmin } from "@/lib/content/authorization";
import { signOut } from "../auth-actions";
import { DashboardNav } from "./dashboard-nav";
import { DashboardIcon, secondaryButton } from "./dashboard-ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-center" role="status">Loading dashboard…</p>}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = await requireContentAdmin();

  return (
    <div className="min-h-dvh bg-ink-900 text-fg">
      <a href="#admin-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-ink-950 focus:p-3 focus:text-fg">Skip to content</a>
      <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between gap-2 border-b border-line bg-ink-950 px-3 sm:gap-4 sm:px-6">
        <Link href="/admin" className="flex min-h-[44px] min-w-0 items-center gap-2 rounded-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle sm:gap-3">
          <LogoMark className="h-6 w-7 shrink-0 text-periwinkle" />
          <span className="truncate">Amaj Admin</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {user.email && <span className="hidden max-w-64 truncate text-sm text-fg-muted-blue md:block" title={user.email}>{user.email}</span>}
          <Link href="/" aria-label="View site" className={secondaryButton}>
            <DashboardIcon name="external" className="size-4" /><span className="hidden sm:inline">View site</span>
          </Link>
          <form action={signOut}>
            <button type="submit" className={secondaryButton} aria-label="Sign out">
              <DashboardIcon name="logout" className="size-4" /><span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </header>
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)]">
        <Suspense fallback={null}><DashboardNav /></Suspense>
        <main id="admin-content" className="min-w-0 scroll-mt-[64px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
