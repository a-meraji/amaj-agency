import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";

type LoginProps = { searchParams: Promise<{ access?: string }> };

export default function AdminLogin({ searchParams }: LoginProps) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#111a31] p-6 sm:p-8">
        <Link href="/" className="text-sm text-indigo-200 hover:underline">← View site</Link>
        <h1 className="mt-5 text-3xl font-bold">Admin sign-in</h1>
        <Suspense fallback={<LoginForm />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function LoginContent({ searchParams }: LoginProps) {
  const { access } = await searchParams;
  return <LoginForm accessDenied={access === "denied"} />;
}
