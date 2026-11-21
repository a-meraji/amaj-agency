"use client";

import { useActionState, useState } from "react";
import type { MediaAsset } from "@/lib/content/database";
import type { EditorField } from "@/lib/content/editor-fields";
import { adminInput, adminPanel, primaryButton } from "./dashboard-ui";
import { isContentImagePath } from "@/lib/content/media";
import { MediaPicker } from "./media-picker";
import { MediaPreview } from "./media-preview";

type Values = Partial<Record<string, string | number | boolean>>;
type FormState = { message?: string; fields?: Record<string, string> };
type SaveAction = (state: FormState, form: FormData) => Promise<FormState>;

const controlClass = adminInput;

export function ContentForm({
  fields,
  initial,
  save,
  images = [],
}: {
  fields: EditorField[];
  initial: Values;
  save: SaveAction;
  images?: MediaAsset[];
}) {
  const [feedback, action, pending] = useActionState(save, {});
  const [values, setValues] = useState(initial);

  return (
    <form action={action} className={adminPanel + " mt-6 grid gap-5 p-4 sm:p-6 lg:grid-cols-2"}>
      {fields.map(field => {
        const wide = field.kind === "image" || field.kind === "textarea";
        const change = (value: string | boolean) =>
          setValues(current => ({ ...current, [field.name]: value }));

        return (
          <div key={field.name} className={wide ? "min-w-0 lg:col-span-2" : "min-w-0"}>
            {field.kind === "image" ? (
              <ImageField
                field={field}
                value={String(values[field.name] ?? "")}
                error={feedback.fields?.[field.name]}
                images={images}
                change={change}
              />
            ) : (
              <Field
                field={field}
                value={values[field.name] ?? field.defaultValue ?? ""}
                error={feedback.fields?.[field.name]}
                change={change}
              />
            )}
          </div>
        );
      })}
      {feedback.message && <p role="alert" className="text-sm text-rose-200 lg:col-span-2">{feedback.message}</p>}
      <button type="submit" disabled={pending} className={primaryButton + " justify-self-start lg:col-span-2"}>
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function ImageField({ field, value, error, images, change }: {
  field: EditorField;
  value: string;
  error?: string;
  images: MediaAsset[];
  change: (value: string) => void;
}) {
  return (
    <fieldset className="grid min-w-0 gap-4 rounded-lg border border-line p-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-start">
      <legend className="px-1 text-sm font-semibold">{field.label}</legend>
      <MediaPreview
        path={isContentImagePath(value) ? value : undefined}
        label={field.label}
        image
        emptyMessage={value ? "Enter a valid image path to preview it." : "No image selected"}
      />
      <div className="grid min-w-0 gap-3">
        <MediaPicker assets={images} value={value} onSelect={change} />
        <details open={error ? true : undefined}>
          <summary className="min-h-[44px] cursor-pointer py-3 text-sm font-semibold text-fg-muted-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle">
            Enter an image path
          </summary>
          <Field field={{ ...field, optional: true, max: 512, label: "Image path" }} value={value} error={error} change={path => change(String(path))} />
        </details>
      </div>
    </fieldset>
  );
}

function Field({
  field,
  value,
  error,
  change,
}: {
  field: EditorField;
  value: string | number | boolean;
  error?: string;
  change: (value: string | boolean) => void;
}) {
  const { kind, name, label, options, help } = field;
  const id = `field-${name}`;
  if (kind === "checkbox") {
    return (
      <label className="flex min-h-[44px] items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name={name} checked={Boolean(value)} onChange={event => change(event.target.checked)} className="size-5 shrink-0 accent-periwinkle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle" />
        {label}
      </label>
    );
  }

  const descriptionId = error || help ? `${id}-help` : undefined;
  const properties = {
    id,
    name,
    required: !field.optional,
    className: controlClass,
    value: String(value),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": descriptionId,
  };

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      {kind === "select" ? (
        <select {...properties} onChange={event => change(event.target.value)}>
          <option value="" disabled>Select an option</option>
          {options?.map(option => <option value={option} key={option}>{option}</option>)}
        </select>
      ) : kind === "textarea" ? (
        <textarea {...properties} maxLength={field.max} rows={name === "body" ? 12 : 4} onChange={event => change(event.target.value)} />
      ) : (
        <input
          {...properties}
          type={kind === "date" || kind === "number" ? kind : "text"}
          maxLength={kind === "number" ? undefined : field.max}
          min={kind === "number" ? field.min : undefined}
          max={kind === "number" ? field.max : undefined}
          onChange={event => change(event.target.value)}
        />
      )}
      {(error || help) && <p id={descriptionId} className={error ? "text-sm text-rose-200" : "text-sm text-fg-muted-blue"}>{error || help}</p>}
    </div>
  );
}

export function DeleteForm({
  remove,
  label,
}: {
  remove: (state: FormState, form: FormData) => Promise<FormState>;
  label: string;
}) {
  const [feedback, action, pending] = useActionState(remove, {});

  return (
    <details className="mt-6 rounded-xl border border-line p-4">
      <summary className="min-h-[44px] cursor-pointer py-3 text-sm font-semibold text-rose-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle">Delete {label}</summary>
      <form action={action} className="mt-4">
        <p className="text-sm text-fg-muted-blue">Delete this entry permanently?</p>
        {feedback.message && <p role="alert" className="mt-2 text-sm text-rose-200">{feedback.message}</p>}
        <button type="submit" disabled={pending} className="mt-3 min-h-[44px] rounded-lg bg-rose-300 px-4 text-sm font-bold text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle disabled:opacity-60">
          {pending ? "Deleting…" : "Confirm delete"}
        </button>
      </form>
    </details>
  );
}
