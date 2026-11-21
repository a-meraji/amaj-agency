"use client";

import { useActionState } from "react";
import { requestPasswordReset, updatePassword } from "../auth-actions";

const inputClass = "mt-1 min-h-11 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 focus-visible:outline-2 focus-visible:outline-indigo-300";

export function PasswordForm({ update, invalid }: { update: boolean; invalid: boolean }) {
  const [message, action, pending] = useActionState(update ? updatePassword : requestPasswordReset, "");
  const label = update ? "Save password" : "Send password link";

  return (
    <>
      <h1 className="mt-5 text-2xl font-bold">{update ? "Choose a new password" : "Set or reset your password"}</h1>
      {invalid && <p role="alert" className="mt-3 text-sm text-rose-200">This password link is invalid or expired.</p>}
      <form action={action} className="mt-6 grid gap-4">
        {update ? (
          <label className="text-sm font-medium">
            New password
            <input className={inputClass} name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} />
          </label>
        ) : (
          <label className="text-sm font-medium">
            Email address
            <input className={inputClass} name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
        )}
        {message && <p role="status" className="text-sm text-slate-200">{message}</p>}
        <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-indigo-300 px-4 text-sm font-bold text-slate-950 hover:bg-indigo-200 disabled:opacity-60">
          {pending ? "Working…" : label}
        </button>
      </form>
    </>
  );
}
