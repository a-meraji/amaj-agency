import { getEditableSettings } from "@/lib/content/admin";
import { settingsFields } from "@/lib/content/editor-fields";
import { saveSettings } from "../../content-actions";
import { ContentForm } from "../content-form";

export default async function SiteSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [settings, query] = await Promise.all([getEditableSettings(), searchParams]);

  return (
    <>
      <h1 className="text-3xl font-bold">Site settings</h1>
      {query.saved === "1" && <p role="status" className="mt-3 text-emerald-200">Settings saved.</p>}
      <ContentForm fields={settingsFields} initial={settings ?? {}} save={saveSettings} />
    </>
  );
}
