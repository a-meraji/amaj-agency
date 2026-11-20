"use client";

import { useActionState, useState } from "react";
import { signIn } from "../auth-actions";

const inputClass = "mt-1 min-h-11 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 focus-visible:outline-2 focus-visible:outline-indigo-300";

export function LoginForm({ accessDenied = false }: { accessDenied?: boolean }) {
  const [message, action, pending] = useActionState(signIn, "");
  const [email, setEmail] = useState("");

  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className="text-sm font-medium">
        Email address
        <input className={inputClass} name="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} />
      </label>
      <label className="text-sm font-medium">
        Password
        <input className={inputClass} name="password" type="password" autoComplete="current-password" required maxLength={256} />
      </label>
      {(message || accessDenied) && (
        <p role="alert" className="text-sm text-rose-200">
          {message || "This account does not have access to the dashboard."}
        </p>
      )}
      <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-indigo-300 px-4 text-sm font-bold text-slate-950 hover:bg-indigo-200 disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
