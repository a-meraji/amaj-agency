import Link from "next/link";
import { Suspense } from "react";
import { PasswordForm } from "./password-form";

type Props = { searchParams: Promise<{ update?: string; invalid?: string }> };

export default function PasswordPage({ searchParams }: Props) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#111a31] p-6 sm:p-8">
        <Link href="/admin/login" className="text-sm text-indigo-200 hover:underline">← Back to sign-in</Link>
        <Suspense fallback={<p role="status" className="mt-5">Loading password form…</p>}>
          <PasswordContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function PasswordContent({ searchParams }: Props) {
  const { update, invalid } = await searchParams;
  return <PasswordForm update={update === "1"} invalid={invalid === "1"} />;
}
