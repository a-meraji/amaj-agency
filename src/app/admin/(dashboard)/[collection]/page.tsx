import Link from "next/link";
import { notFound } from "next/navigation";
import { listEntries } from "@/lib/content/admin";
import { collectionSchema, collections } from "@/lib/content/editor-fields";
import { adminPanel, DashboardIcon, pageTitle, primaryButton } from "../dashboard-ui";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const parsed = collectionSchema.safeParse((await params).collection);
  if (!parsed.success) notFound();
  const collection = parsed.data;
  const { label, singular } = collections[collection];
  const entries = await listEntries(collection);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className={pageTitle}>{label}</h1>
        <Link href={"/admin/" + collection + "/new"} className={primaryButton}>New {singular}</Link>
      </div>
      {entries.length === 0 ? (
        <p className={adminPanel + " mt-6 p-5 text-fg-muted-blue"}>There are no entries yet.</p>
      ) : (
        <div className={adminPanel + " mt-6"}>
          <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_7rem_1rem] gap-4 rounded-t-md border-b border-line bg-ink-950/50 px-5 py-3 text-sm font-bold text-fg-muted-blue sm:grid">
            <span>Name</span><span>Slug</span><span>Status</span>
          </div>
          <ul className="divide-y divide-line">
            {entries.map(entry => (
              <li key={entry.id}>
                <Link href={"/admin/" + collection + "/" + entry.id} className="grid min-h-14 grid-cols-[minmax(0,1fr)_auto_1rem] items-center gap-x-3 gap-y-1 px-3 py-3 hover:bg-ink-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-periwinkle sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_7rem_1rem] sm:gap-4 sm:px-5">
                  <span className="break-words font-bold">{entry.label}</span>
                  <span className="col-start-1 row-start-2 break-all text-sm text-fg-muted-blue sm:col-auto sm:row-auto">{entry.slug}</span>
                  <span className={"col-start-2 row-span-2 row-start-1 w-fit rounded-sm border px-2 py-1 text-xs font-bold sm:col-auto sm:row-auto " + (entry.is_published ? "border-periwinkle/40 bg-periwinkle/10 text-fg" : "border-line text-fg-muted-blue")}>
                    {entry.is_published ? "Published" : "Draft"}
                  </span>
                  <DashboardIcon name="next" className="col-start-3 row-span-2 row-start-1 size-4 text-periwinkle sm:col-auto sm:row-auto" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
