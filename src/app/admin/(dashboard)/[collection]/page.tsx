import Link from "next/link";
import { notFound } from "next/navigation";
import { listEntries } from "@/lib/content/admin";
import { collectionSchema, collections } from "@/lib/content/editor-fields";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const parsed = collectionSchema.safeParse((await params).collection);
  if (!parsed.success) notFound();
  const collection = parsed.data;
  const { label, singular } = collections[collection];
  const entries = await listEntries(collection);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{label}</h1>
        <Link href={`/admin/${collection}/new`} className="rounded-lg bg-indigo-300 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-indigo-200">
          New {singular}
        </Link>
      </div>
      {entries.length === 0 ? (
        <p className="mt-6 text-slate-300">There are no entries yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-slate-700 overflow-hidden rounded-xl border border-slate-700 bg-[#111a31]">
          {entries.map(entry => (
              <li key={entry.id}>
                <Link href={`/admin/${collection}/${entry.id}`} className="flex items-center justify-between gap-3 px-4 py-4 hover:bg-slate-800">
                  <span className="min-w-0 break-words">
                    <span className="block font-semibold">{entry.label}</span>
                    <span className="text-sm text-slate-300">{entry.slug}</span>
                  </span>
                  <span className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200">
                    {entry.is_published ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
          ))}
        </ul>
      )}
    </>
  );
}
