import Link from "next/link";
import { collectionNames, collections } from "@/lib/content/editor-fields";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold">Manage site content</h1>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {collectionNames.map(collection => (
          <Link key={collection} href={`/admin/${collection}`} className="rounded-xl border border-slate-700 bg-[#111a31] p-5 font-semibold hover:border-indigo-300">
            {collections[collection].label}
          </Link>
        ))}
        <Link href="/admin/settings" className="rounded-xl border border-slate-700 bg-[#111a31] p-5 font-semibold hover:border-indigo-300">Site settings</Link>
        <Link href="/admin/media" className="rounded-xl border border-slate-700 bg-[#111a31] p-5 font-semibold hover:border-indigo-300">Media library</Link>
      </div>
    </>
  );
}
