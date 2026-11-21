"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isContentAdmin } from "@/lib/content/authorization";
import { sessionClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),
  password: z.string().min(1).max(256),
});

export async function requestPasswordReset(_previous: string, form: FormData) {
  const email = loginSchema.shape.email.safeParse(form.get("email"));
  if (!email.success) return "Enter a valid email address.";
  const origin = process.env.SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

  try {
    const client = await sessionClient({ writable: true });
    const { error } = await client.auth.resetPasswordForEmail(email.data, {
      redirectTo: new URL("/admin/password/callback", origin).href,
    });
    if (error && (!error.status || error.status >= 500)) return "Email delivery is temporarily unavailable.";
  } catch {
    return "Email delivery is temporarily unavailable.";
  }

  return "If the address is registered, check your inbox and open the link in this browser.";
}

export async function updatePassword(_previous: string, form: FormData) {
  const password = z.string().min(12).max(72).safeParse(form.get("password"));
  if (!password.success) return "Choose a password with 12 to 72 characters.";
  const client = await sessionClient({ writable: true });
  const { data: { user } } = await client.auth.getUser();
  if (!user || !await isContentAdmin(client)) return "This password link is invalid or expired.";
  const { error } = await client.auth.updateUser({ password: password.data });
  if (error) return "Password could not be updated. Open a new password link and try again.";
  redirect("/admin");
}

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
