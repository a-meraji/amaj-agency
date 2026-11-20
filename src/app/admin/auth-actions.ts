"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isContentAdmin } from "@/lib/content/authorization";
import { sessionClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),
  password: z.string().min(1).max(256),
});

export async function signIn(_previous: string, form: FormData) {
  const input = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!input.success) return "Enter your email address and password.";

  try {
    const client = await sessionClient({ writable: true });
    const { error } = await client.auth.signInWithPassword(input.data);
    if (error) return "Sign-in failed. Check your credentials and try again.";
    if (!await isContentAdmin(client)) {
      await client.auth.signOut({ scope: "local" });
      return "This account does not have access to the dashboard.";
    }
  } catch {
    return "Sign-in is temporarily unavailable. Please try again.";
  }
  redirect("/admin");
}

export async function signOut() {
  const client = await sessionClient({ writable: true });
  await client.auth.signOut({ scope: "local" });
  redirect("/admin/login");
}
