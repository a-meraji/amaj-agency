import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry, listMedia } from "@/lib/content/admin";
import { requireContentAdmin } from "@/lib/content/authorization";
import { collectionSchema, collections } from "@/lib/content/editor-fields";
import { recordIdSchema } from "@/lib/content/validation";
import { deleteEntry, saveEntry } from "../../../content-actions";
import { ContentForm, DeleteForm } from "../../content-form";

export default async function EditEntryPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  await requireContentAdmin();
  const { collection: requestedCollection, id } = await params;
  const parsed = collectionSchema.safeParse(requestedCollection);
  if (!parsed.success) notFound();
  const collection = parsed.data;
  const isNew = id === "new";
  if (!isNew && !recordIdSchema.safeParse(id).success) notFound();
  const { label, singular, fields } = collections[collection];
  const [entry, images] = await Promise.all([
    isNew ? null : getEntry(collection, id),
    fields.some(field => field.kind === "image") ? listMedia({ imagesOnly: true }) : [],
  ]);
  if (!isNew && !entry) notFound();

  const initial = entry ?? (collection === "articles" ? { publish_date: new Date().toISOString().slice(0, 10) } : {});

  return (
    <>
      <Link href={`/admin/${collection}`} className="text-sm text-periwinkle hover:underline">← {label}</Link>
      <h1 className="mt-2 text-[28px] leading-tight font-bold tracking-tight sm:text-h2">{isNew ? "New" : "Edit"} {singular}</h1>
      <ContentForm key={id} fields={fields} initial={initial} images={images} save={saveEntry.bind(null, collection, isNew ? null : id)} />
      {entry && <DeleteForm label={singular} remove={deleteEntry.bind(null, collection, id)} />}
    </>
  );
}
