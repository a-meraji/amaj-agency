import { NextResponse } from "next/server";
import { isContentAdmin } from "@/lib/content/authorization";
import { sessionClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (code) {
    const client = await sessionClient({ writable: true });
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error && await isContentAdmin(client)) {
      return new NextResponse(null, { status: 303, headers: { Location: "/admin/password?update=1" } });
    }
    if (!error) await client.auth.signOut({ scope: "local" });
  }
  return new NextResponse(null, { status: 303, headers: { Location: "/admin/password?invalid=1" } });
}
