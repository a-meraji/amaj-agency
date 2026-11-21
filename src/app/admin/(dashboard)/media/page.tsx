import { listMedia } from "@/lib/content/admin";
import { pageTitle } from "../dashboard-ui";
import { MediaLibrary } from "../media-library";

export default async function MediaLibraryPage() {
  const assets = await listMedia();

  return (
    <>
      <h1 className={pageTitle}>Media library</h1>
      <div className="mt-6">
        <MediaLibrary assets={assets} />
      </div>
    </>
  );
}
