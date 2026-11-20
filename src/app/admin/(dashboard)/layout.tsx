import Link from "next/link";
import { Suspense } from "react";
import { requireContentAdmin } from "@/lib/content/authorization";
import { collectionNames, collections } from "@/lib/content/editor-fields";
import { signOut } from "../auth-actions";

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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-5">
        <div className="min-w-0">
          <Link href="/admin" className="text-xl font-bold">Amaj content admin</Link>
          {user.email && <p className="break-all text-sm text-slate-300">{user.email}</p>}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-indigo-200 hover:underline">View site</Link>
          <form action={signOut}>
            <button type="submit" className="min-h-10 rounded-lg border border-slate-600 px-3 hover:bg-slate-800">Sign out</button>
          </form>
        </div>
      </header>
      <div className="grid gap-6 py-6 md:grid-cols-[10rem_minmax(0,1fr)]">
        <nav aria-label="Admin navigation" className="flex flex-wrap content-start gap-2 md:flex-col">
          <Link className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" href="/admin">Overview</Link>
          {collectionNames.map(collection => (
            <Link key={collection} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" href={`/admin/${collection}`}>
              {collections[collection].label}
            </Link>
          ))}
          <Link className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" href="/admin/settings">Site settings</Link>
          <Link className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" href="/admin/media">Media library</Link>
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
}
