import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/content/database";
import { supabaseConfig } from "@/lib/supabase/config";

function adminResponse(request: NextRequest) {
  const response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function proxy(request: NextRequest) {
  let response = adminResponse(request);
  if (!request.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"))) {
    return response;
  }

  const { url, key } = supabaseConfig();
  const client = createServerClient<Database>(url, key, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        const nextResponse = adminResponse(request);
        for (const cookie of response.cookies.getAll()) nextResponse.cookies.set(cookie);
        for (const { name, value, options } of cookiesToSet) nextResponse.cookies.set(name, value, options);
        for (const [name, value] of Object.entries(headers)) nextResponse.headers.set(name, value);
        nextResponse.headers.set("Cache-Control", "private, no-store");
        response = nextResponse;
      },
    },
  });
  await client.auth.getClaims();
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
