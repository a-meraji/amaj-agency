import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { sessionClient } from "@/lib/supabase/server";

type SessionClient = Awaited<ReturnType<typeof sessionClient>>;

export async function isContentAdmin(client: SessionClient) {
  const { data, error } = await client.rpc("is_content_admin");
  if (error) throw new Error("Admin authorization is temporarily unavailable.");
  return data === true;
}

export const requireContentAdmin = cache(async (writable = false) => {
  const client = await sessionClient({ writable });
  const { data: { user }, error } = await client.auth.getUser();
  if (error && (!error.status || error.status >= 500)) {
    throw new Error("Admin authentication is temporarily unavailable.");
  }
  if (!user) redirect("/admin/login");
  if (!await isContentAdmin(client)) redirect("/admin/login?access=denied");
  return { client, user };
});
